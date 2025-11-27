package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
)

// Handler bundles all auth-related HTTP handlers and dependencies.
type Handler struct {
	logger    *log.Logger
	jwtSecret []byte

	googleClientID string
	googleVerifier *oidc.IDTokenVerifier

	appleClientID string
	appleVerifier *oidc.IDTokenVerifier

	mu          sync.Mutex
	phoneOTPs   map[string]phoneOTPEntry
	otpLifetime time.Duration
}

// NewHandler constructs an auth handler. It initialises a Google ID token verifier if
// GOOGLE_CLIENT_ID is provided via environment or argument.
func NewHandler(logger *log.Logger, jwtSecret []byte, googleClientID string) (*Handler, error) {
	if logger == nil {
		logger = log.New(os.Stdout, "[auth] ", log.LstdFlags|log.Lshortfile)
	}

	h := &Handler{
		logger:      logger,
		jwtSecret:   jwtSecret,
		phoneOTPs:   make(map[string]phoneOTPEntry),
		otpLifetime: 5 * time.Minute,
	}

	// Prefer explicit argument, fall back to env var.
	if googleClientID == "" {
		googleClientID = os.Getenv("GOOGLE_CLIENT_ID")
	}
	h.googleClientID = googleClientID

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if googleClientID != "" {
		provider, err := oidc.NewProvider(ctx, "https://accounts.google.com")
		if err != nil {
			return nil, err
		}
		h.googleVerifier = provider.Verifier(&oidc.Config{
			ClientID: googleClientID,
		})
	}

	appleClientID := os.Getenv("APPLE_CLIENT_ID")
	h.appleClientID = appleClientID
	if appleClientID != "" {
		provider, err := oidc.NewProvider(ctx, "https://appleid.apple.com")
		if err != nil {
			return nil, err
		}
		h.appleVerifier = provider.Verifier(&oidc.Config{
			ClientID: appleClientID,
		})
	}

	return h, nil
}

type googleSignInRequest struct {
	IDToken     string `json:"idToken"`
	Code        string `json:"code"`
	RedirectURI string `json:"redirectUri"`
}

// AppleSignInRequest mirrors the Google request but for Apple ID tokens.
type appleSignInRequest struct {
	IDToken string `json:"idToken"`
}

type authUserResponse struct {
	ID                  string `json:"id"`
	OnboardingCompleted bool   `json:"onboardingCompleted"`
}

type authResponse struct {
	AccessToken  string           `json:"accessToken"`
	RefreshToken string           `json:"refreshToken"`
	User         authUserResponse `json:"user"`
}

type errorResponse struct {
	Error string `json:"error"`
}

// Structures for phone OTP flow
type phoneOTPEntry struct {
	Hash      string
	ExpiresAt time.Time
	Attempts  int
}

type phoneRequestOTP struct {
	Phone string `json:"phone"`
}

type phoneVerifyOTP struct {
	Phone string `json:"phone"`
	Code  string `json:"code"`
}

// GoogleSignIn handles POST /v1/auth/google
//
// It currently supports two request shapes:
//  1. { "idToken": "<google_id_token>" }  (original flow)
//  2. { "code": "<auth_code>", "redirectUri": "kindl://..." } (temporary, non-verified flow)
//
// The ID token path verifies the token against Google's OIDC provider.
// The auth code path is a temporary dev-only shortcut that skips remote verification
// and should be replaced with a proper code-exchange flow before production.
func (h *Handler) GoogleSignIn(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}

	var req googleSignInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, err)
		return
	}
	if req.IDToken == "" && req.Code == "" {
		h.writeError(w, http.StatusBadRequest, errors.New("idToken or code is required"))
		return
	}

	// Preferred, verified path: ID token from Google Sign-In.
	if req.IDToken != "" {
		if h.googleVerifier == nil {
			h.writeError(w, http.StatusInternalServerError, errors.New("google auth not configured"))
			return
		}

		ctx := r.Context()
		idToken, err := h.googleVerifier.Verify(ctx, req.IDToken)
		if err != nil {
			h.writeError(w, http.StatusUnauthorized, errors.New("invalid Google ID token"))
			return
		}

		var claims struct {
			Sub   string `json:"sub"`
			Email string `json:"email"`
		}

		if err := idToken.Claims(&claims); err != nil {
			h.writeError(w, http.StatusUnauthorized, errors.New("failed to read token claims"))
			return
		}

		if claims.Sub == "" {
			h.writeError(w, http.StatusUnauthorized, errors.New("missing subject in token"))
			return
		}

		// TODO: look up or create user in persistent storage based on claims.Sub / claims.Email.
		// For now we derive a stable synthetic ID from the Google subject.
		userID := "google:" + claims.Sub

		accessToken, refreshToken, err := h.issueTokens(userID)
		if err != nil {
			h.writeError(w, http.StatusInternalServerError, err)
			return
		}

		resp := authResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			User: authUserResponse{
				ID:                  userID,
				OnboardingCompleted: false,
			},
		}

		h.writeJSON(w, http.StatusOK, resp)
		return
	}

	// Temporary dev-only path: trust that the auth code came from Google via the frontend.
	// We derive a synthetic, stable-ish user ID from the code without remote verification.
	sum := sha256.Sum256([]byte(req.Code))
	userID := "google-code:" + hex.EncodeToString(sum[:8])

	accessToken, refreshToken, err := h.issueTokens(userID)
	if err != nil {
		h.writeError(w, http.StatusInternalServerError, err)
		return
	}

	resp := authResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: authUserResponse{
			ID:                  userID,
			OnboardingCompleted: false,
		},
	}

	h.writeJSON(w, http.StatusOK, resp)
}

func (h *Handler) writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		h.logger.Printf("writeJSON error: %v", err)
	}
}

func (h *Handler) writeError(w http.ResponseWriter, status int, err error) {
	if err != nil {
		h.logger.Printf("auth error: %v", err)
	}
	h.writeJSON(w, status, errorResponse{Error: err.Error()})
}

// --- Apple Sign In ---

// AppleSignIn handles POST /v1/auth/apple
//
// It expects a JSON body: { "idToken": "<apple_id_token>" }.
// The token is verified against Apple's OIDC provider and a JWT pair is returned.
func (h *Handler) AppleSignIn(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}

	if h.appleVerifier == nil {
		h.writeError(w, http.StatusInternalServerError, errors.New("apple auth not configured"))
		return
	}

	var req appleSignInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, err)
		return
	}
	if req.IDToken == "" {
		h.writeError(w, http.StatusBadRequest, errors.New("idToken is required"))
		return
	}

	ctx := r.Context()
	idToken, err := h.appleVerifier.Verify(ctx, req.IDToken)
	if err != nil {
		h.writeError(w, http.StatusUnauthorized, errors.New("invalid Apple ID token"))
		return
	}

	var claims struct {
		Sub   string `json:"sub"`
		Email string `json:"email"`
	}
	if err := idToken.Claims(&claims); err != nil {
		h.writeError(w, http.StatusUnauthorized, errors.New("failed to read token claims"))
		return
	}
	if claims.Sub == "" {
		h.writeError(w, http.StatusUnauthorized, errors.New("missing subject in token"))
		return
	}

	userID := "apple:" + claims.Sub

	accessToken, refreshToken, err := h.issueTokens(userID)
	if err != nil {
		h.writeError(w, http.StatusInternalServerError, err)
		return
	}

	resp := authResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: authUserResponse{
			ID:                  userID,
			OnboardingCompleted: false,
		},
	}

	h.writeJSON(w, http.StatusOK, resp)
}

// --- Phone OTP (dev in-memory implementation) ---

// RequestPhoneOTP handles POST /v1/auth/phone/request-otp.
// It generates a 6-digit code, stores a hash in memory, and (for now) logs it.
// In production you'd send this via SMS (e.g. Twilio) instead.
func (h *Handler) RequestPhoneOTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}

	var req phoneRequestOTP
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, err)
		return
	}

	phone := strings.TrimSpace(req.Phone)
	if phone == "" {
		h.writeError(w, http.StatusBadRequest, errors.New("phone is required"))
		return
	}

	// Generate 6-digit numeric code.
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		h.writeError(w, http.StatusInternalServerError, errors.New("failed to generate code"))
		return
	}
	code := fmt.Sprintf("%06d", n.Int64())

	// Hash the code before storing.
	sum := sha256.Sum256([]byte(code))
	hash := hex.EncodeToString(sum[:])

	h.mu.Lock()
	h.phoneOTPs[phone] = phoneOTPEntry{
		Hash:      hash,
		ExpiresAt: time.Now().Add(h.otpLifetime),
		Attempts:  0,
	}
	h.mu.Unlock()

	h.logger.Printf("Generated OTP %s for phone %s (DEV ONLY, send via SMS in production)", code, phone)

	// In development, also return the code so the client can show it.
	// DO NOT do this in production.
	h.writeJSON(w, http.StatusOK, map[string]any{
		"success":   true,
		"debugCode": code,
	})
}

// VerifyPhoneOTP handles POST /v1/auth/phone/verify-otp.
// It validates the OTP and, on success, issues a JWT pair for the phone identity.
func (h *Handler) VerifyPhoneOTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}

	var req phoneVerifyOTP
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, err)
		return
	}

	phone := strings.TrimSpace(req.Phone)
	code := strings.TrimSpace(req.Code)
	if phone == "" || code == "" {
		h.writeError(w, http.StatusBadRequest, errors.New("phone and code are required"))
		return
	}

	h.mu.Lock()
	entry, ok := h.phoneOTPs[phone]
	if !ok {
		h.mu.Unlock()
		h.writeError(w, http.StatusUnauthorized, errors.New("invalid or expired code"))
		return
	}

	// Check expiry
	if time.Now().After(entry.ExpiresAt) {
		delete(h.phoneOTPs, phone)
		h.mu.Unlock()
		h.writeError(w, http.StatusUnauthorized, errors.New("code expired"))
		return
	}

	// Limit attempts
	if entry.Attempts >= 5 {
		delete(h.phoneOTPs, phone)
		h.mu.Unlock()
		h.writeError(w, http.StatusTooManyRequests, errors.New("too many attempts"))
		return
	}

	// Verify code
	sum := sha256.Sum256([]byte(code))
	hash := hex.EncodeToString(sum[:])
	if hash != entry.Hash {
		entry.Attempts++
		h.phoneOTPs[phone] = entry
		h.mu.Unlock()
		h.writeError(w, http.StatusUnauthorized, errors.New("invalid code"))
		return
	}

	// Success: remove OTP and issue tokens
	delete(h.phoneOTPs, phone)
	h.mu.Unlock()

	userID := "phone:" + phone
	accessToken, refreshToken, err := h.issueTokens(userID)
	if err != nil {
		h.writeError(w, http.StatusInternalServerError, err)
		return
	}

	resp := authResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: authUserResponse{
			ID:                  userID,
			OnboardingCompleted: false,
		},
	}

	h.writeJSON(w, http.StatusOK, resp)
}

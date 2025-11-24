package auth

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
)

// Handler bundles all auth-related HTTP handlers and dependencies.
type Handler struct {
	logger         *log.Logger
	jwtSecret      []byte
	googleClientID string
	googleVerifier *oidc.IDTokenVerifier
}

// NewHandler constructs an auth handler. It initialises a Google ID token verifier if
// GOOGLE_CLIENT_ID is provided via environment or argument.
func NewHandler(logger *log.Logger, jwtSecret []byte, googleClientID string) (*Handler, error) {
	if logger == nil {
		logger = log.New(os.Stdout, "[auth] ", log.LstdFlags|log.Lshortfile)
	}

	h := &Handler{
		logger:    logger,
		jwtSecret: jwtSecret,
	}

	// Prefer explicit argument, fall back to env var.
	if googleClientID == "" {
		googleClientID = os.Getenv("GOOGLE_CLIENT_ID")
	}
	h.googleClientID = googleClientID

	if googleClientID != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		provider, err := oidc.NewProvider(ctx, "https://accounts.google.com")
		if err != nil {
			return nil, err
		}
		h.googleVerifier = provider.Verifier(&oidc.Config{
			ClientID: googleClientID,
		})
	}

	return h, nil
}

type googleSignInRequest struct {
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

// GoogleSignIn handles POST /v1/auth/google
//
// It expects a JSON body: { "idToken": "<google_id_token>" }.
// The token is verified against Google's OIDC provider, and if valid,
// a user is (eventually) looked up or created and a JWT pair is returned.
func (h *Handler) GoogleSignIn(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}

	if h.googleVerifier == nil {
		h.writeError(w, http.StatusInternalServerError, errors.New("google auth not configured"))
		return
	}

	var req googleSignInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, http.StatusBadRequest, err)
		return
	}
	if req.IDToken == "" {
		h.writeError(w, http.StatusBadRequest, errors.New("idToken is required"))
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



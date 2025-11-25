package onboarding

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/rijey/kindl/backend/internal/auth"
)

// Store defines the minimal persistence API the onboarding handlers need.
// For now we provide an in-memory implementation; later this will be backed by Postgres.
type Store interface {
	UpsertIntent(userID, intent string) error
	UpsertPreference(userID string, genders []string) error
	UpsertWhoAreYou(userID string, in WhoAreYouInput) error
	UpsertConnectionStyle(userID string, style string) error
	UpsertLifestyle(userID string, in LifestyleInput) error
	ReplaceInterests(userID string, interests []string) error
	UpdateLocation(userID string, in LocationInput) error
	MarkOnboardingComplete(userID string) error
}

// Handler exposes HTTP handlers for the onboarding flow.
type Handler struct {
	logger *log.Logger
	store  Store
}

func NewHandler(logger *log.Logger, store Store) *Handler {
	if logger == nil {
		logger = log.Default()
	}
	return &Handler{
		logger: logger,
		store:  store,
	}
}

// --- Request payloads ---

type intentRequest struct {
	Intent string `json:"intent"`
}

type preferenceRequest struct {
	PreferredGenders []string `json:"preferredGenders"`
}

type WhoAreYouInput struct {
	DisplayName string `json:"displayName"`
	Gender      string `json:"gender"`
	Pronouns    string `json:"pronouns"`
	Birthdate   string `json:"birthdate"` // ISO date (YYYY-MM-DD); parsing/validation later
}

type LifestyleInput struct {
	HeightCm          int    `json:"heightCm"`
	Drinks            string `json:"drinks"`
	Smokes            string `json:"smokes"`
	ExerciseLevel     string `json:"exerciseLevel"`
	RelationshipStyle string `json:"relationshipStyle"`
}

type lifestyleRequest = LifestyleInput

type connectionStyleRequest struct {
	ConnectionStyle string `json:"connectionStyle"`
}

type interestsRequest struct {
	Interests []string `json:"interests"`
}

type LocationInput struct {
	Lat      float64 `json:"lat"`
	Lng      float64 `json:"lng"`
	Accuracy float64 `json:"accuracy"`
}

type locationRequest = LocationInput

// --- Helpers ---

func getUserID(r *http.Request) (string, error) {
	// Prefer authenticated user ID from JWT middleware if available.
	if uid, ok := auth.UserIDFromContext(r.Context()); ok && uid != "" {
		return uid, nil
	}

	// Fallback for development: explicit debug header.
	uid := r.Header.Get("X-Debug-UserID")
	if uid == "" {
		return "", errors.New("missing user context")
	}
	return uid, nil
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, err error) {
	writeJSON(w, status, map[string]string{"error": err.Error()})
}

// --- Handlers ---

// UpdateIntent handles PUT /v1/onboarding/intent
func (h *Handler) UpdateIntent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req intentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}
	if req.Intent == "" {
		writeError(w, http.StatusBadRequest, errors.New("intent is required"))
		return
	}

	if err := h.store.UpsertIntent(userID, req.Intent); err != nil {
		h.logger.Printf("UpdateIntent error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save intent"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// UpdatePreference handles PUT /v1/onboarding/preference
func (h *Handler) UpdatePreference(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req preferenceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}
	if len(req.PreferredGenders) == 0 {
		writeError(w, http.StatusBadRequest, errors.New("preferredGenders is required"))
		return
	}

	if err := h.store.UpsertPreference(userID, req.PreferredGenders); err != nil {
		h.logger.Printf("UpdatePreference error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save preference"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// UpdateWhoAreYou handles PUT /v1/onboarding/who-are-you
func (h *Handler) UpdateWhoAreYou(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req WhoAreYouInput
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}
	if req.DisplayName == "" {
		writeError(w, http.StatusBadRequest, errors.New("displayName is required"))
		return
	}

	if err := h.store.UpsertWhoAreYou(userID, req); err != nil {
		h.logger.Printf("UpdateWhoAreYou error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save profile"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// UpdateConnectionStyle handles PUT /v1/onboarding/connection-style
func (h *Handler) UpdateConnectionStyle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req connectionStyleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}
	if req.ConnectionStyle == "" {
		writeError(w, http.StatusBadRequest, errors.New("connectionStyle is required"))
		return
	}

	if err := h.store.UpsertConnectionStyle(userID, req.ConnectionStyle); err != nil {
		h.logger.Printf("UpdateConnectionStyle error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save connection style"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// UpdateLifestyle handles PUT /v1/onboarding/lifestyle
func (h *Handler) UpdateLifestyle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req lifestyleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	if err := h.store.UpsertLifestyle(userID, req); err != nil {
		h.logger.Printf("UpdateLifestyle error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save lifestyle"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// UpdateInterests handles PUT /v1/onboarding/interests
func (h *Handler) UpdateInterests(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req interestsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}
	if len(req.Interests) == 0 {
		writeError(w, http.StatusBadRequest, errors.New("interests is required"))
		return
	}

	if err := h.store.ReplaceInterests(userID, req.Interests); err != nil {
		h.logger.Printf("UpdateInterests error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save interests"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// UpdateLocation handles PUT /v1/onboarding/location
func (h *Handler) UpdateLocation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	var req locationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	if err := h.store.UpdateLocation(userID, req); err != nil {
		h.logger.Printf("UpdateLocation error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to save location"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}

// Complete handles POST /v1/onboarding/complete
func (h *Handler) Complete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, errors.New("method not allowed"))
		return
	}
	userID, err := getUserID(r)
	if err != nil {
		writeError(w, http.StatusUnauthorized, err)
		return
	}

	if err := h.store.MarkOnboardingComplete(userID); err != nil {
		h.logger.Printf("Complete onboarding error: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("failed to complete onboarding"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true})
}



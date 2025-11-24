package main

import (
	"log"
	"net/http"
	"os"

	"github.com/rijey/kindl/backend/internal/auth"
)

func main() {
	logger := log.New(os.Stdout, "[api] ", log.LstdFlags|log.Lshortfile)

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		// Development default; override in production via environment.
		jwtSecret = "dev-secret-change-me"
	}

	authHandler, err := auth.NewHandler(logger, []byte(jwtSecret), os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		logger.Fatalf("failed to initialise auth handler: %v", err)
	}

	mux := http.NewServeMux()

	// Simple health check endpoint so you can verify the backend is running.
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	// Auth routes (v1)
	mux.HandleFunc("/v1/auth/google", authHandler.GoogleSignIn)

	addr := ":8080"
	logger.Printf("backend listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		logger.Fatalf("server error: %v", err)
	}
}



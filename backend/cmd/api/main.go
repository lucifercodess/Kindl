package main

import (
	"database/sql"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/rijey/kindl/backend/internal/auth"
	"github.com/rijey/kindl/backend/internal/onboarding"
)

func main() {
	// Ensure logs directory exists and create a fresh log file for this run.
	if err := os.MkdirAll("logs", 0o755); err != nil {
		log.Fatalf("failed to create logs directory: %v", err)
	}
	ts := time.Now().Format("20060102-150405")
	logPath := filepath.Join("logs", "api-"+ts+".log")

	logFile, err := os.Create(logPath) // truncate/create new file each restart
	if err != nil {
		log.Fatalf("failed to create log file: %v", err)
	}
	defer logFile.Close()

	multiWriter := io.MultiWriter(os.Stdout, logFile)
	logger := log.New(multiWriter, "[api] ", log.LstdFlags|log.Lshortfile)

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		// Development default; override in production via environment.
		jwtSecret = "dev-secret-change-me"
	}
	jwtKey := []byte(jwtSecret)

	authHandler, err := auth.NewHandler(logger, jwtKey, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		logger.Fatalf("failed to initialise auth handler: %v", err)
	}

	// Choose onboarding store implementation.
	// If DATABASE_URL is set and Postgres is reachable, use the Postgres-backed store.
	// Otherwise, fall back to in-memory storage.
	var onboardingStore onboarding.Store

	if dsn := os.Getenv("DATABASE_URL"); dsn != "" {
		db, err := sql.Open("pgx", dsn)
		if err != nil {
			logger.Printf("failed to connect to Postgres (using in-memory onboarding store): %v", err)
			onboardingStore = onboarding.NewInMemoryStore()
		} else {
			if err := db.Ping(); err != nil {
				logger.Printf("Postgres ping failed (using in-memory onboarding store): %v", err)
				onboardingStore = onboarding.NewInMemoryStore()
				_ = db.Close()
			} else {
				logger.Printf("using Postgres-backed onboarding store")
				onboardingStore = onboarding.NewPGStore(db)
			}
		}
	} else {
		logger.Printf("DATABASE_URL not set, using in-memory onboarding store")
		onboardingStore = onboarding.NewInMemoryStore()
	}

	onboardingHandler := onboarding.NewHandler(logger, onboardingStore)

	mux := http.NewServeMux()

	// Simple health check endpoint so you can verify the backend is running.
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	// Auth routes (v1)
	mux.HandleFunc("/v1/auth/google", authHandler.GoogleSignIn)
	mux.HandleFunc("/v1/auth/apple", authHandler.AppleSignIn)
	mux.HandleFunc("/v1/auth/phone/request-otp", authHandler.RequestPhoneOTP)
	mux.HandleFunc("/v1/auth/phone/verify-otp", authHandler.VerifyPhoneOTP)

	// Onboarding routes (v1) – one endpoint per screen.
	mux.HandleFunc("/v1/onboarding/intent", onboardingHandler.UpdateIntent)
	mux.HandleFunc("/v1/onboarding/preference", onboardingHandler.UpdatePreference)
	mux.HandleFunc("/v1/onboarding/who-are-you", onboardingHandler.UpdateWhoAreYou)
	mux.HandleFunc("/v1/onboarding/connection-style", onboardingHandler.UpdateConnectionStyle)
	mux.HandleFunc("/v1/onboarding/lifestyle", onboardingHandler.UpdateLifestyle)
	mux.HandleFunc("/v1/onboarding/interests", onboardingHandler.UpdateInterests)
	mux.HandleFunc("/v1/onboarding/location", onboardingHandler.UpdateLocation)
	mux.HandleFunc("/v1/onboarding/complete", onboardingHandler.Complete)

	addr := ":8080"
	logger.Printf("backend listening on %s, log file %s", addr, logPath)
	rootHandler := loggingMiddleware(logger, auth.JWTUserContextMiddleware(logger, jwtKey, mux))
	if err := http.ListenAndServe(addr, rootHandler); err != nil {
		logger.Fatalf("server error: %v", err)
	}
}

// loggingResponseWriter wraps http.ResponseWriter so we can capture status and bytes.
type loggingResponseWriter struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
	bytes       int64
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	if !lrw.wroteHeader {
		lrw.status = code
		lrw.wroteHeader = true
		lrw.ResponseWriter.WriteHeader(code)
	}
}

func (lrw *loggingResponseWriter) Write(b []byte) (int, error) {
	if !lrw.wroteHeader {
		// Default to 200 OK if WriteHeader was not called explicitly.
		lrw.WriteHeader(http.StatusOK)
	}
	n, err := lrw.ResponseWriter.Write(b)
	lrw.bytes += int64(n)
	return n, err
}

// loggingMiddleware logs basic information about each HTTP request.
func loggingMiddleware(logger *log.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		lrw := &loggingResponseWriter{
			ResponseWriter: w,
			status:         http.StatusOK,
		}

		next.ServeHTTP(lrw, r)

		duration := time.Since(start)
		logger.Printf(
			"request method=%s path=%s status=%d duration_ms=%d remote=%s ua=%q bytes=%d",
			r.Method,
			r.URL.Path,
			lrw.status,
			duration.Milliseconds(),
			r.RemoteAddr,
			r.UserAgent(),
			lrw.bytes,
		)
	})
}

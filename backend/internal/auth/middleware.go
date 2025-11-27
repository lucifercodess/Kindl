package auth

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDContextKey contextKey = "userID"

// ContextWithUserID stores the authenticated user ID in the context.
func ContextWithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDContextKey, userID)
}

// UserIDFromContext retrieves the authenticated user ID from the context.
func UserIDFromContext(ctx context.Context) (string, bool) {
	v := ctx.Value(userIDContextKey)
	if v == nil {
		return "", false
	}
	id, ok := v.(string)
	return id, ok && id != ""
}

// JWTUserContextMiddleware parses an Authorization: Bearer <accessToken> header,
// verifies the JWT, and, on success, attaches the user ID (subject) to the
// request context. It only attempts this for onboarding routes; other routes
// pass through untouched.
//
// If a bearer token is present but invalid, it returns 401. If no bearer token
// is present, the request is allowed to continue so that legacy/X-Debug flows
// still work during development.
func JWTUserContextMiddleware(logger *log.Logger, jwtSecret []byte, next http.Handler) http.Handler {
	if logger == nil {
		logger = log.Default()
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only care about onboarding paths for now.
		if !strings.HasPrefix(r.URL.Path, "/v1/onboarding/") {
			next.ServeHTTP(w, r)
			return
		}

		authz := r.Header.Get("Authorization")
		if authz == "" {
			// Fall back to X-Debug-UserID mechanism in onboarding handlers.
			next.ServeHTTP(w, r)
			return
		}

		parts := strings.SplitN(authz, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]

		var claims Claims
		token, err := jwt.ParseWithClaims(tokenStr, &claims, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			logger.Printf("JWT parse error: %v", err)
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		if claims.TokenType != "access" {
			http.Error(w, "invalid token type", http.StatusUnauthorized)
			return
		}

		if claims.Subject == "" {
			http.Error(w, "missing subject in token", http.StatusUnauthorized)
			return
		}

		ctx := ContextWithUserID(r.Context(), claims.Subject)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}



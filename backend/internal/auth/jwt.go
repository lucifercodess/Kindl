package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// token lifetimes
const (
	accessTokenTTL  = 15 * time.Minute
	refreshTokenTTL = 30 * 24 * time.Hour
)

// Claims represents JWT claims used for both access and refresh tokens.
type Claims struct {
	TokenType string `json:"typ"` // "access" or "refresh"
	jwt.RegisteredClaims
}

// issueTokens creates a new pair of access and refresh JWTs for a given user ID.
func (h *Handler) issueTokens(userID string) (accessToken string, refreshToken string, err error) {
	now := time.Now().UTC()

	accessClaims := Claims{
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ExpiresAt: jwt.NewNumericDate(now.Add(accessTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	refreshClaims := Claims{
		TokenType: "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ExpiresAt: jwt.NewNumericDate(now.Add(refreshTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	accessJWT := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	refreshJWT := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	accessToken, err = accessJWT.SignedString(h.jwtSecret)
	if err != nil {
		return "", "", err
	}

	refreshToken, err = refreshJWT.SignedString(h.jwtSecret)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

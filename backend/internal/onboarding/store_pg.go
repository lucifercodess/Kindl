package onboarding

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

// pgStore is a Postgres-backed implementation of the onboarding Store.
// It persists onboarding data into relational tables instead of memory.
//
// NOTE: This assumes you have created the following tables:
//
//	CREATE TABLE users (
//	  id TEXT PRIMARY KEY,
//	  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//	  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
//	);
//
//	CREATE TABLE profiles (
//	  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
//	  intent TEXT,
//	  preferred_genders TEXT,
//	  display_name TEXT,
//	  gender TEXT,
//	  pronouns TEXT,
//	  birthdate DATE,
//	  connection_style TEXT,
//	  height_cm INTEGER,
//	  drinks TEXT,
//	  smokes TEXT,
//	  exercise_level TEXT,
//	  relationship_style TEXT,
//	  location_lat DOUBLE PRECISION,
//	  location_lng DOUBLE PRECISION,
//	  location_accuracy DOUBLE PRECISION,
//	  onboarded_at TIMESTAMPTZ,
//	  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
//	);
//
//	CREATE TABLE user_interests (
//	  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
//	  interest_key TEXT NOT NULL,
//	  PRIMARY KEY (user_id, interest_key)
//	);
type pgStore struct {
	db *sql.DB
}

// NewPGStore constructs a Store backed by Postgres.
func NewPGStore(db *sql.DB) Store {
	return &pgStore{db: db}
}

// ensureUser creates a users row if it doesn't exist yet.
func (s *pgStore) ensureUser(ctx context.Context, userID string) error {
	if userID == "" {
		return errors.New("userID is required")
	}
	_, err := s.db.ExecContext(ctx, `
		INSERT INTO users (id)
		VALUES ($1)
		ON CONFLICT (id) DO UPDATE SET updated_at = now()
	`, userID)
	return err
}

func (s *pgStore) UpsertIntent(userID, intent string) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, intent)
		VALUES ($1, $2)
		ON CONFLICT (user_id)
		DO UPDATE SET intent = EXCLUDED.intent, updated_at = now()
	`, userID, intent)
	return err
}

func (s *pgStore) UpsertPreference(userID string, genders []string) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	// For now we store preferred genders as a comma-separated string.
	var joined string
	for i, g := range genders {
		if i > 0 {
			joined += ","
		}
		joined += g
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, preferred_genders)
		VALUES ($1, $2)
		ON CONFLICT (user_id)
		DO UPDATE SET preferred_genders = EXCLUDED.preferred_genders, updated_at = now()
	`, userID, joined)
	return err
}

func (s *pgStore) UpsertWhoAreYou(userID string, in WhoAreYouInput) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	var birthdate *time.Time
	if in.Birthdate != "" {
		// Parse as ISO date (YYYY-MM-DD). If parsing fails, we ignore the value.
		if t, err := time.Parse("2006-01-02", in.Birthdate); err == nil {
			birthdate = &t
		}
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, display_name, gender, pronouns, birthdate)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (user_id)
		DO UPDATE SET
			display_name = EXCLUDED.display_name,
			gender       = EXCLUDED.gender,
			pronouns     = EXCLUDED.pronouns,
			birthdate    = EXCLUDED.birthdate,
			updated_at   = now()
	`, userID, in.DisplayName, in.Gender, in.Pronouns, birthdate)
	return err
}

func (s *pgStore) UpsertConnectionStyle(userID string, style string) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, connection_style)
		VALUES ($1, $2)
		ON CONFLICT (user_id)
		DO UPDATE SET connection_style = EXCLUDED.connection_style, updated_at = now()
	`, userID, style)
	return err
}

func (s *pgStore) UpsertLifestyle(userID string, in LifestyleInput) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, height_cm, drinks, smokes, exercise_level, relationship_style)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (user_id)
		DO UPDATE SET
			height_cm          = EXCLUDED.height_cm,
			drinks             = EXCLUDED.drinks,
			smokes             = EXCLUDED.smokes,
			exercise_level     = EXCLUDED.exercise_level,
			relationship_style = EXCLUDED.relationship_style,
			updated_at         = now()
	`, userID, in.HeightCm, in.Drinks, in.Smokes, in.ExerciseLevel, in.RelationshipStyle)
	return err
}

func (s *pgStore) ReplaceInterests(userID string, interests []string) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `DELETE FROM user_interests WHERE user_id = $1`, userID); err != nil {
		return err
	}

	for _, key := range interests {
		if key == "" {
			continue
		}
		if _, err := tx.ExecContext(ctx, `
			INSERT INTO user_interests (user_id, interest_key)
			VALUES ($1, $2)
			ON CONFLICT (user_id, interest_key) DO NOTHING
		`, userID, key); err != nil {
			return err
		}
	}

	if _, err := tx.ExecContext(ctx, `
		UPDATE profiles SET updated_at = now() WHERE user_id = $1
	`, userID); err != nil {
		return err
	}

	return tx.Commit()
}

func (s *pgStore) UpdateLocation(userID string, in LocationInput) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, location_lat, location_lng, location_accuracy)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id)
		DO UPDATE SET
			location_lat      = EXCLUDED.location_lat,
			location_lng      = EXCLUDED.location_lng,
			location_accuracy = EXCLUDED.location_accuracy,
			updated_at        = now()
	`, userID, in.Lat, in.Lng, in.Accuracy)
	return err
}

func (s *pgStore) MarkOnboardingComplete(userID string) error {
	ctx := context.Background()
	if err := s.ensureUser(ctx, userID); err != nil {
		return err
	}

	_, err := s.db.ExecContext(ctx, `
		INSERT INTO profiles (user_id, onboarded_at)
		VALUES ($1, now())
		ON CONFLICT (user_id)
		DO UPDATE SET onboarded_at = now(), updated_at = now()
	`, userID)
	return err
}

package onboarding

import (
	"sync"
	"time"
)

// ProfileSnapshot is a minimal in-memory representation of a user's onboarding
// data. This is only used for early development; production will persist to Postgres.
type ProfileSnapshot struct {
	UserID            string
	Intent            string
	PreferredGenders  []string
	DisplayName       string
	Gender            string
	Pronouns          string
	Birthdate         string
	ConnectionStyle   string
	HeightCm          int
	Drinks            string
	Smokes            string
	ExerciseLevel     string
	RelationshipStyle string
	Interests         []string
	Lat               float64
	Lng               float64
	Accuracy          float64
	OnboardedAt       *time.Time
	UpdatedAt         time.Time
}

type memoryStore struct {
	mu       sync.Mutex
	profiles map[string]*ProfileSnapshot
}

// NewInMemoryStore returns an in-memory onboarding store.
// This is great for getting the API and frontend integration working quickly.
// Later we'll introduce a Postgres-backed implementation that satisfies Store.
func NewInMemoryStore() Store {
	return &memoryStore{
		profiles: make(map[string]*ProfileSnapshot),
	}
}

func (s *memoryStore) getOrCreate(userID string) *ProfileSnapshot {
	if p, ok := s.profiles[userID]; ok {
		return p
	}
	now := time.Now()
	p := &ProfileSnapshot{
		UserID:    userID,
		UpdatedAt: now,
	}
	s.profiles[userID] = p
	return p
}

func (s *memoryStore) UpsertIntent(userID, intent string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.Intent = intent
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) UpsertPreference(userID string, genders []string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.PreferredGenders = append([]string(nil), genders...)
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) UpsertWhoAreYou(userID string, in WhoAreYouInput) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.DisplayName = in.DisplayName
	p.Gender = in.Gender
	p.Pronouns = in.Pronouns
	p.Birthdate = in.Birthdate
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) UpsertConnectionStyle(userID string, style string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.ConnectionStyle = style
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) UpsertLifestyle(userID string, in LifestyleInput) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.HeightCm = in.HeightCm
	p.Drinks = in.Drinks
	p.Smokes = in.Smokes
	p.ExerciseLevel = in.ExerciseLevel
	p.RelationshipStyle = in.RelationshipStyle
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) ReplaceInterests(userID string, interests []string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.Interests = append([]string(nil), interests...)
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) UpdateLocation(userID string, in LocationInput) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	p.Lat = in.Lat
	p.Lng = in.Lng
	p.Accuracy = in.Accuracy
	p.UpdatedAt = time.Now()
	return nil
}

func (s *memoryStore) MarkOnboardingComplete(userID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	p := s.getOrCreate(userID)
	now := time.Now()
	p.OnboardedAt = &now
	p.UpdatedAt = now
	return nil
}



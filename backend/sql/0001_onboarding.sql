-- Minimal onboarding schema for Kindl.
-- This uses TEXT user IDs so it works both with debug users and
-- your eventual auth user IDs (e.g. "google-code:...").

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Intent & preferences
    intent TEXT,
    preferred_genders TEXT,

    -- Who are you
    display_name TEXT,
    gender TEXT,
    pronouns TEXT,
    birthdate DATE,

    -- Connection style & lifestyle basics
    connection_style TEXT,
    height_cm INTEGER,
    drinks TEXT,
    smokes TEXT,
    exercise_level TEXT,
    relationship_style TEXT,

    -- Location
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    location_accuracy DOUBLE PRECISION,

    -- Onboarding completion
    onboarded_at TIMESTAMPTZ,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_interests (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    interest_key TEXT NOT NULL,
    PRIMARY KEY (user_id, interest_key)
);



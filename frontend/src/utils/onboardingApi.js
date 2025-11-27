import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080';
    }
    return 'http://localhost:8080';
  }
  return 'https://api.kindl.yourdomain.com';
};

const BASE_URL = getBaseUrl();

async function put(path, body, accessToken) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : { 'X-Debug-UserID': 'debug-user-1' }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json();
}

async function post(path, body, accessToken) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : { 'X-Debug-UserID': 'debug-user-1' }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json();
}

export const onboardingApi = {
  updateIntent: (intent, accessToken) =>
    put('/v1/onboarding/intent', { intent }, accessToken),
  updatePreference: (preferredGenders, accessToken) =>
    put('/v1/onboarding/preference', { preferredGenders }, accessToken),
  updateWhoAreYou: ({ name, gender, pronouns, birthdate }, accessToken) =>
    put('/v1/onboarding/who-are-you', {
      displayName: name,
      gender,
      pronouns: pronouns || '',
      birthdate: birthdate ? birthdate.toISOString().slice(0, 10) : '',
    }, accessToken),
  updateConnectionStyle: (connectionStyle, accessToken) =>
    put('/v1/onboarding/connection-style', { connectionStyle }, accessToken),
  updateLifestyle: ({ heightCm, drinks, smokes, exercise, relationshipStyle }, accessToken) =>
    put('/v1/onboarding/lifestyle', {
      heightCm: heightCm ?? 0,
      drinks: drinks || '',
      smokes: smokes || '',
      exerciseLevel: exercise || '',
      relationshipStyle: relationshipStyle || '',
    }, accessToken),
  updateInterests: (interests, accessToken) =>
    put('/v1/onboarding/interests', { interests }, accessToken),
  updateLocation: ({ lat, lng, accuracy }, accessToken) =>
    put('/v1/onboarding/location', { lat, lng, accuracy }, accessToken),
  complete: (accessToken) => post('/v1/onboarding/complete', {}, accessToken),
};



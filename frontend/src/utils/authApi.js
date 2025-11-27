import { Platform } from 'react-native';

// Simple base URL helper for dev. Adjust for your local setup.
// - iOS simulator: localhost
// - Android emulator: 10.0.2.2
// - Device: replace with your machine's LAN IP (e.g. 192.168.x.x)
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080';
    }
    return 'http://localhost:8080';
  }
  // TODO: replace with your production API URL
  return 'https://api.kindl.yourdomain.com';
};

const BASE_URL = getBaseUrl();

export async function signInWithGoogleCode(code, redirectUri) {
  const res = await fetch(`${BASE_URL}/v1/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, redirectUri }),
  });

  if (!res.ok) {
    let message = 'Failed to sign in with Google';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export async function signInWithAppleIdToken(idToken) {
  const res = await fetch(`${BASE_URL}/v1/auth/apple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    let message = 'Failed to sign in with Apple';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export async function requestPhoneOtp(phone) {
  const res = await fetch(`${BASE_URL}/v1/auth/phone/request-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) {
    let message = 'Failed to request verification code';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export async function verifyPhoneOtp(phone, code) {
  const res = await fetch(`${BASE_URL}/v1/auth/phone/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, code }),
  });

  if (!res.ok) {
    let message = 'Failed to verify code';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}



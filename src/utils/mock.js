// Mock services for development
// These will be replaced with actual API calls later

export const mockAuth = {
  login: async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'mock_token_123',
          user: {
            id: '1',
            email: email,
            name: 'Mock User',
          },
        });
      }, 1000);
    });
  },

  signup: async (email, password, name) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'mock_token_123',
          user: {
            id: '1',
            email: email,
            name: name,
          },
        });
      }, 1000);
    });
  },
};

export const mockProfile = {
  getProfile: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: 'Mock User',
          age: 28,
          bio: 'This is a mock profile',
          photos: [],
        });
      }, 500);
    });
  },
};

export const mockMatches = {
  getMatches: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  },
};


# Kindl

A React Native dating app built with Expo (frontend) and a Go backend API.

## 🚀 Apps

### Frontend (`frontend/`)

#### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- iOS Simulator (for Mac) or Android Emulator / physical device

#### Install & run

```bash
cd frontend
npm install
npm start
```

From Expo DevTools you can:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go on your device

Common scripts (run inside `frontend/`):

- **iOS Simulator**: `npm run ios`
- **Android Emulator**: `npm run android`
- **Web**: `npm run web` (limited React Native support)

#### Frontend structure

```
frontend/
├── App.js
├── app.json
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── theme/           # Theme and styling
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and mock services
│   └── assets/          # Images, fonts, etc.
└── package.json
```

### Backend (`backend/`)

The backend is a Go HTTP API (to be expanded with auth, profiles, feed, chat, and blind dating).

#### Prerequisites

- Go 1.21 or higher

#### Run the API

```bash
cd backend
go run ./cmd/api
```

This starts the server on `http://localhost:8080` with a basic health endpoint:

- `GET /health` → `{"status":"ok"}`

## 🎨 Global Theme

The app uses a black and white theme system located in `/frontend/src/theme/theme.js`.

### Usage

```javascript
import { useTheme } from '../theme/theme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.primaryBlack }}>
      <Text style={{ fontSize: theme.typography.title.fontSize }}>
        Hello
      </Text>
    </View>
  );
};
```

### Theme Properties

- **Colors**: `primaryBlack`, `primaryWhite`, `textPrimary`, `textSecondary`, `border`, `card`
- **Spacing**: Array `[4, 8, 12, 16, 20, 24, 32]`
- **Radius**: Object with `sm`, `md`, `lg`, `xl`
- **Typography**: `title`, `subtitle`, `button` styles

All components are wrapped in a `ThemeProvider` in `frontend/App.js`.

## 📱 Adding New Screens

1. Create a new screen component in `frontend/src/screens/YourScreen.js`
2. Add it to the stack navigator in `frontend/src/navigation/AppNavigator.js`:

```javascript
import YourScreen from '../screens/YourScreen';

// Inside Stack.Navigator
<Stack.Screen name="YourScreen" component={YourScreen} />
```

3. Navigate to it using React Navigation:

```javascript
navigation.navigate('YourScreen');
```

## 🔌 API Integration

Currently, the app uses mock services located in `frontend/src/utils/mock.js`. These will be replaced with actual API calls later.

To integrate real APIs:

1. Create API service files in `frontend/src/utils/` or `frontend/src/services/`
2. Replace mock functions with actual fetch/axios calls
3. Update environment variables in `.env` (copy from `.env.example`)

## 🛠 Development

- **Linting**: ESLint is configured with Expo defaults
- **Formatting**: Prettier is configured for consistent code style
- **Git**: Initialize with `git init` and make your first commit

## 📝 Next Steps

- [ ] Add authentication flow
- [ ] Create profile screens
- [ ] Implement matching algorithm UI
- [ ] Add chat functionality
- [ ] Integrate real API endpoints
- [ ] Add image upload functionality
- [ ] Implement push notifications

## 📄 License

Private project


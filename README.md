# Dating App Client

A React Native dating app built with Expo and JavaScript.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- iOS Simulator (for Mac) or Android Emulator / Physical device

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

This will open the Expo DevTools in your browser. From there you can:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Running on Different Platforms

- **iOS Simulator**: `npm run ios` or press `i` in Expo DevTools
- **Android Emulator**: `npm run android` or press `a` in Expo DevTools
- **Expo Go**: Scan the QR code with the Expo Go app on your phone
- **Web**: `npm run web` (limited React Native support)

## 📁 Project Structure

```
dating-app-client/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── theme/           # Theme and styling
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and mock services
│   └── assets/          # Images, fonts, etc.
├── App.js               # Main app entry point
└── package.json
```

## 🎨 Global Theme

The app uses a black and white theme system located in `/src/theme/theme.js`.

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

All components are wrapped in a `ThemeProvider` in `App.js`.

## 📱 Adding New Screens

1. Create a new screen component in `/src/screens/YourScreen.js`
2. Add it to the stack navigator in `/src/navigation/AppNavigator.js`:

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

Currently, the app uses mock services located in `/src/utils/mock.js`. These will be replaced with actual API calls later.

To integrate real APIs:

1. Create API service files in `/src/utils/` or `/src/services/`
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


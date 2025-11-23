# Android Studio Setup Guide

## Installation Steps

### 1. Download Android Studio
- Visit: https://developer.android.com/studio
- Download for Mac (Intel or Apple Silicon)

### 2. Install Android Studio
1. Open the downloaded `.dmg` file
2. Drag Android Studio to Applications folder
3. Open Android Studio from Applications
4. Complete the setup wizard:
   - Choose **Standard** installation
   - Accept all licenses
   - Let it download Android SDK (this takes a while)

### 3. Configure Android SDK
1. Open Android Studio
2. Go to: **Tools → SDK Manager**
3. In **SDK Platforms** tab:
   - Check ✅ **Android 13.0 (Tiramisu)** or **Android 14.0**
   - Check ✅ **Show Package Details** and ensure SDK Platform is selected
4. In **SDK Tools** tab, ensure these are checked:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM installer) - if on Intel Mac
5. Click **Apply** and wait for installation

### 4. Create Android Virtual Device (AVD)
1. In Android Studio, go to: **Tools → Device Manager**
2. Click **Create Device**
3. Choose a phone (e.g., **Pixel 6** or **Pixel 7**)
4. Click **Next**
5. Select a system image (e.g., **Android 13.0** or **Android 14.0**)
   - If not downloaded, click **Download** next to it
6. Click **Next**
7. Review settings and click **Finish**

### 5. Set Environment Variables

After installation, add these to your `~/.zshrc` file:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

**To add these:**
1. Open Terminal
2. Run: `nano ~/.zshrc` (or `code ~/.zshrc` if you have VS Code)
3. Paste the lines above at the end of the file
4. Save and exit (Ctrl+X, then Y, then Enter in nano)
5. Run: `source ~/.zshrc` to reload

### 6. Verify Installation

Run these commands to verify:

```bash
# Check Android SDK path
echo $ANDROID_HOME

# Check adb (Android Debug Bridge)
adb version

# List available emulators
emulator -list-avds
```

### 7. Start Android Emulator

**Option A: From Android Studio**
- Open Android Studio
- Go to **Tools → Device Manager**
- Click the ▶️ play button next to your AVD

**Option B: From Terminal**
```bash
# List available emulators
emulator -list-avds

# Start an emulator (replace with your AVD name)
emulator -avd Pixel_6_API_33
```

### 8. Run Expo App on Android

Once the emulator is running:

1. Make sure Expo server is running: `npm start`
2. Press `a` in the Expo terminal to open on Android
3. Or scan QR code with Expo Go on Android device

## Troubleshooting

### "adb: command not found"
- Make sure you've added Android SDK to PATH in `~/.zshrc`
- Run `source ~/.zshrc` to reload
- Restart your terminal

### "ANDROID_HOME is not set"
- Add the export statements to `~/.zshrc`
- Make sure the path is correct: `$HOME/Library/Android/sdk`

### Emulator won't start
- Make sure you've created an AVD in Device Manager
- Try starting it from Android Studio first
- Check if virtualization is enabled in your Mac's System Settings

### Expo can't find Android
- Make sure emulator is running before pressing `a`
- Check: `adb devices` should show your emulator
- Restart Expo server: `npm start`

## Quick Commands Reference

```bash
# Check if Android SDK is set up
echo $ANDROID_HOME

# Check adb
adb devices

# List emulators
emulator -list-avds

# Start emulator
emulator -avd <AVD_NAME>

# Start Expo
npm start
# Then press 'a' for Android
```


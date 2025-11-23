#!/bin/bash

# Fix Xcode Command Line Tools
# Run this script: bash fix-xcode.sh

echo "Switching to full Xcode installation..."
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

echo ""
echo "Verifying installation..."
xcode-select -p

echo ""
echo "Accepting Xcode license..."
sudo xcodebuild -license accept

echo ""
echo "Checking simctl..."
xcrun simctl list devices available | head -5

echo ""
echo "✅ Done! You can now run: npm start"


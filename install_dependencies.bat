@echo off
echo Installing new dependencies...
npm install @react-native-async-storage/async-storage@^1.19.0
echo.
echo Dependencies installed successfully!
echo.
echo For Android, you may need to run:
echo cd android && ./gradlew clean && cd ..
echo npx react-native run-android
echo.
echo For iOS, you may need to run:
echo cd ios && pod install && cd ..
echo npx react-native run-ios
pause
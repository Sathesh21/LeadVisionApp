LeadVisionApp

A React Native application with theming, navigation, and basic screens for login, dashboard, search, and settings.

🚀 Features

Authentication: Login screen with simple validation.

Dashboard: Displays overview with theme support.

Search: Search planets using SWAPI API with pagination and population-based sizing.

Settings:

Toggle between Light and Dark theme.

Choose Base Color (Blue, Green, Purple, Orange).

Header Component:

Common reusable header across screens.

Back button support (only when navigation can go back).

Theme Context: Centralized theme management using Context API.

🛠️ Tech Stack
React Native CLI

React Navigation

Context API (for theme management)

SWAPI API (for Star Wars planet search)

⚡ Installation & Setup

Clone the repository:

git clone https://github.com/Sathesh21/LeadVisionApp.git
cd LeadVisionApp


Install dependencies:

npm install


Start Metro bundler:

npx react-native start


Run on Android:

npx react-native run-android


Run on iOS (Mac):

npx react-native run-ios

🎨 Theming

Dark & Light themes available.

Custom base colors supported: blue, green, purple, orange.
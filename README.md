# GitHub Explorer Mobile App

A React Native application that allows users to explore GitHub repositories by searching for repository names, viewing details, and managing their favorite repositories. This app is built with a focus on performance, user experience, and clean code.

---

## 🚀 Features

### Core Features
1. **Search for Repositories**
   - A search bar to find repositories by name.
   - Displays search results fetched from the GitHub REST API.
   - Pagination for search results (fetches 5 repositories at a time).
   - Skeleton loader for improved UI/UX during data fetching.

2. **Repository Details**
   - Detailed view with information including:
     - Repository Name
     - Description
     - Number of Stars
     - Number of Forks
     - Primary Programming Language
     - Owner's Username and Avatar
     - Creation Date and Last Update Date
   - List of contributors for each repository.
   - A button to open the repository in a browser.

3. **Favorites**
   - Mark repositories as "favorites."
   - View favorite repositories on a separate screen.

4. **Recommended Repositories**
   - Displays a curated list of repositories based on user interests.

5. **Onboarding Screen**
   - A simple onboarding screen to collect user's peference.

6. **Themes**
   - Supports Light and Dark themes.
   - Automatically adjusts to the device's theme settings.

7. **Error Handling**
   - Handles scenarios like no internet connection or empty search results gracefully.

---

## 🛠️ Technical Stack

- **Framework:** React Native (Expo)
- **State Management:** Redux + Redux Toolkit + AsyncThunk
- **Navigation:** Expo Router
- **UI:** Native stylesheets (React Native's built-in styling)
- **API Integration:** GitHub REST API
- **Components:** FlatLists for optimized rendering

---

## 📸 Screenshots

1. Onboarding Screen
| ![Onboarding Screen](screenshots/onboarding.png) | ![Onboarding Screen 2](screenshots/onboarding2.png) |
|:---:|:---:|
2. Home Screen with Recommended Repositories
![Home Screen](screenshots/home.png)
3. Search Results Screen
![Home Screen](screenshots/search.png)
4. Repository Details Screen
![Home Screen](screenshots/detail.png)
5. Favorites Screen
![Home Screen](screenshots/fav.png)
6. Dark Mode Example
![Home Screen](screenshots/home-dark.png)
6. Light Mode Example
![Home Screen](screenshots/home-light.png)

---

## 📦 APK

The APK file for the app is included in the repository under the `apk` folder.  
You can download it [here](apk/base.apk).  
OR
Google drive [Link](https://drive.google.com/file/d/1N4i5XehVMYmbPxrsbklj4az3K2I5Ea0o/view?usp=drive_link)
---

## 🔧 Installation and Running Locally

### Prerequisites
1. Install [Node.js](https://nodejs.org) and [Expo CLI](https://docs.expo.dev/get-started/installation/).
2. Clone the repository:
   ```bash
   git clone https://github.com/sk-py/SaasakiTask.git
   cd saasakiTask
3. Install dependencies:
   ```bash
   npm install
4. Start the development server:
   ```bash
   expo start or npx expo start

5. Running the app:
Use the Expo Go app on your mobile device to scan the QR code displayed in the terminal or in Expo DevTools to load the app.

## 📂 Project Structure

The project is organized as follows

```

SAASAKITASK/
├── app/                 # Main app directory
│ ├── _layout.tsx        # Root layout configuration
│ ├── index.tsx          # Initial check screen
│ ├── onBoarding.tsx     # Onboarding screen
│ └── (home)/            # Home group screens
│ ├── _layout.tsx        # Home layout configuration
│ ├── favourites.tsx     # Favorites screen
│ ├── index.tsx          # Main home screen
│ └── searchResults.tsx  # Search results screen
├── assets/              # Static assets
│ ├── fonts/             # Custom fonts
│ └── images/            # Images and icons
├── components/          # Reusable components
│ ├── Dialog.tsx
│ ├── OnBoarding.tsx
│ ├── RepoCard.tsx
│ └── SkeletonLoader.tsx
├── constants/           # App constants
│ └── Colors.ts          # Theme colors
├── hooks/               # Custom hooks
│ └── useOnboardingState.tsx
└── src/                 # Source files
├── store.ts             # Redux store
├── repoSlice.ts         # Redux slices
└── userSlice.ts         # User-related Redux logic


# Respire: Cigarette Sobriety Tracker - Development Guide

## 1. Project Structure & Boilerplate Explanation

This project is built using **React Native** with **Expo Router**. Expo Router brings a file-system based routing API to React Native, similar to Next.js on the web.

### Key Directories & Files:

- **`app/`**: This is the most important directory. It contains your routes.
  - **`_layout.tsx`**: This is the root layout. It wraps every screen in the app. It's where we set up global providers (like ThemeProvider) and the root navigation structure (Stack).
  - **`(tabs)/`**: A "group" directory. The parenthesis `()` mean this folder is for organization and doesn't affect the URL path. Inside, `_layout.tsx` defines the Tab Bar navigation.
  - **`index.tsx`**: The default route (`/`).
  - **`+html.tsx`**: (If present) Configures the HTML root for web builds.
  - **`modal.tsx`**: Example of a screen presented as a modal.

- **`components/`**: Reusable UI components.
  - **`Themed.tsx`**: Contains wrappers around `Text` and `View` that automatically adjust colors based on the active theme (light/dark).

- **`constants/`**: App-wide constants.
  - **`Colors.ts`**: Defines the color palette for light and dark modes.

- **`hooks/`**: Custom React hooks.
  - **`useColorScheme.ts`**: Helper to detect and toggle the color scheme.

### Detailed Breakdown: `app/_layout.tsx`

This file is the **entry point** for the navigation.

```tsx
export default function RootLayout() {
  const colorScheme = useColorScheme(); // Detects if user is in Dark Mode

  return (
    // Provides the theme to all child components
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* The Stack navigator manages a stack of screens */}
      <Stack>
         {/* The (tabs) group is the main screen */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* The modal screen is a separate route */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
```

## 3. Implemented Features (Cyberpunk Edition)

### Core Components (`src/`)

- **`screens/DashboardScreen.tsx`**: The main command center.
    - **"Not One Puff" Timer**: Counts days, hours, minutes, seconds since quit date.
    - **Financials**: Calculates money saved based on $15/pack cost.
    - **Cyber Lung**: Visual representation of lung health using `react-native-svg` and `lucide-react-native`.
    
- **`components/CyberLung.tsx`**: 
    - Animated lung status that evolves from "Critical Failure" (Relapse) to "Optimal Function" (7+ Days).
    - Uses `react-native-reanimated` for the "pulse" effect.

- **`utils/storage.ts`**:
    - Manage data persistence using `AsyncStorage`.
    - Keys: `@respire_quit_date`, `@respire_money_saved`.

- **`constants/Colors.ts`**:
    - **Cyberpunk Palette**: Neon Cyan (`#00F3FF`), Magenta (`#FF00FF`), Lime (`#00FF9D`), and Deep Black (`#050511`).

### How to Reset
- If you relapse, tap the "RELAPSE DETECTED" button at the bottom of the dashboard to reset your stats.

### Next Steps (Future Roadmap)
- [ ] Add "Panic Button" with breathing exercises.
- [ ] Add "Yakuza Bet" savings goal.
- [ ] Add more detailed health milestones.


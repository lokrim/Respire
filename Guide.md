# Respire: The Ultimate React Native & Expo Guide 🚀

Welcome to the **Respire** development guide. This document is designed to teach you React Native and Expo **from zero**, using the actual code of this project as living examples.

---

## 📚 Table of Contents
1. [The Tech Stack: React Native vs. Expo](#1-the-tech-stack-react-native-vs-expo)
2. [Project Structure Anatomy](#2-project-structure-anatomy)
3. [React Fundamentals](#3-react-fundamentals)
4. [The Power of Hooks (Theory & Practice)](#4-the-power-of-hooks-theory--practice)
5. [Navigation with Expo Router](#5-navigation-with-expo-router)
6. [Data Persistence (AsyncStorage)](#6-data-persistence-asyncstorage)
7. [Styling & Theming](#7-styling--theming)
8. [Animations (Reanimated)](#8-animations-reanimated)

---

## 1. The Tech Stack: React Native vs. Expo

### What is React Native?
**React Native** allows you to write mobile apps for iOS and Android using JavaScript and React. Unlike "hybrid" apps that run inside a webview (like a website), React Native renders **real native UI components**.
- **View** -> `UIView` (iOS) / `android.view.View` (Android)
- **Text** -> `UITextView` / `TextView`

### What is Expo?
**Expo** is a framework and platform built *around* React Native. It simplifies the development process by removing the need to touch native code (Swift/Kotlin) for most use cases.
- **Expo Go**: The app you use to preview your project instantly.
- **Expo SDK**: A massive library of pre-built modules (Camera, Location, Sensors, Haptics) that work out of the box.

---

## 2. Project Structure Anatomy

Understanding where files live is half the battle. Here is the structure of **Respire**:

```text
/
├── app/                  # 👈 The "Router". Every file here is a screen/route.
│   ├── (tabs)/           # A "Group". Files inside are tabs, but "(tabs)" isn't in the URL.
│   │   ├── _layout.tsx   # Defines the Bottom Tab Bar.
│   │   ├── index.tsx     # The Dashboard (Home) screen.
│   │   ├── health.tsx    # Health timeline screen.
│   │   └── settings.tsx  # Settings screen.
│   ├── _layout.tsx       # The ROOT layout. Wraps the entire app (Themes, Fonts).
│   └── +html.tsx         # Web entry point (if we deployed to web).
├── assets/               # Images, fonts, icons.
├── src/                  # 👈 The "Brain". Your logic and UI code.
│   ├── components/       # Reusable UI (Buttons, Cards, CyberLung).
│   ├── constants/        # App-wide values (Colors, Layouts).
│   └── utils/            # Helper functions (Storage, Date formatters).
└── app.json              # Configuration (App name, icon, splash screen).
```

---

## 3. React Fundamentals

### Components
React apps are built of **Components**. A component is a JavaScript function that returns some UI.

**Example from `src/components/CyberLung.tsx`:**
```tsx
// 1. Import dependencies
import { View } from 'react-native';

// 2. Define the Component Function
export default function CyberLung({ daysSober }) {
  // 3. Keep logic here (like calculating lung status)
  
  // 4. Return JSX (The UI)
  return (
    <View>
       {/* ... content ... */}
    </View>
  );
}
```

### JSX (JavaScript XML)
JSX looks like HTML, but it's JavaScript.
- HTML: `<div class="container">Hello</div>`
- JSX: `<View style={styles.container}><Text>Hello</Text></View>`

### Props (Properties)
Props are how we pass data **down** from a parent to a child.
In `DashboardScreen`, we use `<CyberLung daysSober={5} />`. `daysSober` is a prop.

---

## 4. The Power of Hooks (Theory & Practice)

Hooks allow function components to "hook into" React features like state and lifecycle methods. They always start with `use`.

### 1. `useState` - "The Memory"
Allows a component to remember values between renders.

**Example from `DashboardScreen.tsx`:**
```tsx
// const [variable, setterFunction] = useState(initialValue);
const [timeElapsed, setTimeElapsed] = useState(0);

// Later...
setTimeElapsed(1000); // Triggers a re-render with new value.
```
**Concept**: When `setTimeElapsed` is called, React re-runs the `DashboardScreen` function, updating the UI with the new number.

### 2. `useEffect` - "The Side Effect"
Runs code when the component mounts (loads) or when specific variables change.

**Example from `DashboardScreen.tsx`:**
```tsx
useEffect(() => {
    // 1. This code runs when 'quitDate' changes.
    if (!quitDate) return;

    // Start a timer
    const interval = setInterval(() => {
        // ... calculation logic ...
    }, 1000);

    // 2. Cleanup Function (Runs when component unmounts)
    return () => clearInterval(interval);
}, [quitDate]); // 👈 Dependency Array. Rules:
// [] -> Run once on mount.
// [quitDate] -> Run every time 'quitDate' changes.
// No array -> Run on every render (Dangerous!).
```

### 3. `useCallback` - "The Memorizer"
 Prevents a function from being re-created on every render. Useful for performance.

**Example from `DashboardScreen.tsx`:**
```tsx
const loadData = useCallback(async () => {
    const date = await Storage.getQuitDate();
    setQuitDate(date);
}, []); // 👈 Function is created once and reused.
```

### 4. `useSharedValue` & `useAnimatedStyle` (Reanimated)
Special hooks for high-performance animations that run on the UI thread (60fps), separate from the JavaScript thread.

**Example from `CyberLung.tsx`:**
```tsx
const pulse = useSharedValue(1); // Like state, but for animations.

// Define how the style changes based on the value
const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
}));
```

---

## 5. Navigation with Expo Router

Expo Router uses the **file system** to define routes.

### The Special Files:
1.  **`_layout.tsx`**: A "Wrapper" for screens.
    -   In `app/(tabs)/_layout.tsx`, we define a `<Tabs>` navigator.
    -   It automatically finds `index.tsx`, `health.tsx`, etc., and makes them tabs because they are in the same folder.
    
2.  **`index.tsx`**: The default route for a folder.
    -   `app/(tabs)/index.tsx` is the first screen shown in the tabs.

### Linking
To navigate between screens programmatically:
```tsx
import { router } from 'expo-router';

// Go to settings
router.push('/settings');

// Go back
router.back();
```

---

## 6. Data Persistence (AsyncStorage)

Mobile apps lose their state when closed. We use `AsyncStorage` (a simple key-value store) to save data permanently.

**Look at `src/utils/storage.ts`:**
```tsx
const KEYS = { QUIT_DATE: '@respire_quit_date' };

export const Storage = {
    async saveQuitDate(date: number) {
        // Must convert to string to save
        await AsyncStorage.setItem(KEYS.QUIT_DATE, date.toString());
    },

    async getQuitDate() {
        const value = await AsyncStorage.getItem(KEYS.QUIT_DATE);
        // Must parse back to number
        return value ? parseInt(value) : null;
    }
}
```
**Async/Await**: Storage operations are slow (relatively). We use `async/await` to wait for them to finish without freezing the app.

---

## 7. Styling & Theming

### StyleSheet
We don't use CSS files. We use JavaScript objects.
```tsx
const styles = StyleSheet.create({
    container: {
        flex: 1, // Take up all available space
        backgroundColor: '#000',
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
    },
    text: {
        color: 'white',
        fontSize: 20
    }
});
```

### Dynamic Theming (`Colors.ts`)
We defined a `CyberpunkTheme` object in `src/constants/Colors.ts`. We import this everywhere to ensure consistency. If we change the primary color there, it updates everywhere.

---

## 8. Animations (Reanimated)

React Native has a built-in `Animated` API, but **React Native Reanimated** is the industry standard for complex, smooth animations.

**Key Concept: The UI Thread**
-   **JS Thread**: Runs your React logic. Can get busy (laggy).
-   **UI Thread**: Draws the screen.
-   **Reanimated**: Declares animations in JS, but ships them to the UI thread to run smoothly even if the app is busy calculating.

In `CyberLung.tsx`, the breathing animation continues smoothly even if sorting the list of logs takes a few milliseconds, because it's running independently on the UI thread.

---

## Summary
You have built a robust application using modern patterns:
-   **Structure**: Domain-driven separation (`app` vs `src`).
-   **Navigation**: Dynamic file-based routing.
-   **State**: Hooks for local state, AsyncStorage for persistence.
-   **UI**: Component-based architecture with dynamic styling.

Keep hacking! 🤖🚬🚫

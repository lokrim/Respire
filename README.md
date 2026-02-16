
<div align="center">
  <img src="assets/images/icon.png" alt="Respire Logo" width="120" height="120" />
  <h1>RESPIRE</h1>
  <h3>The Cyberpunk Cigarette Sobriety Protocol</h3>
  
  <p>
    <b>Hack your biology. Purge the toxins. Reclaim your system.</b>
  </p>

  <p>
    <a href="https://expo.dev">
      <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    </a>
    <a href="https://reactnative.dev">
      <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
  </p>
</div>

---

## ⚡ Overview

**Respire** is not just another quit-smoking app. It is a **cyberpunk-themed augmentation suite** designed to gamify the process of smoking cessation. 

By treating your body as a biological system ('hardware') and nicotine addiction as a malicious virus ('malware'), Respire provides you with the data, visuals, and tools needed to execute a full system purge and restore optimal functionality.

---

## 🔮 Core Systems (Features)

### 1. **The Dashboard (Command Center)**
-   **Real-time Protocol Timer**: Tracks your sobriety streak down to the second.
-   **CyberLung Visualizer**: An animated, evolving component (`react-native-reanimated`) that visually represents your lung healing process. It pulses rhythmically and changes state from "Critical Failure" to "Optimal Function" as you stay sober.
-   **Financial Metrics**: Tracks "Credits Earned" (money saved) and "Toxins Avoided".
-   **Compact Panic Mode**: A quick-access button for when cravings hit hard.

### 2. **Bio-Hack Upgrades (Health Timeline)**
-   A visual timeline of health milestones based on real medical data.
-   Unlocks "upgrades" like "Normalization" (20 mins), "Neuro-Repair" (48 hours), and "Cilia Recovery" (9 months).
-   Track your biological restoration progress percentage.

### 3. **Yakuza Stash (Rewards)**
-   **Gamified Economy**: Convert your saved money into "Credits".
-   **Bounty System**: Create custom rewards (e.g., "New Cyberware", "Video Game", "Steak Dinner") and "buy" them using the credits you've earned by not smoking.

### 4. **System Config (Settings)**
-   Customize your habit profile: Cigarettes per day, cost per pack (Credits per Cig).
-   View detailed logs of panic button usage and relapses.
-   **Data Persistence**: All data is stored locally and encrypted on-device using `AsyncStorage`.

---

## 🛠 Tech Stack

-   **Framework**: [React Native](https://reactnative.dev/) (via [Expo SDK 52](https://expo.dev/))
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **Styling**: `StyleSheet` with a custom **Cyberpunk Design System** (Neon/Dark Mode)
-   **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
-   **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
-   **Storage**: `@react-native-async-storage/async-storage`

---

## 🚀 Initialization (Getting Started)

### Prerequisites
-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [Expo Go](https://expo.dev/client) app installed on your iOS/Android device.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/respire.git
    cd respire
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the Protocol**
    ```bash
    npx expo start
    ```

4.  **Connect Device**
    -   Scan the QR code with your phone (Android) or Camera app (iOS).
    -   Press `w` to run in a web browser (limited functionality).

---

## 📂 System Architecture

```text
/
├── app/                  # Application Routes (Expo Router)
│   ├── (tabs)/           # Main Tab Navigation
│   │   ├── _layout.tsx   # Tab configuration
│   │   ├── index.tsx     # Dashboard Screen
│   │   ├── health.tsx    # Bio-Hack Upgrades Screen
│   │   ├── rewards.tsx   # Yakuza Stash Screen
│   │   └── settings.tsx  # System Config Screen
│   └── _layout.tsx       # Root Layout & Theme Provider
├── src/                  # Core Logic & UI
│   ├── components/       # Reusable UI (CyberLung, Themed Views)
│   ├── constants/        # Theme definitions (Colors, Layout)
│   └── utils/            # Logic (Storage, Time Formatting)
└── assets/               # Static assets (Cyberpunk BG, Icons)
```

---

## 🎨 Design Philosophy

Respire abides by a strict **High-Tech, Low-Life** aesthetic:
-   **Colors**: Neon Cyan (`#00F3FF`), Magenta (`#FF00FF`), and Lime Green (`#00FF9D`) against Deep Space Black (`#050511`).
-   **Typography**: Monospace fonts (`Courier`) for that terminal/hacker feel.
-   **UI**: Semi-transparent panels, glowing borders (`textShadow`, `boxShadow`), and micro-interactions.

---

## 🤝 Contributing

Protocol upgrades are welcome. 

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p><b>INITIATE PROTOCOL. TERMINATE ADDICTION.</b></p>
  <p>Built with 💻 and ☕ by @Lokrim</p>
</div>

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const CyberpunkTheme = {
    primary: '#00F3FF', // Cyan
    secondary: '#FF00FF', // Magenta
    accent: '#00FF9D', // Lime Green
    background: '#050511', // Very dark blue/black
    panel: '#0A0A1F', // Slightly lighter background for cards/modals
    text: '#E0E0E0', // Off-white
    textDim: '#707070', // Dimmed text
    border: '#333333',
    error: '#FF3860', // Red/Pink
    tint: tintColorDark,
};

export default {
    light: {
        text: '#000',
        textDim: '#666',
        background: '#fff',
        panel: '#f0f0f0',
        tint: tintColorLight,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorLight,
        border: '#ccc',
        primary: '#007AFF', // Standard Blue
        secondary: '#FF2D55', // Pinkish Red
        accent: '#34C759', // Green
        error: '#FF3B30', // Red
    },
    dark: {
        ...CyberpunkTheme,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorDark,
    },
};

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
        ...CyberpunkTheme,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorDark,
    },
    dark: {
        ...CyberpunkTheme,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorDark,
    },
};

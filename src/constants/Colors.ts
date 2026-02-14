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
    error: '#FF3860', // Red/Pink
    border: '#333333',
    tint: tintColorDark,
};

export default {
    light: {
        text: '#000',
        background: '#fff',
        tint: tintColorLight,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorLight,
        border: '#ccc',
    },
    dark: {
        ...CyberpunkTheme,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorDark,
    },
};

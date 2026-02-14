import { MessageSquare, Wind, X, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, Vibration } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { CyberpunkTheme } from '@/src/constants/Colors';
import { Storage } from '@/src/utils/storage';
import { Text, View } from './Themed';

interface PanicModalProps {
    visible: boolean;
    onClose: () => void;
}

type PanicMode = 'menu' | 'breathe' | 'distract' | 'log';

export default function PanicModal({ visible, onClose }: PanicModalProps) {
    const [mode, setMode] = useState<PanicMode>('menu');
    const [breathPhase, setBreathPhase] = useState('');
    const [triggerText, setTriggerText] = useState('');

    // Animation Values
    const breathScale = useSharedValue(1);
    const glitchOpacity = useSharedValue(0);

    // Reset state when opening
    useEffect(() => {
        if (visible) {
            setMode('menu');
            setTriggerText('');
        }
    }, [visible]);

    // Breathing Animation Logic
    useEffect(() => {
        if (mode === 'breathe') {
            const breatheLoop = async () => {
                // Inhale (4s)
                setBreathPhase('INHALE (4s)');
                breathScale.value = withTiming(2, { duration: 4000, easing: Easing.inOut(Easing.ease) });
                await new Promise(r => setTimeout(r, 4000));

                // Hold (7s)
                setBreathPhase('HOLD (7s)');
                await new Promise(r => setTimeout(r, 7000));

                // Exhale (8s)
                setBreathPhase('EXHALE (8s)');
                breathScale.value = withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) });
                await new Promise(r => setTimeout(r, 8000));

                // Repeat if still in breathe mode
                if (mode === 'breathe') breatheLoop();
            };
            breatheLoop();
        } else {
            cancelAnimation(breathScale);
            breathScale.value = 1;
        }
    }, [mode, breathScale]);

    const handleDistract = () => {
        Vibration.vibrate(50);
        glitchOpacity.value = 1;
        glitchOpacity.value = withTiming(0, { duration: 200 });
    };

    const handleLog = async () => {
        if (triggerText.trim()) {
            await Storage.addLog({
                id: Date.now().toString(),
                timestamp: Date.now(),
                trigger: triggerText,
                type: 'panic'
            });
        }
        onClose();
    };

    const breathStyle = useAnimatedStyle(() => ({
        transform: [{ scale: breathScale.value }],
    }));

    const glitchStyle = useAnimatedStyle(() => ({
        opacity: glitchOpacity.value,
    }));

    const renderContent = () => {
        switch (mode) {
            case 'menu':
                return (
                    <View style={styles.menuContainer}>
                        <Text style={styles.title}>EMERGENCY PROTOCOL</Text>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setMode('breathe')}>
                            <Wind size={32} color={CyberpunkTheme.primary} />
                            <Text style={styles.optionText}>BREATHE (STABILIZE)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => setMode('distract')}>
                            <Zap size={32} color={CyberpunkTheme.secondary} />
                            <Text style={styles.optionText}>DISTRACT (OVERRIDE)</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'breathe':
                return (
                    <View style={styles.centerContainer}>
                        <Animated.View style={[styles.breathCircle, breathStyle]} />
                        <Text style={styles.breathText}>{breathPhase}</Text>
                        <TouchableOpacity style={styles.backButton} onPress={() => setMode('log')}>
                            <Text style={styles.backButtonText}>I&apos;M STABLE</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'distract':
                return (
                    <TouchableOpacity activeOpacity={1} style={styles.distractContainer} onPress={handleDistract}>
                        <Animated.View style={[styles.glitchOverlay, glitchStyle]} />
                        <Text style={styles.distractText}>TAP RAPIDLY TO DISSIPATE ENERGY</Text>
                        <TouchableOpacity style={styles.backButton} onPress={() => setMode('log')}>
                            <Text style={styles.backButtonText}>SYSTEM RESTORED</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                );
            case 'log':
                return (
                    <View style={styles.menuContainer}>
                        <MessageSquare size={48} color={CyberpunkTheme.accent} style={{ marginBottom: 20 }} />
                        <Text style={styles.title}>LOG TRIGGER</Text>
                        <Text style={styles.subtitle}>What caused the instability?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Stress, boredom, social..."
                            placeholderTextColor={CyberpunkTheme.textDim}
                            value={triggerText}
                            onChangeText={setTriggerText}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.actionButton} onPress={handleLog}>
                            <Text style={styles.actionButtonText}>ARCHIVE & CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X size={24} color={CyberpunkTheme.text} />
                </TouchableOpacity>
                {renderContent()}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(5, 5, 17, 0.95)',
        justifyContent: 'center',
        padding: 20,
    },
    menuContainer: {
        alignItems: 'center',
        width: '100%',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    distractContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: CyberpunkTheme.primary,
        marginBottom: 40,
        fontFamily: 'Courier',
        letterSpacing: 2,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: CyberpunkTheme.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 243, 255, 0.1)',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: CyberpunkTheme.primary,
    },
    optionText: {
        color: CyberpunkTheme.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
    breathCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: CyberpunkTheme.primary,
        opacity: 0.6,
        marginBottom: 50,
        shadowColor: CyberpunkTheme.primary,
        shadowRadius: 20,
        elevation: 10,
    },
    breathText: {
        fontSize: 24,
        color: CyberpunkTheme.text,
        marginBottom: 40,
        fontFamily: 'Courier',
    },
    backButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: CyberpunkTheme.textDim,
        borderRadius: 5,
        marginTop: 20,
    },
    backButtonText: {
        color: CyberpunkTheme.textDim,
        fontFamily: 'Courier',
    },
    glitchOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: CyberpunkTheme.secondary,
        zIndex: -1,
    },
    distractText: {
        color: CyberpunkTheme.text,
        fontSize: 18,
        fontFamily: 'Courier',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: CyberpunkTheme.panel,
        width: '100%',
        padding: 15,
        borderRadius: 5,
        color: CyberpunkTheme.text,
        borderWidth: 1,
        borderColor: CyberpunkTheme.border,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: CyberpunkTheme.accent,
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    actionButtonText: {
        color: CyberpunkTheme.background,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    }
});

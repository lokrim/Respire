import { Cloud, CloudRain, ShieldCheck, Wind } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { CyberpunkTheme } from '@/src/constants/Colors';
import { Text } from './Themed';

interface CyberLungProps {
    daysSober: number;
}

export default function CyberLung({ daysSober }: CyberLungProps) {
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));

    const getLungStatus = () => {
        if (daysSober < 1) {
            return {
                icon: <CloudRain size={80} color={CyberpunkTheme.error} />,
                label: 'CRITICAL FAILURE',
                subtext: 'System Corrupted. Reset Imminent.',
                color: CyberpunkTheme.error,
            };
        } else if (daysSober < 3) {
            return {
                icon: <Cloud size={80} color={CyberpunkTheme.textDim} />,
                label: 'PURGING TOXINS',
                subtext: 'CO levels dropping...',
                color: CyberpunkTheme.textDim,
            };
        } else if (daysSober < 7) {
            return {
                icon: <Wind size={80} color={CyberpunkTheme.accent} />,
                label: 'SYSTEM RESTORING',
                subtext: 'Airflow improving...',
                color: CyberpunkTheme.accent,
            };
        } else {
            return {
                icon: <ShieldCheck size={80} color={CyberpunkTheme.primary} />,
                label: 'OPTIMAL FUNCTION',
                subtext: 'Lung capacity normalized.',
                color: CyberpunkTheme.primary,
            };
        }
    };

    const status = getLungStatus();

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.iconContainer, animatedStyle, { borderColor: status.color }]}>
                {status.icon}
            </Animated.View>
            <Text style={[styles.label, { color: status.color }]}>{status.label}</Text>
            <Text style={styles.subtext}>{status.subtext}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 16,
        shadowColor: CyberpunkTheme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Courier', // Monospace fallback
        letterSpacing: 2,
        marginBottom: 4,
    },
    subtext: {
        fontSize: 12,
        color: CyberpunkTheme.textDim,
        fontFamily: 'Courier',
    },
});

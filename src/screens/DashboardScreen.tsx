import { useFocusEffect } from 'expo-router';
import { Activity, CircleDollarSign, Clock, Power } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import CyberLung from '@/src/components/CyberLung';
import { Text, View } from '@/src/components/Themed';
import { CyberpunkTheme } from '@/src/constants/Colors';
import Layout from '@/src/constants/Layout';
import { Storage } from '@/src/utils/storage';

const CIGS_PER_DAY = 10;
const COST_PER_PACK = 15; // $15 per pack of 20
const COST_PER_CIG = COST_PER_PACK / 20;

export default function DashboardScreen() {
    const [quitDate, setQuitDate] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moneySaved, setMoneySaved] = useState<number>(0);
    const [cigsAvoided, setCigsAvoided] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        const date = await Storage.getQuitDate();
        setQuitDate(date);

        // In a real app, we'd load financials here too
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    useEffect(() => {
        if (!quitDate) {
            setTimeElapsed(0);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - quitDate;
            setTimeElapsed(diff);

            // Calculate derived stats
            const days = diff / (1000 * 60 * 60 * 24);
            setMoneySaved(days * CIGS_PER_DAY * COST_PER_CIG);
            setCigsAvoided(Math.floor(days * CIGS_PER_DAY));
        }, 1000);

        return () => clearInterval(interval);
    }, [quitDate]);

    const handleStartQuit = async () => {
        const now = Date.now();
        await Storage.saveQuitDate(now);
        setQuitDate(now);
    };

    const handleRelapse = async () => {
        Alert.alert(
            "Reset Timer?",
            "Relapse is part of recovery. Are you sure you want to reset?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        await Storage.clearQuitDate();
                        setQuitDate(null);
                        setTimeElapsed(0);
                        setMoneySaved(0);
                        setCigsAvoided(0);
                    }
                }
            ]
        );
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));

        return { days, hours, minutes, seconds };
    };

    const { days, hours, minutes, seconds } = formatTime(timeElapsed);
    const daysSober = timeElapsed / (1000 * 60 * 60 * 24);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadData().then(() => setRefreshing(false));
    }, [loadData]);

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CyberpunkTheme.primary} />}
        >
            <View style={styles.container}>
                {/* Header Status */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>STATUS: {quitDate ? 'ONLINE' : 'OFFLINE'}</Text>
                    {quitDate && <Activity size={20} color={CyberpunkTheme.primary} />}
                </View>

                {/* Main Timer Display */}
                <View style={styles.timerContainer}>
                    {!quitDate ? (
                        <TouchableOpacity style={styles.startButton} onPress={handleStartQuit}>
                            <Power size={48} color={CyberpunkTheme.background} />
                            <Text style={styles.startButtonText}>INITIATE PROTOCOL</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <CyberLung daysSober={daysSober} />

                            <View style={styles.timeDisplay}>
                                <View style={styles.timeUnit}>
                                    <Text style={styles.timeValue}>{days.toString().padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>DAYS</Text>
                                </View>
                                <Text style={styles.colon}>:</Text>
                                <View style={styles.timeUnit}>
                                    <Text style={styles.timeValue}>{hours.toString().padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>HRS</Text>
                                </View>
                                <Text style={styles.colon}>:</Text>
                                <View style={styles.timeUnit}>
                                    <Text style={styles.timeValue}>{minutes.toString().padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>MIN</Text>
                                </View>
                                <Text style={styles.colon}>:</Text>
                                <View style={styles.timeUnit}>
                                    <Text style={styles.timeValue}>{seconds.toString().padStart(2, '0')}</Text>
                                    <Text style={styles.timeLabel}>SEC</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Stats Grid */}
                {quitDate && (
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <CircleDollarSign size={24} color={CyberpunkTheme.secondary} />
                            <Text style={styles.statValue}>${moneySaved.toFixed(2)}</Text>
                            <Text style={styles.statLabel}>CREDITS SAVED</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Clock size={24} color={CyberpunkTheme.accent} />
                            <Text style={styles.statValue}>{cigsAvoided}</Text>
                            <Text style={styles.statLabel}>TOXINS AVOIDED</Text>
                        </View>
                    </View>
                )}

                {/* Panic / Reset */}
                {quitDate && (
                    <TouchableOpacity style={styles.resetButton} onPress={handleRelapse}>
                        <Text style={styles.resetText}>RELAPSE DETECTED (RESET)</Text>
                    </TouchableOpacity>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: CyberpunkTheme.background,
    },
    container: {
        flex: 1,
        padding: Layout.spacing.lg,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: CyberpunkTheme.primary,
        paddingBottom: 8,
    },
    headerText: {
        fontFamily: 'Courier',
        color: CyberpunkTheme.primary,
        letterSpacing: 2,
        fontSize: 14,
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    startButton: {
        backgroundColor: CyberpunkTheme.primary,
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: CyberpunkTheme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    startButtonText: {
        color: CyberpunkTheme.background,
        marginTop: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    timeUnit: {
        alignItems: 'center',
        width: 60,
    },
    timeValue: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        color: CyberpunkTheme.text,
        textShadowColor: CyberpunkTheme.primary,
        textShadowRadius: 10,
    },
    timeLabel: {
        fontSize: 10,
        color: CyberpunkTheme.textDim,
        marginTop: 4,
    },
    colon: {
        fontSize: 32,
        color: CyberpunkTheme.textDim,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    statCard: {
        backgroundColor: CyberpunkTheme.panel,
        width: '48%',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CyberpunkTheme.border,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: CyberpunkTheme.text,
        marginVertical: 8,
        fontFamily: 'Courier',
    },
    statLabel: {
        fontSize: 10,
        color: CyberpunkTheme.textDim,
        letterSpacing: 1,
    },
    resetButton: {
        marginTop: 'auto',
        marginBottom: 20,
        alignSelf: 'center',
    },
    resetText: {
        color: CyberpunkTheme.error,
        fontSize: 12,
        letterSpacing: 1,
        textDecorationLine: 'underline',
    }
});

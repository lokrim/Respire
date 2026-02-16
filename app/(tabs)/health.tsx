import { useFocusEffect } from 'expo-router';
import { Activity, Brain, CheckCircle2, Heart, Lock, Smile, Wind } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { CyberpunkTheme } from '@/src/constants/Colors';
import { Storage } from '@/src/utils/storage';

interface Milestone {
    id: string;
    title: string;
    description: string;
    durationMs: number;
    icon: any;
}

const MILESTONES: Milestone[] = [
    { id: '1', title: 'Start of Protocol', description: 'The decision is made.', durationMs: 0, icon: Activity },
    { id: '2', title: 'Normalization', description: 'Heart rate & BP drop to normal levels.', durationMs: 20 * 60 * 1000, icon: Heart },
    { id: '3', title: 'Oxygenation', description: 'CO levels drop, oxygen levels normalize.', durationMs: 8 * 60 * 60 * 1000, icon: Wind },
    { id: '4', title: 'Cardiac Safety', description: 'Heart attack risk begins to decrease.', durationMs: 24 * 60 * 60 * 1000, icon: Heart },
    { id: '5', title: 'Neuro-Repair', description: 'Nerve endings regrow. Taste & smell improve.', durationMs: 48 * 60 * 60 * 1000, icon: Brain },
    { id: '6', title: 'Bronchial Relax', description: 'Breathing becomes easier. Energy boosts.', durationMs: 72 * 60 * 60 * 1000, icon: Wind },
    { id: '7', title: 'Craving Reduction', description: 'Daily cravings begin to decrease significantly.', durationMs: 5 * 24 * 60 * 60 * 1000, icon: Smile },
    { id: '8', title: 'Circulation Boost', description: 'Lung function increases up to 30%.', durationMs: 14 * 24 * 60 * 60 * 1000, icon: Activity },
    { id: '9', title: 'Receptor Reset', description: 'Brain nicotine receptors normalize.', durationMs: 30 * 24 * 60 * 60 * 1000, icon: Brain },
    { id: '10', title: 'Fertility Boost', description: 'Reproductive health improves.', durationMs: 90 * 24 * 60 * 60 * 1000, icon: Heart },
    { id: '11', title: 'Stress Defense', description: 'Ability to handle stress without nicotine.', durationMs: 180 * 24 * 60 * 60 * 1000, icon: Brain },
    { id: '12', title: 'Cilia Recovery', description: 'Lungs clear mucus significantly better.', durationMs: 270 * 24 * 60 * 60 * 1000, icon: Wind },
    { id: '13', title: 'Coronary Health', description: 'Heart disease risk cut in half.', durationMs: 365 * 24 * 60 * 60 * 1000, icon: Heart },
];

/**
 * Health Screen
 * Displays health milestones that unlock as the user stays sober.
 */
export default function HealthScreen() {
    const [timeElapsed, setTimeElapsed] = useState(0);

    const loadData = useCallback(async () => {
        const quitDate = await Storage.getQuitDate();
        if (quitDate) {
            setTimeElapsed(Date.now() - quitDate);
        } else {
            setTimeElapsed(0);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const renderMilestone = ({ item, index }: { item: Milestone, index: number }) => {
        const unlocked = timeElapsed >= item.durationMs;
        const isLast = index === MILESTONES.length - 1;

        return (
            <View style={styles.timelineItem}>
                <View style={[styles.timelineLine, isLast && { height: 0 }, unlocked ? styles.lineUnlocked : styles.lineLocked]} />

                <View style={styles.iconContainer}>
                    {unlocked ? (
                        <View style={styles.unlockedIconCircle}>
                            <item.icon size={20} color={CyberpunkTheme.background} />
                        </View>
                    ) : (
                        <View style={styles.lockedIconCircle}>
                            <Lock size={16} color={CyberpunkTheme.textDim} />
                        </View>
                    )}
                </View>

                <View style={[styles.card, unlocked ? styles.cardUnlocked : styles.cardLocked]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.title, unlocked ? styles.textUnlocked : styles.textLocked]}>{item.title}</Text>
                        {unlocked && <CheckCircle2 size={16} color={CyberpunkTheme.accent} />}
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                    {!unlocked && (
                        <Text style={styles.timeRemaining}>
                            Unlocks in {Math.ceil((item.durationMs - timeElapsed) / (1000 * 60 * 60 * 24))} days
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Heart size={32} color={CyberpunkTheme.primary} style={{ marginBottom: 10 }} />
                <Text style={styles.headerText}>BIO-HACK UPGRADES</Text>
            </View>

            <FlatList
                data={MILESTONES}
                renderItem={renderMilestone}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CyberpunkTheme.background,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: CyberpunkTheme.panel,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: CyberpunkTheme.primary,
        marginBottom: 10,
    },
    headerText: {
        fontFamily: 'Courier',
        fontSize: 20,
        color: CyberpunkTheme.primary,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 20,
        minHeight: 80,
    },
    timelineLine: {
        position: 'absolute',
        top: 30,
        left: 20,
        width: 2,
        height: '110%', // Extend to next item
        zIndex: -1,
    },
    lineUnlocked: {
        backgroundColor: CyberpunkTheme.primary,
    },
    lineLocked: {
        backgroundColor: '#333',
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
        marginRight: 15,
    },
    unlockedIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: CyberpunkTheme.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: CyberpunkTheme.primary,
        shadowRadius: 5,
        shadowOpacity: 0.5,
    },
    lockedIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: CyberpunkTheme.panel,
        borderWidth: 1,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
    },
    cardUnlocked: {
        backgroundColor: 'rgba(0, 243, 255, 0.05)',
        borderColor: CyberpunkTheme.primary,
    },
    cardLocked: {
        backgroundColor: '#111',
        borderColor: '#333',
        opacity: 0.7,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
    textUnlocked: {
        color: CyberpunkTheme.text,
    },
    textLocked: {
        color: CyberpunkTheme.textDim,
    },
    description: {
        color: CyberpunkTheme.textDim,
        fontSize: 12,
    },
    timeRemaining: {
        color: CyberpunkTheme.secondary,
        fontSize: 10,
        marginTop: 5,
        fontFamily: 'Courier',
    }
});

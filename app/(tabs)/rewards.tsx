import { useFocusEffect } from 'expo-router';
import { Lock, Plus, Trash2, Unlock } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, Modal, RefreshControl, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { CyberpunkTheme } from '@/src/constants/Colors';
import { Bounty, Storage } from '@/src/utils/storage';

export default function RewardsScreen() {
    const [bounties, setBounties] = useState<Bounty[]>([]);
    const [creditsEarned, setCreditsEarned] = useState(0);
    const [spendable, setSpendable] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // Add Bounty state
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCost, setNewCost] = useState('');

    const loadData = useCallback(async (isRefresh: boolean = false) => {
        if (isRefresh) setRefreshing(true);
        const quitDate = await Storage.getQuitDate();
        const settings = await Storage.getSettings();
        const savedBounties = await Storage.getBounties();

        setBounties(savedBounties);

        if (quitDate && settings) {
            const now = Date.now();
            const diff = now - quitDate;
            const days = diff / (1000 * 60 * 60 * 24);
            // Credit calculation
            const totalCredits = Math.floor(days * settings.cigsPerDay * settings.creditsPerCig);

            const spent = savedBounties
                .filter(b => b.redeemed)
                .reduce((sum, b) => sum + b.cost, 0);

            setCreditsEarned(totalCredits);
            setSpendable(totalCredits - spent);
        } else {
            setCreditsEarned(0);
            setSpendable(0);
        }

        if (isRefresh) setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleAddBounty = async () => {
        if (!newTitle || !newCost) return;

        const cost = parseFloat(newCost);
        if (isNaN(cost)) return;

        const newBounty: Bounty = {
            id: Date.now().toString(),
            title: newTitle,
            cost,
            redeemed: false,
            dateAdded: Date.now(),
        };

        await Storage.addBounty(newBounty);
        setModalVisible(false);
        setNewTitle('');
        setNewCost('');
        loadData();
    };

    const handleRedeem = async (bounty: Bounty) => {
        if (spendable >= bounty.cost) {
            const updatedBounties = bounties.map(b =>
                b.id === bounty.id ? { ...b, redeemed: true } : b
            );
            await Storage.saveBounties(updatedBounties);
            loadData();
        }
    };

    const handleDelete = async (id: string) => {
        const updatedBounties = bounties.filter(b => b.id !== id);
        await Storage.saveBounties(updatedBounties);
        loadData();
    };

    const renderBounty = ({ item }: { item: Bounty }) => {
        const canAfford = spendable >= item.cost;

        return (
            <View style={[styles.bountyCard, item.redeemed && styles.bountyCardRedeemed]}>
                <View style={styles.bountyInfo}>
                    <Text style={[styles.bountyTitle, item.redeemed && styles.textDim]}>{item.title}</Text>
                    <Text style={[styles.bountyCost, item.redeemed && styles.textDim]}>C {item.cost}</Text>
                </View>

                <View style={styles.bountyActions}>
                    {item.redeemed ? (
                        <View style={styles.redeemedBadge}>
                            <Text style={styles.redeemedText}>CLAIMED</Text>
                        </View>
                    ) : (
                        canAfford ? (
                            <TouchableOpacity style={styles.claimButton} onPress={() => handleRedeem(item)}>
                                <Unlock size={20} color={CyberpunkTheme.background} />
                                <Text style={styles.claimText}>CLAIM</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.lockedBadge}>
                                <Lock size={20} color={CyberpunkTheme.textDim} />
                            </View>
                        )
                    )}

                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                        <Trash2 size={20} color={CyberpunkTheme.error} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>YAKUZA STASH</Text>
                <View style={styles.stashCard}>
                    <Text style={styles.stashLabel}>AVAILABLE CREDITS</Text>
                    <Text style={styles.stashValue}>C {spendable}</Text>
                    <Text style={styles.totalLabel}>Total Earned: C {creditsEarned}</Text>
                </View>
            </View>

            <FlatList
                data={bounties}
                renderItem={renderBounty}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor={CyberpunkTheme.primary} />}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No active bounties. Add a target.</Text>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Plus size={32} color={CyberpunkTheme.background} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>NEW CONTRACT</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Target Name (e.g. Cyberware)"
                            placeholderTextColor={CyberpunkTheme.textDim}
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Cost (C)"
                            placeholderTextColor={CyberpunkTheme.textDim}
                            value={newCost}
                            onChangeText={setNewCost}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleAddBounty}>
                                <Text style={[styles.buttonText, { color: CyberpunkTheme.background }]}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        borderBottomWidth: 1,
        borderBottomColor: CyberpunkTheme.primary,
    },
    headerText: {
        fontFamily: 'Courier',
        color: CyberpunkTheme.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 2,
    },
    stashCard: {
        alignItems: 'center',
    },
    stashLabel: {
        color: CyberpunkTheme.textDim,
        fontSize: 12,
        letterSpacing: 1,
    },
    stashValue: {
        color: CyberpunkTheme.accent, // Lime green for money
        fontSize: 48,
        fontFamily: 'Courier',
        fontWeight: 'bold',
        textShadowColor: CyberpunkTheme.accent,
        textShadowRadius: 10,
    },
    totalLabel: {
        color: CyberpunkTheme.textDim,
        fontSize: 12,
        marginTop: 5,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    bountyCard: {
        backgroundColor: CyberpunkTheme.panel,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: CyberpunkTheme.border,
    },
    bountyCardRedeemed: {
        borderColor: CyberpunkTheme.textDim,
        opacity: 0.7,
    },
    bountyInfo: {
        flex: 1,
    },
    bountyTitle: {
        color: CyberpunkTheme.text,
        fontSize: 16,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    bountyCost: {
        color: CyberpunkTheme.secondary,
        fontSize: 14,
        marginTop: 5,
    },
    textDim: {
        color: CyberpunkTheme.textDim,
        textDecorationLine: 'line-through',
    },
    bountyActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    claimButton: {
        backgroundColor: CyberpunkTheme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 10,
    },
    claimText: {
        color: CyberpunkTheme.background,
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 12,
    },
    redeemedBadge: {
        backgroundColor: 'rgba(0, 255, 157, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: CyberpunkTheme.accent,
    },
    redeemedText: {
        color: CyberpunkTheme.accent,
        fontSize: 10,
        fontWeight: 'bold',
    },
    lockedBadge: {
        padding: 8,
        marginRight: 10,
    },
    deleteButton: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: CyberpunkTheme.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: CyberpunkTheme.primary,
        shadowRadius: 10,
        shadowOpacity: 0.5,
        elevation: 10,
    },
    emptyText: {
        color: CyberpunkTheme.textDim,
        textAlign: 'center',
        marginTop: 50,
        fontFamily: 'Courier',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(5,5,17,0.9)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: CyberpunkTheme.panel,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CyberpunkTheme.primary,
    },
    modalTitle: {
        color: CyberpunkTheme.primary,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: CyberpunkTheme.background,
        color: CyberpunkTheme.text,
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: CyberpunkTheme.border,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderColor: CyberpunkTheme.error,
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        backgroundColor: CyberpunkTheme.primary,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: CyberpunkTheme.text,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    }
});

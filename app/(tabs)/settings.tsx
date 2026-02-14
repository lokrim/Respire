import { Save, Settings as SettingsIcon, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { CyberpunkTheme } from '@/src/constants/Colors';
import { Storage, UserSettings } from '@/src/utils/storage';

export default function SettingsScreen() {
    const [cigsPerDay, setCigsPerDay] = useState('');
    const [costPerPack, setCostPerPack] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const settings = await Storage.getSettings();
        if (settings) {
            setCigsPerDay(settings.cigsPerDay.toString());
            setCostPerPack(settings.costPerPack.toString());
        }
    };

    const handleSave = async () => {
        const cigs = parseFloat(cigsPerDay);
        const cost = parseFloat(costPerPack);

        if (isNaN(cigs) || isNaN(cost)) {
            Alert.alert("Error", "Please enter valid numeric values.");
            return;
        }

        const settings: UserSettings = {
            cigsPerDay: cigs,
            costPerPack: cost,
        };

        await Storage.saveSettings(settings);
        Alert.alert("Success", "Configuration updated.");
    };

    const handleFactoryReset = () => {
        Alert.alert(
            "FACTORY RESET",
            "This will wipe ALL data, including logs, bounties, and settings. This cannot be undone.",
            [
                { text: "CANCEL", style: "cancel" },
                {
                    text: "WIPE DATA",
                    style: "destructive",
                    onPress: async () => {
                        await Storage.clearQuitDate();
                        await Storage.saveBounties([]);
                        // We could clear logs too if we added a method for it
                        Alert.alert("System Reset", "All data has been purged.");
                        loadSettings(); // Reload default settings if any
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <SettingsIcon size={32} color={CyberpunkTheme.primary} style={{ marginBottom: 10 }} />
                <Text style={styles.headerText}>SYSTEM CONFIG</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>FINANCIAL PARAMETERS</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>CIGARETTES PER DAY (AVG)</Text>
                    <TextInput
                        style={styles.input}
                        value={cigsPerDay}
                        onChangeText={setCigsPerDay}
                        keyboardType="numeric"
                        placeholder="10"
                        placeholderTextColor={CyberpunkTheme.textDim}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>COST PER PACK ($)</Text>
                    <TextInput
                        style={styles.input}
                        value={costPerPack}
                        onChangeText={setCostPerPack}
                        keyboardType="numeric"
                        placeholder="15.00"
                        placeholderTextColor={CyberpunkTheme.textDim}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Save size={20} color={CyberpunkTheme.background} />
                    <Text style={styles.saveText}>SAVE CONFIGURATION</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { borderTopColor: CyberpunkTheme.error }]}>
                <Text style={[styles.sectionTitle, { color: CyberpunkTheme.error }]}>DANGER ZONE</Text>

                <TouchableOpacity style={styles.resetButton} onPress={handleFactoryReset}>
                    <Trash2 size={20} color={CyberpunkTheme.error} />
                    <Text style={styles.resetText}>FACTORY RESET</Text>
                </TouchableOpacity>
                <Text style={styles.dangerText}>Irreversible action. Proceed with caution.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CyberpunkTheme.background,
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerText: {
        fontFamily: 'Courier',
        fontSize: 24,
        color: CyberpunkTheme.primary,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: CyberpunkTheme.panel,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: CyberpunkTheme.primary,
        marginBottom: 30,
    },
    sectionTitle: {
        color: CyberpunkTheme.text,
        fontSize: 16,
        fontFamily: 'Courier',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: CyberpunkTheme.textDim,
        fontSize: 12,
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: CyberpunkTheme.background,
        color: CyberpunkTheme.text,
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: CyberpunkTheme.border,
        fontSize: 16,
        fontFamily: 'Courier',
    },
    saveButton: {
        backgroundColor: CyberpunkTheme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    saveText: {
        color: CyberpunkTheme.background,
        fontWeight: 'bold',
        marginLeft: 10,
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
    resetButton: {
        borderColor: CyberpunkTheme.error,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 56, 96, 0.1)',
        marginBottom: 10,
    },
    resetText: {
        color: CyberpunkTheme.error,
        fontWeight: 'bold',
        marginLeft: 10,
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
    dangerText: {
        color: CyberpunkTheme.textDim,
        fontSize: 10,
        textAlign: 'center',
    }
});

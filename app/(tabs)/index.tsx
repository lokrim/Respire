import { useFocusEffect } from 'expo-router';
import { Activity, AlertTriangle, CircleDollarSign, Clock, Power } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ImageBackground, Modal, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import CyberLung from '@/src/components/CyberLung';
import PanicModal from '@/src/components/PanicModal';
import { Text } from '@/src/components/Themed';
import { CyberpunkTheme } from '@/src/constants/Colors';
import Layout from '@/src/constants/Layout';
import { Storage, UserSettings } from '@/src/utils/storage';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Layout.window;

/**
 * Main Dashboard Screen
 * Displays sobriety timer, CyberLung visualizer, stats, and quick actions.
 */
export default function DashboardScreen() {
  const [quitDate, setQuitDate] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [creditsEarned, setCreditsEarned] = useState<number>(0);
  const [cigsAvoided, setCigsAvoided] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  // Settings
  const [settings, setSettings] = useState<UserSettings>({ cigsPerDay: 10, creditsPerCig: 1.0 });

  // Onboarding Modal
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [inputDays, setInputDays] = useState('');
  const [inputHours, setInputHours] = useState('');

  // Panic Modal
  const [showPanicModal, setShowPanicModal] = useState(false);

  const loadData = useCallback(async () => {
    const date = await Storage.getQuitDate();
    setQuitDate(date);

    const loadedSettings = await Storage.getSettings();
    if (loadedSettings) {
      setSettings(loadedSettings);
    }
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
      // Credit calculation based on credits per cig
      setCreditsEarned(Math.floor(days * settings.cigsPerDay * settings.creditsPerCig));
      setCigsAvoided(Math.floor(days * settings.cigsPerDay));
    }, 1000);

    return () => clearInterval(interval);
  }, [quitDate, settings.cigsPerDay, settings.creditsPerCig]);

  const handleStartQuit = () => {
    setShowOnboarding(true);
    setInputDays('0');
    setInputHours('0');
  };

  const confirmStartQuit = async () => {
    const days = parseInt(inputDays) || 0;
    const hours = parseInt(inputHours) || 0;

    const now = Date.now();
    const offset = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000);
    const timestamp = now - offset;

    await Storage.saveQuitDate(timestamp);
    setQuitDate(timestamp);
    setShowOnboarding(false);
  };

  const handleRelapse = async () => {
    Alert.alert(
      "CRITICAL WARNING",
      "This action initiates a full system reset. All progress will be lost.\n\nAre you absolutely certain?",
      [
        { text: "ABORT", style: "cancel" },
        {
          text: "CONFIRM RESET",
          style: "destructive",
          onPress: async () => {
            await Storage.clearQuitDate();
            setQuitDate(null);
            setTimeElapsed(0);
            setCreditsEarned(0);
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
    <ImageBackground
      source={require('../../assets/images/bg-dark.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CyberpunkTheme.primary} />}
      >
        <View style={styles.container}>
          {/* Header Status */}
          <View style={styles.header}>
            <Text style={styles.headerText}>STATUS: {quitDate ? 'ONLINE' : 'OFFLINE'}</Text>
            {quitDate && <Activity size={16} color={CyberpunkTheme.primary} />}
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
                <View style={{ transform: [{ scale: 0.85 }] }}>
                  <CyberLung daysSober={daysSober} />
                </View>

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
                <CircleDollarSign size={20} color={CyberpunkTheme.secondary} />
                <Text style={styles.statValue}>C {creditsEarned}</Text>
                <Text style={styles.statLabel}>CREDITS EARNED</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={20} color={CyberpunkTheme.accent} />
                <Text style={styles.statValue}>{cigsAvoided}</Text>
                <Text style={styles.statLabel}>TOXINS AVOIDED</Text>
              </View>
            </View>
          )}

          {/* Panic Button - Compact */}
          <TouchableOpacity style={styles.panicButton} onPress={() => setShowPanicModal(true)}>
            <AlertTriangle size={24} color={CyberpunkTheme.background} />
            <Text style={styles.panicButtonText}>PANIC BUTTON</Text>
          </TouchableOpacity>

          {/* Panic / Reset */}
          {quitDate && (
            <TouchableOpacity style={styles.resetButton} onLongPress={handleRelapse} delayLongPress={2000}>
              <AlertTriangle size={16} color={CyberpunkTheme.error} style={{ marginBottom: 4 }} />
              <Text style={styles.resetText}>HOLD TO REPORT RELAPSE</Text>
            </TouchableOpacity>
          )}

          {/* Onboarding Modal */}
          <Modal visible={showOnboarding} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>INITIALIZE PROTOCOL</Text>
                <Text style={styles.modalSubtitle}>How long have you been sober?</Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>DAYS</Text>
                    <TextInput
                      style={styles.input}
                      value={inputDays}
                      onChangeText={setInputDays}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={CyberpunkTheme.textDim}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>HOURS</Text>
                    <TextInput
                      style={styles.input}
                      value={inputHours}
                      onChangeText={setInputHours}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={CyberpunkTheme.textDim}
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowOnboarding(false)}>
                    <Text style={styles.modalButtonText}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmStartQuit}>
                    <Text style={[styles.modalButtonText, { color: CyberpunkTheme.background }]}>ENGAGE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <PanicModal visible={showPanicModal} onClose={() => setShowPanicModal(false)} />

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: Layout.spacing.md,
    paddingTop: SCREEN_HEIGHT * 0.05,
    height: SCREEN_HEIGHT * 0.80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: CyberpunkTheme.primary,
    paddingBottom: 8,
  },
  headerText: {
    fontFamily: 'Courier',
    color: CyberpunkTheme.primary,
    letterSpacing: 2,
    fontSize: 12,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.05,
    flex: 1,
  },
  startButton: {
    backgroundColor: CyberpunkTheme.primary,
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_WIDTH * 0.45,
    borderRadius: (SCREEN_WIDTH * 0.45) / 2,
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
    marginTop: -20,
  },
  timeUnit: {
    alignItems: 'center',
    width: 50,
  },
  timeValue: {
    fontSize: 28,
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
    fontSize: 28,
    color: CyberpunkTheme.textDim,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SCREEN_HEIGHT * 0.07,
  },
  statCard: {
    backgroundColor: 'rgba(5, 30, 17, 0.7)',
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CyberpunkTheme.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CyberpunkTheme.text,
    marginVertical: 4,
    fontFamily: 'Courier',
  },
  statLabel: {
    fontSize: 10,
    color: CyberpunkTheme.textDim,
    letterSpacing: 1,
  },
  panicButton: {
    backgroundColor: CyberpunkTheme.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: SCREEN_HEIGHT * 0.035,
    shadowColor: CyberpunkTheme.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  panicButtonText: {
    color: CyberpunkTheme.background,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Courier',
    letterSpacing: 2,
  },
  resetButton: {
    marginTop: 0,
    marginBottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: CyberpunkTheme.error,
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 56, 96, 0.1)',
  },
  resetText: {
    color: CyberpunkTheme.error,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 30, 17, 0.9)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: CyberpunkTheme.panel,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CyberpunkTheme.primary,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CyberpunkTheme.primary,
    marginBottom: 10,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  modalSubtitle: {
    color: CyberpunkTheme.text,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  inputGroup: {
    width: '45%',
  },
  inputLabel: {
    color: CyberpunkTheme.textDim,
    fontSize: 10,
    marginBottom: 5,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: CyberpunkTheme.background,
    color: CyberpunkTheme.text,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CyberpunkTheme.border,
    textAlign: 'center',
    fontFamily: 'Courier',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CyberpunkTheme.error,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonConfirm: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: CyberpunkTheme.primary,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: CyberpunkTheme.text,
    fontWeight: 'bold',
    fontFamily: 'Courier',
  }
});

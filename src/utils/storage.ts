import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    QUIT_DATE: '@respire_quit_date',
    MONEY_SAVED: '@respire_money_saved',
    CIGS_PER_DAY: '@respire_cigs_per_day',
    CREDITS_PER_CIG: '@respire_credits_per_cig', // Renamed
    LOGS: '@respire_logs',
    BOUNTIES: '@respire_bounties',
};

export interface LogEntry {
    id: string;
    timestamp: number;
    trigger: string;
    type: 'panic' | 'relapse';
}

export interface Bounty {
    id: string;
    title: string;
    cost: number;
    redeemed: boolean;
    dateAdded: number;
}

export interface UserSettings {
    cigsPerDay: number;
    creditsPerCig: number; // Renamed
}

export const Storage = {
    async saveQuitDate(date: number) {
        try {
            await AsyncStorage.setItem(KEYS.QUIT_DATE, date.toString());
        } catch (e) {
            console.error('Failed to save quit date', e);
        }
    },

    async getQuitDate(): Promise<number | null> {
        try {
            const value = await AsyncStorage.getItem(KEYS.QUIT_DATE);
            return value ? parseInt(value, 10) : null;
        } catch (e) {
            console.error('Failed to fetch quit date', e);
            return null;
        }
    },

    async clearQuitDate() {
        try {
            await AsyncStorage.removeItem(KEYS.QUIT_DATE);
        } catch (e) {
            console.error('Failed to clear quit date', e);
        }
    },

    async saveSettings(settings: UserSettings) {
        try {
            await AsyncStorage.multiSet([
                [KEYS.CIGS_PER_DAY, settings.cigsPerDay.toString()],
                [KEYS.CREDITS_PER_CIG, settings.creditsPerCig.toString()],
            ]);
        } catch (e) {
            console.error('Failed to save settings', e);
        }
    },

    async getSettings(): Promise<UserSettings | null> {
        try {
            const values = await AsyncStorage.multiGet([KEYS.CIGS_PER_DAY, KEYS.CREDITS_PER_CIG]);
            const cigsPerDay = values[0][1] ? parseFloat(values[0][1]) : 10; // Default 10
            const creditsPerCig = values[1][1] ? parseFloat(values[1][1]) : 1.0; // Default 1.0

            return {
                cigsPerDay,
                creditsPerCig
            };
        } catch (e) {
            console.error('Failed to get settings', e);
            return null;
        }
    },

    async addLog(log: LogEntry) {
        try {
            const existingLogs = await this.getLogs();
            const newLogs = [log, ...existingLogs];
            await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify(newLogs));
        } catch (e) {
            console.error('Failed to save log', e);
        }
    },

    async getLogs(): Promise<LogEntry[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(KEYS.LOGS);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to fetch logs', e);
            return [];
        }
    },

    async saveBounties(bounties: Bounty[]) {
        try {
            await AsyncStorage.setItem(KEYS.BOUNTIES, JSON.stringify(bounties));
        } catch (e) {
            console.error('Failed to save bounties', e);
        }
    },

    async getBounties(): Promise<Bounty[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(KEYS.BOUNTIES);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to fetch bounties', e);
            return [];
        }
    },

    async addBounty(bounty: Bounty) {
        try {
            const bounties = await this.getBounties();
            const newBounties = [...bounties, bounty];
            await this.saveBounties(newBounties);
        } catch (e) {
            console.error('Failed to add bounty', e);
        }
    }
};

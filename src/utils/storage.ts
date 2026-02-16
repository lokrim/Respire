import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    QUIT_DATE: '@respire_quit_date',
    MONEY_SAVED: '@respire_money_saved',
    CIGS_PER_DAY: '@respire_cigs_per_day',
    CREDITS_PER_CIG: '@respire_credits_per_cig',
    LOGS: '@respire_logs',
    BOUNTIES: '@respire_bounties',
};

/**
 * Log entry for panic button presses or relapses.
 */
export interface LogEntry {
    id: string;
    timestamp: number;
    trigger: string;
    type: 'panic' | 'relapse';
}

/**
 * User-defined rewards.
 */
export interface Bounty {
    id: string;
    title: string;
    cost: number;
    redeemed: boolean;
    dateAdded: number;
}

/**
 * Application settings and calibration data.
 */
export interface UserSettings {
    cigsPerDay: number;
    creditsPerCig: number;
}

/**
 * Persistence layer handling all AsyncStorage operations.
 */
export const Storage = {
    /**
     * Saves the timestamp when the user started their quit journey.
     * @param date Timestamp in milliseconds
     */
    async saveQuitDate(date: number) {
        try {
            await AsyncStorage.setItem(KEYS.QUIT_DATE, date.toString());
        } catch (e) {
            console.error('Failed to save quit date', e);
        }
    },

    /**
     * Retrieves the quit date timestamp.
     * @returns Timestamp in milliseconds or null if not set.
     */
    async getQuitDate(): Promise<number | null> {
        try {
            const value = await AsyncStorage.getItem(KEYS.QUIT_DATE);
            return value ? parseInt(value, 10) : null;
        } catch (e) {
            console.error('Failed to fetch quit date', e);
            return null;
        }
    },

    /**
     * Clears the quit date, effectively resetting progress.
     */
    async clearQuitDate() {
        try {
            await AsyncStorage.removeItem(KEYS.QUIT_DATE);
        } catch (e) {
            console.error('Failed to clear quit date', e);
        }
    },

    /**
     * Saves user configuration.
     * @param settings UserSettings object
     */
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

    /**
     * Retrieves user configuration.
     * @returns UserSettings object with defaults if not found.
     */
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

    /**
     * Adds a new log entry.
     * @param log LogEntry object
     */
    async addLog(log: LogEntry) {
        try {
            const existingLogs = await this.getLogs();
            const newLogs = [log, ...existingLogs];
            await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify(newLogs));
        } catch (e) {
            console.error('Failed to save log', e);
        }
    },

    /**
     * Retrieves all system logs.
     * @returns Array of LogEntry
     */
    async getLogs(): Promise<LogEntry[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(KEYS.LOGS);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to fetch logs', e);
            return [];
        }
    },

    /**
     * Overwrites the bounties list.
     * @param bounties Array of Bounty objects
     */
    async saveBounties(bounties: Bounty[]) {
        try {
            await AsyncStorage.setItem(KEYS.BOUNTIES, JSON.stringify(bounties));
        } catch (e) {
            console.error('Failed to save bounties', e);
        }
    },

    /**
     * Retrieves all user bounties.
     * @returns Array of Bounty objects
     */
    async getBounties(): Promise<Bounty[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(KEYS.BOUNTIES);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to fetch bounties', e);
            return [];
        }
    },

    /**
     * Adds a new bounty reward.
     * @param bounty Bounty object
     */
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

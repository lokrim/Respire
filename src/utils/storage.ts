import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    QUIT_DATE: '@respire_quit_date',
    MONEY_SAVED: '@respire_money_saved',
    CIGS_PER_DAY: '@respire_cigs_per_day',
    COST_PER_PACK: '@respire_cost_per_pack',
    LOGS: '@respire_logs',
};

export interface LogEntry {
    id: string;
    timestamp: number;
    trigger: string;
    type: 'panic' | 'relapse';
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

    async saveFinancials(cigsPerDay: number, costPerPack: number) {
        try {
            await AsyncStorage.multiSet([
                [KEYS.CIGS_PER_DAY, cigsPerDay.toString()],
                [KEYS.COST_PER_PACK, costPerPack.toString()],
            ]);
        } catch (e) {
            console.error('Failed to save financials', e);
        }
    },

    async getFinancials() {
        try {
            const values = await AsyncStorage.multiGet([KEYS.CIGS_PER_DAY, KEYS.COST_PER_PACK]);
            return {
                cigsPerDay: values[0][1] ? parseFloat(values[0][1]) : null,
                costPerPack: values[1][1] ? parseFloat(values[1][1]) : null,
            };
        } catch (e) {
            console.error('Failed to get financials', e);
            return { cigsPerDay: null, costPerPack: null };
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
    }
};

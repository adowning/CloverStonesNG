export class MockUser {
    public id: number = 1;
    public username: string = "user1";
    public balance: number = 1000.00;
    public count_balance: number = 1000.00;
    public shop_id: number = 1;
    public session: string = ""; // Serialized session data
    public address: number = 0;
    public is_blocked: boolean = false;
    public status: string = "active";
    public last_bid: string = "";
    public remember_token: string | null = null;

    public save(): void {
        // In-memory, so changes persist in the instance
    }

    public increment(field: string, amount: number): void {
        if (field === 'balance') {
            this.balance += amount;
        }
        // Add other fields if necessary
    }

    public update(data: any): void {
        Object.assign(this, data);
    }

    public update_level(type: string, amount: number): void {
        // Stub
    }

    public updateCountBalance(sum: number, count_balance: number): number {
        // Stub implementation based on context: simply update the balance
        return count_balance + sum;
    }
}

export class MockShop {
    public id: number = 1;
    public percent: number = 90; // Default RTP
    public currency: string = "USD";
    public is_blocked: boolean = false;
    public max_win: number = 10000;
}

export class MockGame {
    public id: number = 1;
    public name: string = "CloverStonesNG";
    public view: number = 1;
    public shop_id: number = 1;
    public denomination: number = 1.0; // Default denomination
    public bet: string = "1,2,3,4,5,10,15,20,30,40,50,100,200,400"; // From AuthResponse
    public stat_in: number = 0;
    public stat_out: number = 0;
    public bids: number = 0;
    public rezerv: number = 0; // WinGamble
    public advanced: string = ""; // Serialized JSON
    public slotViewState: string = "Normal";

    // Internal bank values for simulation
    private bank_slots: number = 10000;
    private bank_bonus: number = 10000;
    private bank_fish: number = 0;
    private bank_table: number = 0;
    private bank_little: number = 0;


    public save(): void {
        // Stub
    }

    public refresh(): void {
        // Stub
    }

    public increment(field: string, amount: number = 1): void {
        if (field === 'stat_in') this.stat_in += amount;
        if (field === 'stat_out') this.stat_out += amount;
        if (field === 'bids') this.bids += amount;
    }

    public tournament_stat(slotState: string, userId: number, bet: number, win: number): void {
        // Stub
    }

    public get_lines_percent_config(type: string = 'spin'): any {
        // Stub returning a structure expected by SlotSettings
        // Based on SlotSettings.php logic: $linesPercentConfigSpin['line' . $curField . $pref]
        // We need to return an object where keys like 'line10', 'line10_bonus' exist.
        // And their values are objects where keys are RTP ranges (e.g., '90_100') and values are win chances.

        const config: any = {};
        const lines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const prefixes = ['', '_bonus'];

        for (const line of lines) {
            for (const pref of prefixes) {
                const key = `line${line}${pref}`;
                // Default config: 0-100 RTP -> some chance
                // Returning a mock structure that will select 'default' level
                config[key] = {
                    '0_200': 30 // Example chance
                };
            }
        }
        return config;
    }

    // Mocking get_gamebank based on SlotSettings usage
    // $game->get_gamebank($slotState)
    // $game->get_gamebank('', 'slots')
    public get_gamebank(slotState: string = '', bankType: string = ''): number {
        if (bankType === 'slots') return this.bank_slots;
        if (bankType === 'bonus') return this.bank_bonus;
        if (bankType === 'fish') return this.bank_fish;
        if (bankType === 'table_bank') return this.bank_table;
        if (bankType === 'little') return this.bank_little;

        // General getter based on slotState
        if (slotState === 'bonus' || slotState === 'freespin') return this.bank_bonus;
        return this.bank_slots;
    }

    public set_gamebank(sum: number, action: string, slotState: string): void {
        if (slotState === 'bonus' || slotState === 'freespin') {
            this.bank_bonus += sum; // 'inc' assumed
        } else {
            this.bank_slots += sum;
        }
    }
}

export class MockJPG {
    public id: number;
    public balance: number;
    public percent: number = 0.1;
    public shop_id: number = 1;
    public user_id: number | null = null;
    public start_balance: number = 100;
    public pay_sum: number = 0;

    constructor(id: number, balance: number) {
        this.id = id;
        this.balance = balance;
    }

    public get_pay_sum(): number {
        return this.pay_sum;
    }

    public get_min(field: string): number {
        return 0; // Stub
    }

    public get_start_balance(): number {
        return this.start_balance;
    }

    public add_jpg(action: string, sum: number): void {
        this.balance += sum;
    }

    public save(): void {
        // Stub
    }
}

// Log classes
export class GameLog {
    public static create(data: any): void {
        // console.log("GameLog:", JSON.stringify(data));
    }
}

export class StatGame {
    public static create(data: any): void {
        // console.log("StatGame:", JSON.stringify(data));
    }
}

export class MockDatabase {
    public static user = new MockUser();
    public static game = new MockGame();
    public static shop = new MockShop();
    public static jpgs = [
        new MockJPG(1, 1000),
        new MockJPG(2, 2000),
        new MockJPG(3, 5000)
    ];

    public static findUser(id: number): MockUser {
        return this.user;
    }

    public static findGame(id: string): MockGame {
        return this.game;
    }

    public static findShop(id: number): MockShop {
        return this.shop;
    }

    public static getJPGs(shopId: number): MockJPG[] {
        return this.jpgs;
    }
}

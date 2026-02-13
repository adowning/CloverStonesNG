export interface RequestData {
    action?: string;
    gameData?: {
        cmd: string;
        data?: any;
    };
    data?: any;
    slotEvent?: string;
    [key: string]: any;
}

export interface SpinRequestData {
    coin: number;
    bet: number;
    index?: number; // For PickBonusItemRequest
}

export interface User {
    id: number;
    balance: number; // Stored as float
    count_balance: number;
    session: string; // Serialized JSON string
    shop_id: number;
    address?: number;
    username?: string;
    remember_token?: string | null;
    is_blocked: boolean;
    status: string;
}

export interface Game {
    id: number;
    name: string;
    view: number; // 0 or 1
    shop_id: number;
    denomination: number;
    bet: string; // "1,2,3..."
    gamebank: number;
    stat_in: number;
    stat_out: number;
    bids: number;
    rezerv: number; // WinGamble
    advanced: string; // Serialized JSON string
    slotViewState?: string;
}

export interface Shop {
    id: number;
    percent: number;
    currency: string;
    is_blocked: boolean;
    max_win: number;
}

export interface JPG {
    id: number;
    balance: number;
    percent: number;
    shop_id: number;
    user_id?: number | null;
    start_balance: number;
    pay_sum: number; // Derived or stored? PHP uses get_pay_sum()
}

export interface GameBank {
    shop_id: number;
    slots: number;
    bonus: number;
    fish: number;
    table_bank: number;
    little: number;
}

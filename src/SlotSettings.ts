import { MockDatabase, MockUser, MockGame, MockShop, MockJPG } from './MockDatabase';
import { GameReel } from './GameReel';

function phpRand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

export class SlotSettings {
    public playerId: number;
    public splitScreen: boolean | null = null;
    public reelStrip1: string[] = [];
    public reelStrip2: string[] = [];
    public reelStrip3: string[] = [];
    public reelStrip4: string[] = [];
    public reelStrip5: string[] = [];
    public reelStrip6: string[] = [];
    public reelStripBonus1: string[] = [];
    public reelStripBonus2: string[] = [];
    public reelStripBonus3: string[] = [];
    public reelStripBonus4: string[] = [];
    public reelStripBonus5: string[] = [];
    public reelStripBonus6: string[] = [];
    public slotId: string = '';
    public slotDBId: number = 0;
    public Line: number[] = [];
    public scaleMode: number = 0;
    public numFloat: number = 0;
    public gameLine: number[] = [];
    public Bet: string[] = [];
    public isBonusStart: boolean = false;
    public Balance: number = 0;
    public SymbolGame: any[] = [];
    public GambleType: number = 1;
    public lastEvent: any = null;
    public Jackpots: any = {};
    public keyController: any = null;
    public slotViewState: string = '';
    public hideButtons: any = [];
    public slotReelsConfig: any = null;
    public slotFreeCount: number = 15;
    public slotFreeMpl: number = 2;
    public slotWildMpl: number = 1;
    public slotExitUrl: string = '/';
    public slotBonus: boolean = true;
    public slotBonusType: number = 1;
    public slotScatterType: number = 0;
    public slotGamble: boolean = true;
    public Paytable: { [key: string]: number[] } = {};
    public slotSounds: any = [];
    private jpgs: MockJPG[] = [];
    private Bank: number = 0;
    private Percent: number = 0;
    private WinLine: any = null;
    private WinGamble: number = 0;
    private shop_id: number = 0;
    public currency: string = '';
    public user: MockUser;
    public game: MockGame;
    public shop: MockShop;
    public jpgPercentZero: boolean = false;
    public count_balance: number = 0;

    // Properties added dynamically in PHP via SetGameData / SetGameDataStatic
    public gameData: { [key: string]: { timelife: number, payload: any } } = {};
    public gameDataStatic: { [key: string]: { timelife: number, payload: any } } = {};

    // Additional properties that might be needed based on usage
    public MaxWin: number = 0;
    public increaseRTP: number = 1;
    public CurrentDenom: number = 1;
    public AllBet: number = 0;
    public slotCurrency: string = ''; // Alias for currency?
    public betProfit: number = 0;
    public toGameBanks: number = 0;
    public toSlotJackBanks: number = 0;
    public toSysJackBanks: number = 0;
    public betRemains: number = 0;
    public betRemains0: number = 0;
    public slotFastStop: number = 1;

    constructor(sid: string, playerId: number, context: any = null) {
        this.slotId = sid;
        this.playerId = playerId;

        this.user = MockDatabase.findUser(this.playerId);
        this.shop_id = this.user.shop_id;

        // Mock gamebank is part of Game in our mock
        this.game = MockDatabase.findGame(this.slotId);
        this.shop = MockDatabase.findShop(this.shop_id);

        this.MaxWin = this.shop.max_win;
        this.increaseRTP = 1;
        this.CurrentDenom = this.game.denomination;
        this.scaleMode = 0;
        this.numFloat = 0;

        // Paytable
        this.Paytable['SYM_0'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_1'] = [0, 0, 0, 16, 32, 80];
        this.Paytable['SYM_2'] = [0, 0, 0, 16, 24, 48];
        this.Paytable['SYM_3'] = [0, 0, 0, 16, 24, 48];
        this.Paytable['SYM_4'] = [0, 0, 0, 8, 16, 32];
        this.Paytable['SYM_5'] = [0, 0, 0, 8, 16, 32];
        this.Paytable['SYM_6'] = [0, 0, 0, 4, 8, 16];
        this.Paytable['SYM_7'] = [0, 0, 0, 4, 8, 16];
        this.Paytable['SYM_8'] = [0, 0, 0, 4, 8, 16];
        this.Paytable['SYM_9'] = [0, 0, 0, 4, 8, 16];
        this.Paytable['SYM_10'] = [0, 0, 0, 4, 8, 16];

        const reel = new GameReel();
        const reelStrips = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'];
        for (const strip of reelStrips) {
            if (reel.reelsStrip[strip] && reel.reelsStrip[strip].length > 0) {
                (this as any)[strip] = reel.reelsStrip[strip];
            }
        }
        // Also load bonus strips if they exist in GameReel but not explicitly iterated in PHP constructor
        // PHP: foreach(['reelStrip1'...'reelStrip6'])
        // It seems PHP only loaded basic strips in the constructor loop shown.
        // But GetReelStrips uses reelStripBonus1... so they must be on the instance.
        // Wait, PHP code provided shows:
        /*
        foreach( [
            'reelStrip1',
            ...
            'reelStrip6'
        ] as $reelStrip )
        {
            if( count($reel->reelsStrip[$reelStrip]) )
            {
                $this->$reelStrip = $reel->reelsStrip[$reelStrip];
            }
        }
        */
        // It doesn't load bonus strips here?
        // Ah, in GetReelStrips('freespin'), it does:
        // $fArr = $reel->reelsStripBonus;
        // ...
        // $this->$reelStrip = $curReel;
        // So they are loaded dynamically during free spins.

        this.keyController = {
            '13': 'uiButtonSpin,uiButtonSkip',
            '49': 'uiButtonInfo',
            '50': 'uiButtonCollect',
            '51': 'uiButtonExit2',
            '52': 'uiButtonLinesMinus',
            '53': 'uiButtonLinesPlus',
            '54': 'uiButtonBetMinus',
            '55': 'uiButtonBetPlus',
            '56': 'uiButtonGamble',
            '57': 'uiButtonRed',
            '48': 'uiButtonBlack',
            '189': 'uiButtonAuto',
            '187': 'uiButtonSpin'
        };

        this.slotReelsConfig = [
            [425, 142, 3],
            [669, 142, 3],
            [913, 142, 3],
            [1157, 142, 3],
            [1401, 142, 3]
        ];

        this.slotBonusType = 1;
        this.slotScatterType = 0;
        this.splitScreen = false;
        this.slotBonus = true;
        this.slotGamble = true;
        this.slotFastStop = 1;
        this.slotExitUrl = '/';
        this.slotWildMpl = 1;
        this.GambleType = 1;
        this.slotFreeCount = 15;
        this.slotFreeMpl = 2;
        this.slotViewState = (this.game.slotViewState === '' ? 'Normal' : this.game.slotViewState);
        this.hideButtons = [];

        this.jpgs = MockDatabase.getJPGs(this.shop_id);

        this.Line = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.gameLine = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.Bet = this.game.bet.split(',');
        this.Balance = this.user.balance;
        this.SymbolGame = ['0', '1', 2, 3, 4, 5, 6, 7, 8, 9];

        this.Bank = this.game.get_gamebank();
        this.Percent = this.shop.percent;
        this.WinGamble = this.game.rezerv;
        this.slotDBId = this.game.id;
        this.slotCurrency = this.shop.currency;
        this.count_balance = this.user.count_balance;

        if( this.user.address > 0 && this.user.count_balance == 0 )
        {
            this.Percent = 0;
            this.jpgPercentZero = true;
        }
        else if( this.user.count_balance == 0 )
        {
            this.Percent = 100;
        }

        if( !this.user.session || this.user.session.length <= 0 )
        {
            this.user.session = JSON.stringify({});
        }

        try {
            this.gameData = JSON.parse(this.user.session);
        } catch(e) {
            this.gameData = {};
        }

        if( Object.keys(this.gameData).length > 0 )
        {
            for( const key in this.gameData )
            {
                if( this.gameData[key].timelife <= Math.floor(Date.now() / 1000) )
                {
                    delete this.gameData[key];
                }
            }
        }

        if( !this.game.advanced || this.game.advanced.length <= 0 )
        {
            this.game.advanced = JSON.stringify({});
        }

        try {
            this.gameDataStatic = JSON.parse(this.game.advanced);
        } catch(e) {
            this.gameDataStatic = {};
        }

        if( Object.keys(this.gameDataStatic).length > 0 )
        {
            for( const key in this.gameDataStatic )
            {
                if( this.gameDataStatic[key].timelife <= Math.floor(Date.now() / 1000) )
                {
                    delete this.gameDataStatic[key];
                }
            }
        }
    }

    public is_active(): boolean {
        // Simplified check
        return true;
    }

    public SetGameData(key: string, value: any): void {
        const timeLife = 86400;
        this.gameData[key] = {
            'timelife': Math.floor(Date.now() / 1000) + timeLife,
            'payload': value
        };
    }

    public GetGameData(key: string): any {
        if( this.gameData[key] )
        {
            return this.gameData[key]['payload'];
        }
        else
        {
            return 0;
        }
    }

    public FormatFloat(num: number): string {
        const str0 = num.toString().split('.');
        if( str0[1] )
        {
            if( str0[1].length > 4 )
            {
                return (Math.round(num * 100) / 100).toFixed(2);
            }
            else if( str0[1].length > 2 )
            {
                return (Math.floor(num * 100) / 100).toFixed(2);
            }
            else
            {
                return num.toFixed(2);
            }
        }
        else
        {
            return num.toFixed(2);
        }
    }

    public SaveGameData(): void {
        this.user.session = JSON.stringify(this.gameData);
        this.user.save();
    }

    public CheckBonusWin(): number {
        let allRateCnt = 0;
        let allRate = 0;
        for( const key in this.Paytable )
        {
            const vl = this.Paytable[key];
            for( const vl2 of vl )
            {
                if( vl2 > 0 )
                {
                    allRateCnt++;
                    allRate += vl2;
                    break;
                }
            }
        }
        if (allRateCnt === 0) return 0;
        return allRate / allRateCnt;
    }

    public OffsetReels(reels: any): any {
        const newReels: any = {};
        newReels['reel1'] = [];
        newReels['reel2'] = [];
        newReels['reel3'] = [];
        newReels['reel4'] = [];
        newReels['reel5'] = [];
        for( let r = 1; r <= 5; r++ )
        {
            for( let p = 3; p >= 0; p-- )
            {
                if( reels['reel' + r][p] !== -1 )
                {
                    newReels['reel' + r].unshift(reels['reel' + r][p]);
                }
            }
        }
        for( let r = 1; r <= 5; r++ )
        {
            for( let p = newReels['reel' + r].length + 1; p <= 4; p++ )
            {
                newReels['reel' + r].unshift(phpRand(0, 10).toString());
            }
        }
        return newReels;
    }

    public GetRandomPay(): number {
        // Not used in SpinResponse loop, but good to have
        return 0;
    }

    public HasGameDataStatic(key: string): boolean {
        return !!this.gameDataStatic[key];
    }

    public SaveGameDataStatic(): void {
        this.game.advanced = JSON.stringify(this.gameDataStatic);
        this.game.save();
        this.game.refresh();
    }

    public SetGameDataStatic(key: string, value: any): void {
        const timeLife = 86400;
        this.gameDataStatic[key] = {
            'timelife': Math.floor(Date.now() / 1000) + timeLife,
            'payload': value
        };
    }

    public GetGameDataStatic(key: string): any {
        if( this.gameDataStatic[key] )
        {
            return this.gameDataStatic[key]['payload'];
        }
        else
        {
            return 0;
        }
    }

    public HasGameData(key: string): boolean {
        return !!this.gameData[key];
    }

    public GetHistory(): any {
        // Stub: always return NULL or mock
        return 'NULL';
    }

    public UpdateJackpots(bet: number): void {
        bet = bet * this.CurrentDenom;
        const count_balance = this.count_balance;
        const jsum: number[] = [];
        let payJack = 0;

        for( let i = 0; i < this.jpgs.length; i++ )
        {
            if( count_balance == 0 || this.jpgPercentZero )
            {
                jsum[i] = this.jpgs[i].balance;
            }
            else if( count_balance < bet )
            {
                jsum[i] = count_balance / 100 * this.jpgs[i].percent + this.jpgs[i].balance;
            }
            else
            {
                jsum[i] = bet / 100 * this.jpgs[i].percent + this.jpgs[i].balance;
            }

            if( this.jpgs[i].get_pay_sum() < jsum[i] && this.jpgs[i].get_pay_sum() > 0 )
            {
                // Jackpot payout logic omitted for brevity, assuming no jackpot win for now
            }

            this.jpgs[i].balance = jsum[i];
            this.jpgs[i].save();
        }

        // if( payJack > 0 ) ...
    }

    public GetBank(slotState: string = ''): number {
        if( this.isBonusStart || slotState == 'bonus' || slotState == 'freespin' || slotState == 'respin' )
        {
            slotState = 'bonus';
        }
        else
        {
            slotState = '';
        }
        this.Bank = this.game.get_gamebank(slotState);
        return this.Bank / this.CurrentDenom;
    }

    public GetPercent(): number {
        return this.Percent;
    }

    public InternalErrorSilent(errcode: any): void {
        console.error("InternalErrorSilent", errcode);
    }

    public InternalError(errcode: any): void {
        console.error("InternalError", errcode);
        process.exit(1);
    }

    public SetBank(slotState: string = '', sum: number, slotEvent: string = ''): any {
         if( this.isBonusStart || slotState == 'bonus' || slotState == 'freespin' || slotState == 'respin' )
        {
            slotState = 'bonus';
        }
        else
        {
            slotState = '';
        }

        // PHP: if( $this->GetBank($slotState) + $sum < 0 ) ...

        sum = sum * this.CurrentDenom;
        let bankBonusSum = 0;

        if( sum > 0 && slotEvent == 'bet' ) {
            this.toGameBanks = 0;
            this.toSlotJackBanks = 0;
            this.toSysJackBanks = 0;
            this.betProfit = 0;

            let prc = this.GetPercent();
            let prc_b = 10;
            if( prc <= prc_b ) prc_b = 0;

            const count_balance = this.count_balance;
            const gameBet = sum / this.GetPercent() * 100;

            if( count_balance < gameBet && count_balance > 0 ) {
                 // split bid logic
                 const firstBid = count_balance;
                 const secondBid = gameBet - firstBid;
                 const bankSum = firstBid / 100 * this.GetPercent();
                 sum = bankSum + secondBid;
                 bankBonusSum = firstBid / 100 * prc_b;
            } else if (count_balance > 0) {
                 bankBonusSum = gameBet / 100 * prc_b;
            }

            // Jackpots logic stub
            // ...

            this.toGameBanks = sum;
            this.betProfit = gameBet - this.toGameBanks - this.toSlotJackBanks - this.toSysJackBanks;
        }

        if( sum > 0 ) this.toGameBanks = sum;

        if( bankBonusSum > 0 ) {
            sum -= bankBonusSum;
            this.game.set_gamebank(bankBonusSum, 'inc', 'bonus');
        }

        this.game.set_gamebank(sum, 'inc', slotState);
        this.game.save();
        return this.game;
    }

    public SetBalance(sum: number, slotEvent: string = ''): any {
        if( this.GetBalance() + sum < 0 ) {
            // this.InternalError('Balance_   ' + sum);
            // We'll allow negative for simplicity or just log
        }
        sum = sum * this.CurrentDenom;

        // Balance update logic matching PHP ...
        // Simplification:
        this.user.increment('balance', sum);
        this.user.balance = parseFloat(this.FormatFloat(this.user.balance));
        this.user.save();
        return this.user;
    }

    public GetBalance(): number {
        this.Balance = this.user.balance / this.CurrentDenom;
        return this.Balance;
    }

    public SaveLogReport(spinSymbols: string, bet: number, lines: number, win: number, slotState: string): void {
        // Stub
    }

    public GetSpinSettings(garantType: string = 'bet', bet: number, lines: number): any[] {
        let curField = 10;
        switch( lines ) {
            case 10: curField = 10; break;
            case 9: case 8: curField = 9; break;
            case 7: case 6: curField = 7; break;
            case 5: case 4: curField = 5; break;
            case 3: case 2: curField = 3; break;
            case 1: curField = 1; break;
            default: curField = 10; break;
        }

        let pref = '';
        if( garantType != 'bet' ) pref = '_bonus';

        this.AllBet = bet * lines;

        const linesPercentConfigSpin = this.game.get_lines_percent_config('spin');
        const linesPercentConfigBonus = this.game.get_lines_percent_config('bonus');
        const currentPercent = this.shop.percent;

        let currentSpinWinChance = 0;
        let currentBonusWinChance = 0;
        let percentLevel = '';

        // Logic to find percentLevel
        const configMap = linesPercentConfigSpin['line' + curField + pref];
        if (configMap) {
             for( const k in configMap ) {
                const l = k.split('_');
                const l0 = parseInt(l[0]);
                const l1 = parseInt(l[1]);
                if( l0 <= currentPercent && currentPercent <= l1 ) {
                    percentLevel = k;
                    break;
                }
            }
        }

        if (percentLevel !== '' && configMap) {
             currentSpinWinChance = configMap[percentLevel];
             // Assuming similar structure for bonus
             if (linesPercentConfigBonus['line' + curField + pref]) {
                 currentBonusWinChance = linesPercentConfigBonus['line' + curField + pref][percentLevel];
             }
        } else {
            // Fallback defaults if config not found
            currentSpinWinChance = 50;
            currentBonusWinChance = 5000;
        }

        // RTP Control Logic
        const RtpControlCount = 200;
        if( !this.HasGameDataStatic('SpinWinLimit') ) this.SetGameDataStatic('SpinWinLimit', 0);
        if( !this.HasGameDataStatic('RtpControlCount') ) this.SetGameDataStatic('RtpControlCount', RtpControlCount);

        // ... skipping detailed RTP control logic for now, using randoms directly

        const bonusWin = phpRand(1, currentBonusWinChance);
        const spinWin = phpRand(1, currentSpinWinChance);

        let ret = ['none', 0];

        if( bonusWin == 1 && this.slotBonus ) {
            this.isBonusStart = true;
            garantType = 'bonus';
            const winLimit = this.GetBank(garantType);
            ret = ['bonus', winLimit];
             // Check logic
        } else if( spinWin == 1 ) {
            const winLimit = this.GetBank(garantType);
            ret = ['win', winLimit];
        }

        // Force win for testing if needed? No, let randomness handle it.
        // Actually, for the task, we want a successful Spin Response.
        // If random is too hard, we might want to tweak it.
        // But let's stick to the port.

        return ret;
    }

    public GetRandomScatterPos(rp: string[]): number {
        const rpResult: number[] = [];
        for( let i = 0; i < rp.length; i++ ) {
            if( rp[i] == '9' ) { // Scatter symbol ID?
                 if( rp[i+1] && rp[i-1] ) rpResult.push(i);
                 // ... logic checks neighbors
            }
        }
        shuffle(rpResult);
        if( rpResult.length === 0 ) {
            return phpRand(2, rp.length - 3);
        }
        return rpResult[0];
    }

    public GetReelStrips(winType: string, slotEvent: string): any {
        const game = this.game;

        if( slotEvent == 'freespin' )
        {
            const reel = new GameReel();
            const fArr = [
                reel.reelsStripBonus['reelStripBonus1'],
                reel.reelsStripBonus['reelStripBonus2'],
                reel.reelsStripBonus['reelStripBonus3'],
                reel.reelsStripBonus['reelStripBonus4'],
                reel.reelsStripBonus['reelStripBonus5'],
                reel.reelsStripBonus['reelStripBonus6']
            ];

            const strips = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'];

            for(const reelStrip of strips) {
                const curReel = fArr.shift();
                if (curReel && curReel.length) {
                    (this as any)[reelStrip] = curReel;
                }
            }
        }

        const prs: { [key: number]: number } = {};
        const strips = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'];

        if( winType != 'bonus' ) {
            for( let i = 0; i < strips.length; i++ ) {
                const stripName = strips[i];
                const stripData = (this as any)[stripName];
                if( stripData && stripData.length > 0 ) {
                    prs[i + 1] = phpRand(1, stripData.length - 4);
                }
            }
        } else {
             // Bonus logic
             // ...
             // Simplified: just do random
            for( let i = 0; i < strips.length; i++ ) {
                const stripName = strips[i];
                const stripData = (this as any)[stripName];
                if( stripData && stripData.length > 0 ) {
                    prs[i + 1] = phpRand(1, stripData.length - 4);
                }
            }
        }

        const reel: any = { 'rp': [] };

        for( const index in prs ) {
            const idx = parseInt(index);
            const value = prs[idx];
            const stripName = 'reelStrip' + index;
            const key = [...(this as any)[stripName]]; // Copy array

            // PHP: $key[-1] = $key[count($key) - 1];
            // In TS/JS we can't do -1 index easily, but logic accesses:
            // $key[$value - 1] -> if value=1, index=0. If value=0 (not possible via rand(1, ...)), index=-1.
            // Wait, rand(1, length - 4). So min value is 1. value-1 is 0.
            // So we don't need the -1 index hack unless logic does value-1 where value could be 0.

            reel['reel' + index] = [];
            reel['reel' + index][0] = key[value - 1];
            reel['reel' + index][1] = key[value];
            reel['reel' + index][2] = key[value + 1];
            reel['reel' + index][3] = key[value + 2];
            reel['rp'].push(value);
        }

        return reel;
    }
}

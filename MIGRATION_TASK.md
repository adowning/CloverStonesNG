# TASK: One-Shot PHP to TS Migration

**Objective**
Convert `SlotSettings.php`, `Server.php`, and `GameReel.php` into a self-contained TypeScript project (Node.js).

**Input Files (Located in current repo)**
- `SlotSettings.php` (Logic & State)
- `Server.php` (API Handler)
- `GameReel.php` (Reel Strips Parser)
- `reels.txt` (Data)

**Output Requirements**
1. **`Server.ts`**: The main entry point. It must handle the 'SpinRequest' action exactly as the PHP script does.
2. **`SlotSettings.ts`**: Port the `SlotSettings` class.
    - **CRITICAL**: The `Paytable` arrays must match exactly.
    - **CRITICAL**: The `CheckBonusWin` logic must return the exact same float values.
3. **`GameReel.ts`**: Must read `reels.txt` using `fs.readFileSync`.
4. **`MockDatabase.ts`**: Create a class to replace `VanguardLTE` calls. Store `Balance`, `ShopID`, and `GameSettings` in memory.
5. **`index.ts`**: A runner script that initializes the Server and simulates a single "SpinRequest" to print the JSON output to console.

**Strict Logic Constraints**
- **Randomness**: Implement a helper `phpRand(min, max)` that behaves exactly like PHP's `rand`.
- **Serialization**: The PHP code uses `serialize/unserialize`. Replace this with `JSON.stringify/JSON.parse` for the in-memory session, but ensure the data structure remains compatible with the logic.
- **String Construction**: If the PHP code does `'{"response":"' . $val . '"}'`, you MUST do the same. Do not use objects and `JSON.stringify` if it changes the key order or spacing.

**Definition of Done**
I must be able to run `npx ts-node index.ts` and see the exact same JSON response string that the PHP server would output for a basic Spin.
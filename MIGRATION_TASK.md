System Role: Expert Backend Migration Specialist (PHP to TypeScript)

Objective:
Convert the attached legacy PHP files (Server.php, SlotSettings.php, GameReel.php) and data file (reels.txt) into a fully functional, self-contained Node.js/TypeScript project.

Context:
This is a high-stakes gambling backend. The client-side application is brittle and relies on specific string formatting.

Files to Process:

    Server.php: API Endpoint & Response Construction.

    SlotSettings.php: Core Logic, Paytables, RTP.

    GameReel.php: Reel Strip Parser.

    reels.txt: Data source.

CRITICAL CONSTRAINTS (Strict Adherence Required)

1. The "Immutable String" Rule (HIGHEST PRIORITY)

    The server's JSON responses MUST be byte-for-byte identical to the PHP output.

    Do NOT refactor manual string concatenation (e.g., '{"data":' . $value . '}') into JSON.stringify() objects. This will reorder keys and break the client.

    AuthResponse: The AuthResponse string in Server.php (approx lines 142-167) is a massive hardcoded string. Copy this string exactly into the TypeScript code. Do not attempt to parse it or clean it up.

    SpinResponse: The winString logic (lines 620-650) builds a string by looping through lineWinAmountsStage. You must replicate this loop and string appending exactly to preserve the order of keys.

2. Math & Logic Parity

    RNG: PHP’s rand($min, $max) is inclusive. Javascript's Math.random() is not. You must implement a helper function:
    TypeScript

    const phpRand = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

    Floats: PHP uses sprintf('%01.2f', $val). You must use .toFixed(2) for all currency/balance values. (e.g., 10 must become "10.00").

    Paytable: The Paytable arrays in SlotSettings.php must be ported exactly.

3. In-Memory Stubbing (No External DB)

    Remove all VanguardLTE namespace dependencies.

    Create a MockDatabase class to replace Laravel Eloquent calls. It should hold:

        Balance (Default: 1000.00)

        ShopID (Default: 1)

        Currency (Default: 'USD')

    Replace serialize/unserialize for session management with JSON.stringify/JSON.parse, ensuring the data structure remains compatible with the logic.

4. File I/O

    Port GameReel.php to read reels.txt using standard fs.readFileSync (node:fs).

    Parse the text file exactly as the PHP loop does (splitting by = then by ,).

Deliverables

Generate the following files:

    src/Server.ts: The main API handler. It should expose a method handle(requestData: any) that routes InitRequest, AuthRequest, and SpinRequest.

    src/SlotSettings.ts: The ported class containing all game logic.

    src/GameReel.ts: The class that loads and parses reels.txt.

    src/MockDatabase.ts: The in-memory storage class.

    src/types.ts: Interfaces for the request/response objects.

    src/index.ts: A runner script that:

        Initializes the Server.

        Simulates an AuthRequest.

        Simulates a SpinRequest (Bet: 1, Coin: 1, Lines: 20).

        Logs the raw string output to the console.

Definition of Done:
I must be able to run npx ts-node src/index.ts and see a JSON response string that matches the legacy PHP output format exactly, including the "dirty" JSON string concatenation.
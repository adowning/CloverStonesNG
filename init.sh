#!/bin/bash

# Initialize project
mkdir -p migration-output/src
cd migration-output

# Initialize package.json
npm init -y

# Install dependencies
npm install typescript ts-node @types/node --save-dev

# Initialize tsconfig.json
npx tsc --init --target es2020 --module commonjs --outDir ./dist --rootDir ./src --strict true --esModuleInterop true

# Create empty files (placeholders for Jules to fill)
touch src/index.ts src/Server.ts src/SlotSettings.ts src/GameReel.ts src/MockDatabase.ts src/types.ts

# Copy the data file if it exists in parent
if [ -f "../reels.txt" ]; then
    cp "../reels.txt" ./src/
    echo "Copied reels.txt to src/"
else
    echo "⚠️ Make sure to copy reels.txt to src/ manually!"
fi

echo "✅ Environment ready. When Jules finishes, merge the code into 'migration-output/src'."
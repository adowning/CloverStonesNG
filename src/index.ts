import { Server } from './Server';

const server = new Server();

// Simulate AuthRequest
const authRequest = {
    action: 'AuthRequest',
    gameData: {
        cmd: 'AuthRequest',
        data: {}
    }
};

const authResponse = server.handle(authRequest);
// console.log('--- Auth Response ---');
// console.log(authResponse);

// Simulate SpinRequest
// Bet: 1, Coin: 1, Lines: 20 (Hardcoded in server)
const spinRequest = {
    action: 'SpinRequest',
    gameData: {
        cmd: 'SpinRequest',
        data: {
            coin: 1,
            bet: 1
        }
    }
};

const spinResponse = server.handle(spinRequest);
// console.log('--- Spin Response ---');
console.log(spinResponse);

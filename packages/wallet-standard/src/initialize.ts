import { registerWallet } from './register.js';
import { BackpackWallet } from './wallet.js';
import type { Backpack } from './window.js';

export function initialize(Backpack: Backpack): void {
    registerWallet(new BackpackWallet(Backpack));
}

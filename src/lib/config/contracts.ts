import { type Address } from 'viem';
import { karmaNftAbi } from '../contracts/karmaNftAbi';
import { stakingManagerAbi } from '../contracts/stakingManagerAbi';
import { vaultFactoryAbi } from '../contracts/vaultFactoryAbi';
import { vaultAbi } from '../contracts/vaultAbi';
import { tokenAbi } from '../contracts/tokenAbi';

// Token information for Status Network Testnet
export const SNT_TOKEN = {
    address: '0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a' as Address,
    name: 'Status Test Token',
    symbol: 'STT',
    decimals: 18,
    abi: tokenAbi
} as const;

// Contract addresses for Status Network Testnet
export const STAKING_MANAGER = {
    address: '0x2C09141e66970A71862beAcCbDb816ec01D6B676' as Address,
    abi: stakingManagerAbi
} as const;

export const VAULT_FACTORY = {
    address: '0xA6300Bd8aF26530D399a1b24B703EEf2c48a71Be' as Address,
    abi: vaultFactoryAbi
} as const;

export const KARMA = {
    address: '0x486Ac0F5Eb7079075dE26739E1192D41F278a8db' as Address,
    abi: tokenAbi // Using the same token ABI since it's an ERC20 token
} as const;

export const KARMA_NFT = {
    address: '0xdE5592e1001f52380f9EDE01aa6725F469A8e46F' as Address,
    abi: karmaNftAbi
} as const;

export const VAULT = {
    abi: vaultAbi
} as const; 
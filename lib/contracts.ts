import type { Address } from 'viem';
import tokenAbi from '@/abi/token.json';
import tokenMarketAbi from '@/abi/token-market.json';

export const tokenAbiTyped = tokenAbi as readonly unknown[];
export const tokenMarketAbiTyped = tokenMarketAbi as readonly unknown[];

/** Sepolia 上部署的 Token 合约地址，在 .env.local 中设置 NEXT_PUBLIC_TOKEN_ADDRESS */
const envAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS?.trim();
export const TOKEN_ADDRESS: Address | undefined =
	envAddress && /^0x[a-fA-F0-9]{40}$/.test(envAddress)
		? (envAddress as Address)
		: undefined;

/** Token 市场合约地址（购买用），在 .env.local 中设置 NEXT_PUBLIC_TOKEN_MARKET_ADDRESS */
const envMarketAddress = process.env.NEXT_PUBLIC_TOKEN_MARKET_ADDRESS?.trim();
export const TOKEN_MARKET_ADDRESS: Address | undefined =
	envMarketAddress && /^0x[a-fA-F0-9]{40}$/.test(envMarketAddress)
		? (envMarketAddress as Address)
		: undefined;

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
	arbitrum,
	base,
	mainnet,
	optimism,
	polygon,
	sepolia,
} from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '';

/** 通过同源 API 代理转发 RPC，避免浏览器直连公共 RPC 时的 CORS 限制 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
const transports = {
	[mainnet.id]: http(`${appUrl}/api/rpc/mainnet`),
	[sepolia.id]: http(`${appUrl}/api/rpc/sepolia`),
	[polygon.id]: http(`${appUrl}/api/rpc/polygon`),
	[optimism.id]: http(`${appUrl}/api/rpc/optimism`),
	[arbitrum.id]: http(`${appUrl}/api/rpc/arbitrum`),
	[base.id]: http(`${appUrl}/api/rpc/base`),
};

export const config = getDefaultConfig({
	appName: 'Web3 DAPP',
	projectId: projectId || 'YOUR_PROJECT_ID',
	chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
	transports,
	ssr: true,
});

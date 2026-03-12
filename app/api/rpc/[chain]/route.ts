import { type NextRequest, NextResponse } from 'next/server';

/** Infura 各链子域名：https://<host>/v3/<projectId> */
const INFURA_CHAIN_HOST: Record<string, string> = {
	mainnet: 'mainnet.infura.io',
	sepolia: 'sepolia.infura.io',
	polygon: 'polygon-mainnet.infura.io',
	optimism: 'optimism-mainnet.infura.io',
	arbitrum: 'arbitrum-mainnet.infura.io',
	base: 'base-mainnet.infura.io',
};

const FALLBACK_RPC: Record<string, string> = {
	mainnet: 'https://eth.llamarpc.com',
	sepolia: 'https://rpc.sepolia.org',
	polygon: 'https://polygon-rpc.com',
	optimism: 'https://mainnet.optimism.io',
	arbitrum: 'https://arb1.arbitrum.io/rpc',
	base: 'https://mainnet.base.org',
};

function getRpcUrl(chain: string): string | null {
	const host = INFURA_CHAIN_HOST[chain];
	const fallback = FALLBACK_RPC[chain];
	if (!(host || fallback)) return null;

	const projectId =
		process.env.INFURA_PROJECT_ID ?? process.env.INFURA_API_KEY ?? '';
	if (projectId && host) {
		return `https://${host}/v3/${projectId}`;
	}
	return fallback ?? null;
}

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ chain: string }> },
) {
	const { chain } = await context.params;
	const url = getRpcUrl(chain);
	if (!url) {
		return NextResponse.json(
			{ error: `Unknown chain: ${chain}` },
			{ status: 400 },
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	const data = await res.text();
	return new NextResponse(data, {
		status: res.status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

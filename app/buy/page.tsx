'use client';

import { useConnection } from 'wagmi';
import { AppShell } from '@/components/app-shell';
import { BuyPageContent } from '@/components/buy-page-content';

export default function BuyPage() {
	const { address, status } = useConnection();
	const isConnected = status === 'connected' && address;

	if (!isConnected) {
		return (
			<AppShell>
				<main className='flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16 md:px-8'>
					<p className='text-center text-[#94A3B8]'>
						请先连接钱包后再购买 Token。
					</p>
				</main>
			</AppShell>
		);
	}

	return (
		<AppShell>
			<main className='flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 pb-16 md:px-8'>
				<BuyPageContent />
			</main>
		</AppShell>
	);
}

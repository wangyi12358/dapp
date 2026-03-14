'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Wallet } from 'lucide-react';
import { useConnection } from 'wagmi';
import { AdminPageContent } from '@/components/admin-page-content';
import { AppShell } from '@/components/app-shell';

export default function AdminPage() {
	const { address, status } = useConnection();
	const isConnected = status === 'connected' && address;

	return (
		<AppShell>
			<main className='relative min-h-screen px-4 pt-28 pb-16 md:px-8 md:pt-32'>
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(244,63,94,0.1),transparent)]' />
				{isConnected ? (
					<div className='relative'>
						<div className='mx-auto mb-8 max-w-5xl text-center'>
							<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F43F5E]/20'>
								<Shield aria-hidden className='h-7 w-7 text-[#F43F5E]' />
							</div>
							<h1 className='font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
								管理员面板
							</h1>
							<p className='mt-2 text-[#94A3B8]'>市场合约管理和资金操作</p>
						</div>
						<div className='mx-auto max-w-5xl'>
							<AdminPageContent />
						</div>
					</div>
				) : (
					<div className='relative flex min-h-[60vh] flex-col items-center justify-center'>
						<div className='mx-auto max-w-md text-center'>
							<div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5'>
								<Wallet aria-hidden className='h-8 w-8 text-[#A78BFA]' />
							</div>
							<h1 className='mb-2 font-heading font-semibold text-[#E2E8F0] text-xl'>
								连接钱包
							</h1>
							<p className='mb-6 text-[#94A3B8]'>
								请先连接钱包后使用管理员功能。
							</p>
							<div className='flex justify-center'>
								<ConnectButton />
							</div>
						</div>
					</div>
				)}
			</main>
		</AppShell>
	);
}

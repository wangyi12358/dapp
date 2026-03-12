'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const nav = [
	{ href: '/', label: '首页' },
	{ href: '/buy', label: '购买' },
	{ href: '/transfer', label: '转账' },
	{ href: '/admin', label: '管理员' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className='min-h-screen bg-[#0F0F23] text-[#E2E8F0]'>
			<header className='fixed top-4 right-4 left-4 z-50 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0F0F23]/90 px-4 py-3 backdrop-blur-xl md:right-8 md:left-8 md:px-6'>
				<div className='flex items-center gap-6'>
					<Link
						className='cursor-pointer font-heading font-semibold text-[#E2E8F0] text-lg tracking-tight transition-colors hover:text-[#A78BFA] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]'
						href='/'
					>
						Web3 DAPP
					</Link>
					<nav className='flex gap-3 text-sm'>
						{nav.map(({ href, label }) => (
							<Link
								className={cn(
									'cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-white/10 hover:text-[#E2E8F0] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]',
									pathname === href
										? 'bg-white/10 text-[#A78BFA]'
										: 'text-[#94A3B8]',
								)}
								href={href}
								key={href}
							>
								{label}
							</Link>
						))}
					</nav>
				</div>
				<ConnectButton />
			</header>
			{children}
		</div>
	);
}

'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const nav = [
	{ href: '/', label: '首页' },
	{ href: '/buy', label: '购买' },
	{ href: '/transfer', label: '转账' },
	{ href: '/admin', label: '管理员' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [pathname]);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Escape') setMobileMenuOpen(false);
	}, []);

	useEffect(() => {
		if (mobileMenuOpen) {
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}
	}, [mobileMenuOpen, handleKeyDown]);

	return (
		<div className='min-h-screen bg-[#0F0F23] text-[#E2E8F0]'>
			<header className='fixed top-4 right-4 left-4 z-50 md:right-8 md:left-8'>
				<div className='flex items-center justify-between rounded-2xl border border-white/10 bg-[#0F0F23]/90 px-3 py-3 backdrop-blur-xl sm:px-4 md:px-6'>
					<div className='flex min-w-0 items-center gap-4 sm:gap-6'>
						<Link
							className='shrink-0 cursor-pointer font-heading font-semibold text-[#E2E8F0] text-lg tracking-tight transition-colors hover:text-[#A78BFA] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]'
							href='/'
						>
							Web3 DAPP
						</Link>
						<nav className='hidden gap-3 text-sm sm:flex'>
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
					<div className='flex shrink-0 items-center gap-2'>
						<ConnectButton
							accountStatus={{
								smallScreen: 'avatar',
								largeScreen: 'full',
							}}
							chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
							showBalance={{ smallScreen: false, largeScreen: true }}
						/>
						<button
							aria-expanded={mobileMenuOpen}
							aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
							className='flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-[#E2E8F0] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23] sm:hidden'
							onClick={() => setMobileMenuOpen((prev) => !prev)}
							type='button'
						>
							{mobileMenuOpen ? (
								<X aria-hidden className='h-5 w-5' />
							) : (
								<Menu aria-hidden className='h-5 w-5' />
							)}
						</button>
					</div>
				</div>

				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.nav
							animate={{ opacity: 1, y: 0 }}
							className='mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#0F0F23]/95 p-2 backdrop-blur-xl sm:hidden'
							exit={{ opacity: 0, y: -8 }}
							initial={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.15, ease: 'easeOut' }}
						>
							{nav.map(({ href, label }) => (
								<Link
									className={cn(
										'flex min-h-[44px] cursor-pointer items-center rounded-xl px-4 text-sm transition-colors hover:bg-white/10 hover:text-[#E2E8F0] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]',
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
						</motion.nav>
					)}
				</AnimatePresence>
			</header>
			{children}
		</div>
	);
}

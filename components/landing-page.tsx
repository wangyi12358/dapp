'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowRight, Sparkles, Store, Users, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import { useConnection } from 'wagmi';
import { cn } from '@/lib/utils';

const FEATURED_DAPPS = [
	{
		name: 'MikaToken',
		desc: 'Buy, redeem & transfer',
		href: '/buy',
		glow: '#7C3AED',
	},
	{
		name: 'Transfer',
		desc: 'Send tokens to any address',
		href: '/transfer',
		glow: '#A78BFA',
	},
	{
		name: 'Admin',
		desc: 'Market & treasury management',
		href: '/admin',
		glow: '#F43F5E',
	},
];

const CREATORS = [
	{ name: 'MikaToken', role: 'ERC20 + Market', tag: 'Sepolia' },
];

export function LandingPage() {
	const { address, status } = useConnection();
	const isConnected = status === 'connected' && address;

	return (
		<div className='min-h-screen bg-[#0F0F23] text-[#E2E8F0]'>
			{/* Hero */}
			<section className='relative overflow-hidden px-4 pt-32 pb-20 md:px-8 md:pt-40 md:pb-28'>
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.25),transparent)]' />
				<div className='relative mx-auto max-w-4xl text-center'>
					<p className='mb-3 font-heading text-[#A78BFA] text-sm uppercase tracking-[0.2em]'>
						Web3 DAPP Platform
					</p>
					<h1 className='mb-6 font-bold font-heading text-4xl tracking-tight md:text-6xl lg:text-7xl'>
						<span className='text-[#E2E8F0]'>Build on</span>
						<br />
						<span
							className='bg-clip-text text-transparent'
							style={{
								backgroundImage: 'linear-gradient(135deg, #7C3AED, #F43F5E)',
								textShadow: '0 0 40px rgba(124,58,237,0.5)',
							}}
						>
							Chain
						</span>
					</h1>
					<p className='mx-auto mb-10 max-w-xl text-[#94A3B8] text-lg leading-relaxed md:text-xl'>
						Token marketplace, transfers, and admin tools. Connect your wallet
						and start in seconds.
					</p>
					<div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
						<div className='flex min-h-[44px] min-w-[44px] items-center justify-center'>
							<ConnectButton />
						</div>
						<Link
							className={cn(
								'flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#F43F5E]/50 bg-[#F43F5E]/10 px-6 font-medium text-[#F43F5E] transition-all duration-200 hover:border-[#F43F5E] hover:bg-[#F43F5E]/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]',
							)}
							href='/buy'
						>
							Explore Marketplace
							<ArrowRight aria-hidden className='h-4 w-4' />
						</Link>
					</div>
				</div>
			</section>

			{/* Glassmorphism feature cards */}
			<section className='px-4 pb-20 md:px-8'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='mb-8 text-center font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
						Why This DAPP
					</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{[
							{
								icon: Zap,
								title: 'Instant Swaps',
								desc: 'Buy token with ETH or redeem to ETH on Sepolia.',
								borderColor: 'rgba(124,58,237,0.4)',
							},
							{
								icon: Wallet,
								title: 'One-Click Connect',
								desc: 'MetaMask, WalletConnect, Coinbase and more.',
								borderColor: 'rgba(167,139,250,0.4)',
							},
							{
								icon: Store,
								title: 'Marketplace',
								desc: 'Transparent pricing and admin controls.',
								borderColor: 'rgba(244,63,94,0.4)',
							},
						].map(({ icon: Icon, title, desc, borderColor }) => (
							<div
								className={cn(
									'cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-200 focus-within:ring-2 focus-within:ring-[#7C3AED] focus-within:ring-offset-2 focus-within:ring-offset-[#0F0F23] hover:bg-white/10',
								)}
								key={title}
							>
								<div
									className='mb-3 inline-flex rounded-lg p-2'
									style={{ backgroundColor: `${borderColor}` }}
								>
									<Icon aria-hidden className='h-6 w-6 text-[#E2E8F0]' />
								</div>
								<h3 className='mb-2 font-heading font-semibold text-[#E2E8F0] text-lg'>
									{title}
								</h3>
								<p className='text-[#94A3B8] text-sm leading-relaxed'>{desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured DAPP gallery */}
			<section className='px-4 pb-20 md:px-8'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='mb-2 text-center font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
						Featured DAPPs
					</h2>
					<p className='mb-8 text-center text-[#94A3B8]'>
						Explore token buy, transfer and admin tools
					</p>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{FEATURED_DAPPS.map((dapp) => (
							<Link
								className={cn(
									'group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]',
								)}
								href={dapp.href}
								key={dapp.name}
							>
								<div
									className='absolute -top-12 -right-12 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30'
									style={{ backgroundColor: dapp.glow }}
								/>
								<Sparkles aria-hidden className='mb-3 h-6 w-6 text-[#A78BFA]' />
								<h3 className='mb-1 font-heading font-semibold text-[#E2E8F0] text-lg'>
									{dapp.name}
								</h3>
								<p className='mb-4 text-[#94A3B8] text-sm'>{dapp.desc}</p>
								<span className='inline-flex items-center gap-1 font-medium text-[#7C3AED] text-sm'>
									Open
									<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
								</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Wallet connection demo */}
			<section className='px-4 pb-20 md:px-8'>
				<div className='mx-auto max-w-2xl'>
					<div className='rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10'>
						<div className='mb-4 flex items-center gap-3'>
							<div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/20'>
								<Wallet aria-hidden className='h-6 w-6 text-[#A78BFA]' />
							</div>
							<div>
								<h2 className='font-heading font-semibold text-[#E2E8F0] text-xl'>
									Connect Wallet
								</h2>
								<p className='text-[#94A3B8] text-sm'>
									{isConnected
										? 'You are connected'
										: 'Connect to use buy, transfer and admin'}
								</p>
							</div>
						</div>
						{isConnected ? (
							<div className='rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-3'>
								<p className='mb-2 text-[#94A3B8] text-sm'>Connected as</p>
								<p className='break-all font-mono text-[#E2E8F0] text-sm'>
									{address}
								</p>
								<div className='mt-3 flex flex-wrap gap-2'>
									<Link
										className='min-h-[44px] cursor-pointer rounded-lg border border-[#7C3AED]/50 bg-white/5 px-4 py-2 font-medium text-[#A78BFA] text-sm transition-colors hover:bg-white/10'
										href='/buy'
									>
										Buy / Redeem
									</Link>
									<Link
										className='min-h-[44px] cursor-pointer rounded-lg border border-[#7C3AED]/50 bg-white/5 px-4 py-2 font-medium text-[#A78BFA] text-sm transition-colors hover:bg-white/10'
										href='/transfer'
									>
										Transfer
									</Link>
								</div>
							</div>
						) : (
							<div className='flex min-h-[44px] items-center justify-start'>
								<ConnectButton />
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Creator spotlight */}
			<section className='px-4 pb-20 md:px-8'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='mb-2 text-center font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
						Creator Spotlight
					</h2>
					<p className='mb-8 text-center text-[#94A3B8]'>
						Projects powering this platform
					</p>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{CREATORS.map((creator) => (
							<div
								className='flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]'
								key={creator.name}
							>
								<div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/20'>
									<Users aria-hidden className='h-7 w-7 text-[#A78BFA]' />
								</div>
								<div className='min-w-0'>
									<h3 className='font-heading font-semibold text-[#E2E8F0]'>
										{creator.name}
									</h3>
									<p className='text-[#94A3B8] text-sm'>{creator.role}</p>
									<span className='mt-1 inline-block rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 px-2 py-0.5 text-[#A78BFA] text-xs'>
										{creator.tag}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Marketplace preview */}
			<section className='px-4 pb-24 md:px-8'>
				<div className='mx-auto max-w-6xl'>
					<div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'>
						<div className='border-white/10 border-b bg-white/5 px-6 py-4 md:px-8'>
							<h2 className='font-heading font-semibold text-[#E2E8F0] text-xl md:text-2xl'>
								Marketplace Preview
							</h2>
							<p className='mt-1 text-[#94A3B8] text-sm'>
								Buy token with ETH, redeem to ETH, or transfer to any address.
							</p>
						</div>
						<div className='grid gap-6 p-6 md:grid-cols-3 md:p-8'>
							<Link
								className='flex min-h-[44px] cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-8 transition-colors hover:border-[#7C3AED]/40 hover:bg-white/10'
								href='/buy'
							>
								<Store aria-hidden className='mb-2 h-8 w-8 text-[#A78BFA]' />
								<span className='font-medium text-[#E2E8F0]'>Buy / Redeem</span>
								<span className='text-[#94A3B8] text-xs'>ETH ⇄ Token</span>
							</Link>
							<Link
								className='flex min-h-[44px] cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-8 transition-colors hover:border-[#7C3AED]/40 hover:bg-white/10'
								href='/transfer'
							>
								<Zap aria-hidden className='mb-2 h-8 w-8 text-[#A78BFA]' />
								<span className='font-medium text-[#E2E8F0]'>Transfer</span>
								<span className='text-[#94A3B8] text-xs'>Send tokens</span>
							</Link>
							<Link
								className='flex min-h-[44px] cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-8 transition-colors hover:border-[#F43F5E]/40 hover:bg-white/10'
								href='/admin'
							>
								<Wallet aria-hidden className='mb-2 h-8 w-8 text-[#F43F5E]' />
								<span className='font-medium text-[#E2E8F0]'>Admin</span>
								<span className='text-[#94A3B8] text-xs'>Owner only</span>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

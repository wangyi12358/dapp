'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Store, Users, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import { useConnection } from 'wagmi';
import { cn } from '@/lib/utils';

const FEATURES = [
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
];

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

const MARKETPLACE_ACTIONS = [
	{
		icon: Store,
		label: 'Buy / Redeem',
		desc: 'ETH <-> Token',
		href: '/buy',
		accent: '#A78BFA',
	},
	{
		icon: Zap,
		label: 'Transfer',
		desc: 'Send tokens',
		href: '/transfer',
		accent: '#A78BFA',
	},
	{
		icon: Wallet,
		label: 'Admin',
		desc: 'Owner only',
		href: '/admin',
		accent: '#F43F5E',
	},
];

export function LandingPage() {
	const { address, status } = useConnection();
	const shouldReduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll();
	const progressScale = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 24,
		mass: 0.2,
	});
	const isConnected = status === 'connected' && address;
	const revealOffset = shouldReduceMotion ? 0 : 28;
	const sectionViewport = { once: true, amount: 0.2 };

	return (
		<div className='min-h-screen bg-[#0F0F23] text-[#E2E8F0]'>
			<motion.div
				aria-hidden
				className='pointer-events-none fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#F43F5E] shadow-[0_0_18px_rgba(167,139,250,0.65)]'
				style={{ scaleX: progressScale }}
			/>

			{/* Hero */}
			<section className='relative overflow-hidden px-4 pt-32 pb-20 md:px-8 md:pt-40 md:pb-28'>
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.25),transparent)]' />
				<motion.div
					animate={
						shouldReduceMotion
							? undefined
							: {
									y: [0, -18, 0],
									x: [0, 12, 0],
									scale: [1, 1.05, 1],
								}
					}
					aria-hidden
					className='pointer-events-none absolute top-24 left-[12%] h-36 w-36 rounded-full bg-[#7C3AED]/20 blur-3xl'
					transition={{
						duration: 10,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					animate={
						shouldReduceMotion
							? undefined
							: {
									y: [0, 20, 0],
									x: [0, -14, 0],
									scale: [1.02, 0.96, 1.02],
								}
					}
					aria-hidden
					className='pointer-events-none absolute top-20 right-[10%] h-44 w-44 rounded-full bg-[#F43F5E]/15 blur-3xl'
					transition={{
						duration: 12,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'easeInOut',
					}}
				/>
				<div className='relative mx-auto max-w-4xl text-center'>
					<motion.p
						animate={{ opacity: 1, y: 0 }}
						className='mb-3 font-heading text-[#A78BFA] text-sm uppercase tracking-[0.2em]'
						initial={{ opacity: 0, y: revealOffset }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.45,
							ease: 'easeOut',
						}}
					>
						Web3 DAPP Platform
					</motion.p>
					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className='mb-6 font-bold font-heading text-4xl tracking-tight md:text-6xl lg:text-7xl'
						initial={{ opacity: 0, y: revealOffset }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.6,
							delay: shouldReduceMotion ? 0 : 0.08,
							ease: 'easeOut',
						}}
					>
						<span className='text-[#E2E8F0]'>Build on</span>
						<br />
						<motion.span
							animate={
								shouldReduceMotion
									? undefined
									: {
											backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
										}
							}
							className='bg-clip-text text-transparent'
							style={{
								backgroundImage:
									'linear-gradient(135deg, #7C3AED, #A78BFA, #F43F5E)',
								backgroundSize: '200% 200%',
								textShadow: '0 0 40px rgba(124,58,237,0.5)',
							}}
							transition={{
								duration: 7,
								repeat: Number.POSITIVE_INFINITY,
								ease: 'easeInOut',
							}}
						>
							Chain
						</motion.span>
					</motion.h1>
					<motion.p
						animate={{ opacity: 1, y: 0 }}
						className='mx-auto mb-10 max-w-xl text-[#94A3B8] text-lg leading-relaxed md:text-xl'
						initial={{ opacity: 0, y: revealOffset }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.55,
							delay: shouldReduceMotion ? 0 : 0.16,
							ease: 'easeOut',
						}}
					>
						Token marketplace, transfers, and admin tools. Connect your wallet
						and start in seconds.
					</motion.p>
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'
						initial={{ opacity: 0, y: revealOffset }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.5,
							delay: shouldReduceMotion ? 0 : 0.24,
							ease: 'easeOut',
						}}
					>
						<motion.div
							className='flex min-h-[44px] min-w-[44px] items-center justify-center'
							whileHover={shouldReduceMotion ? undefined : { y: -2 }}
							whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
						>
							<ConnectButton />
						</motion.div>
						<motion.div
							whileHover={
								shouldReduceMotion ? undefined : { y: -3, scale: 1.01 }
							}
							whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
						>
							<Link
								className={cn(
									'flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#F43F5E]/50 bg-[#F43F5E]/10 px-6 font-medium text-[#F43F5E] transition-all duration-200 hover:border-[#F43F5E] hover:bg-[#F43F5E]/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#F43F5E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]',
								)}
								href='/buy'
							>
								Explore Marketplace
								<motion.span
									animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
									className='inline-flex'
									transition={{
										duration: 1.8,
										repeat: Number.POSITIVE_INFINITY,
										ease: 'easeInOut',
									}}
								>
									<ArrowRight aria-hidden className='h-4 w-4' />
								</motion.span>
							</Link>
						</motion.div>
					</motion.div>
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className='mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3'
						initial={{ opacity: 0, y: revealOffset }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.6,
							delay: shouldReduceMotion ? 0 : 0.3,
							ease: 'easeOut',
						}}
					>
						{[
							['Fast onboarding', 'Wallet to action in under a minute'],
							['Live flows', 'Buy, redeem, transfer without context switches'],
							['Admin ready', 'Owner tools stay close to the trading surface'],
						].map(([title, desc], index) => (
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								className='rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl'
								initial={{ opacity: 0, y: revealOffset }}
								key={title}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.45,
									delay: shouldReduceMotion ? 0 : 0.35 + index * 0.08,
									ease: 'easeOut',
								}}
								whileHover={
									shouldReduceMotion
										? undefined
										: { y: -4, borderColor: 'rgba(167,139,250,0.35)' }
								}
							>
								<p className='font-heading text-[#E2E8F0] text-sm uppercase tracking-[0.16em]'>
									{title}
								</p>
								<p className='mt-2 text-[#94A3B8] text-sm leading-relaxed'>
									{desc}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Glassmorphism feature cards */}
			<motion.section
				className='px-4 pb-20 md:px-8'
				initial={{ opacity: 0, y: revealOffset }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
				viewport={sectionViewport}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className='mx-auto max-w-6xl'>
					<h2 className='mb-8 text-center font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
						Why This DAPP
					</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{FEATURES.map(({ icon: Icon, title, desc, borderColor }, index) => (
							<motion.div
								className={cn(
									'cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-200 focus-within:ring-2 focus-within:ring-[#7C3AED] focus-within:ring-offset-2 focus-within:ring-offset-[#0F0F23] hover:bg-white/10',
								)}
								initial={{ opacity: 0, y: revealOffset }}
								key={title}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.45,
									delay: shouldReduceMotion ? 0 : index * 0.08,
									ease: 'easeOut',
								}}
								viewport={sectionViewport}
								whileHover={
									shouldReduceMotion
										? undefined
										: {
												y: -8,
												scale: 1.01,
												borderColor: 'rgba(255,255,255,0.18)',
											}
								}
								whileInView={{ opacity: 1, y: 0 }}
							>
								<motion.div
									className='mb-3 inline-flex rounded-lg p-2'
									style={{ backgroundColor: `${borderColor}` }}
									whileHover={
										shouldReduceMotion ? undefined : { rotate: -8, scale: 1.08 }
									}
								>
									<Icon aria-hidden className='h-6 w-6 text-[#E2E8F0]' />
								</motion.div>
								<h3 className='mb-2 font-heading font-semibold text-[#E2E8F0] text-lg'>
									{title}
								</h3>
								<p className='text-[#94A3B8] text-sm leading-relaxed'>{desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* Featured DAPP gallery */}
			<motion.section
				className='px-4 pb-20 md:px-8'
				initial={{ opacity: 0, y: revealOffset }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
				viewport={sectionViewport}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className='mx-auto max-w-6xl'>
					<h2 className='mb-2 text-center font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
						Featured DAPPs
					</h2>
					<p className='mb-8 text-center text-[#94A3B8]'>
						Explore token buy, transfer and admin tools
					</p>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{FEATURED_DAPPS.map((dapp, index) => (
							<motion.div
								className='h-full'
								initial={{ opacity: 0, y: revealOffset }}
								key={dapp.name}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.45,
									delay: shouldReduceMotion ? 0 : index * 0.08,
									ease: 'easeOut',
								}}
								viewport={sectionViewport}
								whileHover={shouldReduceMotion ? undefined : { y: -10 }}
								whileInView={{ opacity: 1, y: 0 }}
							>
								<Link
									className={cn(
										'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]',
									)}
									href={dapp.href}
								>
									<motion.div
										animate={
											shouldReduceMotion
												? undefined
												: { scale: [1, 1.16, 1], opacity: [0.18, 0.3, 0.18] }
										}
										className='absolute -top-12 -right-12 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30'
										style={{ backgroundColor: dapp.glow }}
										transition={{
											duration: 6,
											repeat: Number.POSITIVE_INFINITY,
											ease: 'easeInOut',
										}}
									/>
									<motion.div
										whileHover={
											shouldReduceMotion
												? undefined
												: { rotate: 12, scale: 1.08 }
										}
									>
										<Sparkles
											aria-hidden
											className='mb-3 h-6 w-6 text-[#A78BFA]'
										/>
									</motion.div>
									<h3 className='mb-1 font-heading font-semibold text-[#E2E8F0] text-lg'>
										{dapp.name}
									</h3>
									<p className='mb-4 flex-1 text-[#94A3B8] text-sm'>
										{dapp.desc}
									</p>
									<span className='inline-flex items-center gap-1 font-medium text-[#7C3AED] text-sm'>
										Open
										<motion.span
											animate={
												shouldReduceMotion ? undefined : { x: [0, 4, 0] }
											}
											className='inline-flex'
											transition={{
												duration: 1.8,
												repeat: Number.POSITIVE_INFINITY,
												ease: 'easeInOut',
												delay: index * 0.1,
											}}
										>
											<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
										</motion.span>
									</span>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* Wallet connection demo */}
			<motion.section
				className='px-4 pb-20 md:px-8'
				initial={{ opacity: 0, y: revealOffset }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
				viewport={sectionViewport}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className='mx-auto max-w-2xl'>
					<motion.div
						animate={
							shouldReduceMotion
								? undefined
								: {
										boxShadow: [
											'0 0 0 rgba(124,58,237,0)',
											'0 0 32px rgba(124,58,237,0.18)',
											'0 0 0 rgba(124,58,237,0)',
										],
									}
						}
						className='rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10'
						transition={{
							duration: 4.5,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'easeInOut',
						}}
					>
						<div className='mb-4 flex items-center gap-3'>
							<motion.div
								className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/20'
								whileHover={
									shouldReduceMotion ? undefined : { rotate: -8, scale: 1.05 }
								}
							>
								<Wallet aria-hidden className='h-6 w-6 text-[#A78BFA]' />
							</motion.div>
							<div>
								<h2 className='font-heading font-semibold text-[#E2E8F0] text-xl'>
									Connect Wallet
								</h2>
								<div className='mt-1 flex items-center gap-2'>
									<motion.span
										animate={
											shouldReduceMotion
												? undefined
												: { opacity: [0.5, 1, 0.5], scale: [0.9, 1.15, 0.9] }
										}
										className={cn(
											'h-2.5 w-2.5 rounded-full',
											isConnected ? 'bg-emerald-400' : 'bg-[#A78BFA]',
										)}
										transition={{
											duration: 1.8,
											repeat: Number.POSITIVE_INFINITY,
											ease: 'easeInOut',
										}}
									/>
									<p className='text-[#94A3B8] text-sm'>
										{isConnected
											? 'You are connected'
											: 'Connect to use buy, transfer and admin'}
									</p>
								</div>
							</div>
						</div>
						{isConnected ? (
							<motion.div
								className='rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-3'
								initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.3,
									ease: 'easeOut',
								}}
								viewport={sectionViewport}
								whileInView={{ opacity: 1, y: 0 }}
							>
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
							</motion.div>
						) : (
							<motion.div
								className='flex min-h-[44px] items-center justify-start'
								whileHover={shouldReduceMotion ? undefined : { y: -2 }}
							>
								<ConnectButton />
							</motion.div>
						)}
					</motion.div>
				</div>
			</motion.section>

			{/* Creator spotlight */}
			<motion.section
				className='px-4 pb-20 md:px-8'
				initial={{ opacity: 0, y: revealOffset }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
				viewport={sectionViewport}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className='mx-auto max-w-6xl'>
					<h2 className='mb-2 text-center font-heading font-semibold text-2xl text-[#E2E8F0] md:text-3xl'>
						Creator Spotlight
					</h2>
					<p className='mb-8 text-center text-[#94A3B8]'>
						Projects powering this platform
					</p>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{CREATORS.map((creator, index) => (
							<motion.div
								className='flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F23]'
								initial={{ opacity: 0, y: revealOffset }}
								key={creator.name}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.45,
									delay: shouldReduceMotion ? 0 : index * 0.08,
									ease: 'easeOut',
								}}
								viewport={sectionViewport}
								whileHover={
									shouldReduceMotion
										? undefined
										: { y: -6, borderColor: 'rgba(167,139,250,0.35)' }
								}
								whileInView={{ opacity: 1, y: 0 }}
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
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* Marketplace preview */}
			<motion.section
				className='px-4 pb-24 md:px-8'
				initial={{ opacity: 0, y: revealOffset }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
				viewport={sectionViewport}
				whileInView={{ opacity: 1, y: 0 }}
			>
				<div className='mx-auto max-w-6xl'>
					<motion.div
						className='overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'
						whileHover={shouldReduceMotion ? undefined : { y: -4 }}
					>
						<div className='border-white/10 border-b bg-white/5 px-6 py-4 md:px-8'>
							<h2 className='font-heading font-semibold text-[#E2E8F0] text-xl md:text-2xl'>
								Marketplace Preview
							</h2>
							<p className='mt-1 text-[#94A3B8] text-sm'>
								Buy token with ETH, redeem to ETH, or transfer to any address.
							</p>
						</div>
						<div className='grid gap-6 p-6 md:grid-cols-3 md:p-8'>
							{MARKETPLACE_ACTIONS.map(
								({ icon: Icon, label, desc, href, accent }, index) => (
									<motion.div
										initial={{ opacity: 0, y: revealOffset }}
										key={label}
										transition={{
											duration: shouldReduceMotion ? 0 : 0.45,
											delay: shouldReduceMotion ? 0 : index * 0.08,
											ease: 'easeOut',
										}}
										viewport={sectionViewport}
										whileHover={
											shouldReduceMotion ? undefined : { y: -8, scale: 1.01 }
										}
										whileInView={{ opacity: 1, y: 0 }}
									>
										<Link
											className='flex min-h-[44px] cursor-pointer flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-8 transition-colors hover:bg-white/10'
											href={href}
											style={{ borderColor: 'rgba(255,255,255,0.10)' }}
										>
											<motion.div
												animate={
													shouldReduceMotion ? undefined : { y: [0, -4, 0] }
												}
												transition={{
													duration: 2.4,
													repeat: Number.POSITIVE_INFINITY,
													ease: 'easeInOut',
													delay: index * 0.2,
												}}
											>
												<Icon
													aria-hidden
													className='mb-2 h-8 w-8'
													style={{ color: accent }}
												/>
											</motion.div>
											<span className='font-medium text-[#E2E8F0]'>
												{label}
											</span>
											<span className='text-[#94A3B8] text-xs'>{desc}</span>
										</Link>
									</motion.div>
								),
							)}
						</div>
					</motion.div>
				</div>
			</motion.section>
		</div>
	);
}

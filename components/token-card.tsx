'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { formatUnits } from 'viem';
import {
	useChainId,
	useConnection,
	useReadContract,
	useSwitchChain,
} from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import {
	TOKEN_ADDRESS,
	TOKEN_MARKET_ADDRESS,
	tokenAbiTyped,
} from '@/lib/contracts';

const SEPOLIA_ID = sepolia.id;

export function TokenCard() {
	const connection = useConnection();
	const address = connection.address;
	const chainId = useChainId();
	const { mutateAsync: switchChainAsync, isPending: isSwitchPending } =
		useSwitchChain();
	const [switchError, setSwitchError] = useState<string | null>(null);

	const { data: balance } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'balanceOf',
		args: address ? [address] : undefined,
	});

	const { data: name } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'name',
	});

	const { data: symbol } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'symbol',
	});

	const { data: decimals } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'decimals',
	});

	const { data: totalSupply } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'totalSupply',
	});

	const isWrongChain = chainId !== SEPOLIA_ID;
	const decimalsNum: number =
		typeof decimals === 'bigint'
			? Number(decimals)
			: typeof decimals === 'number'
				? decimals
				: 18;

	const formattedBalance =
		balance != null && typeof balance === 'bigint' && decimals != null
			? formatUnits(balance, decimalsNum)
			: '0';
	const formattedTotalSupply =
		totalSupply != null && typeof totalSupply === 'bigint' && decimals != null
			? formatUnits(totalSupply, decimalsNum)
			: '–';

	const switchToSepolia = useCallback(async () => {
		setSwitchError(null);
		try {
			await switchChainAsync?.({ chainId: SEPOLIA_ID });
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (
				message.includes('User rejected') ||
				message.includes('rejected the request')
			) {
				setSwitchError('已在钱包中取消切换');
			} else if (
				message.includes('already pending') ||
				message.includes('Please wait')
			) {
				setSwitchError('请先完成钱包中弹出的切换网络请求');
			} else {
				setSwitchError('切换失败，请重试');
			}
		}
	}, [switchChainAsync]);

	if (!TOKEN_ADDRESS) {
		return (
			<section className='w-full max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6'>
				<p className='text-amber-200 text-sm'>
					请在 <code className='rounded bg-black/20 px-1'>.env.local</code>{' '}
					中设置{' '}
					<code className='rounded bg-black/20 px-1'>
						NEXT_PUBLIC_TOKEN_ADDRESS
					</code>{' '}
					为你在 Sepolia 上部署的 Token 合约地址。
				</p>
			</section>
		);
	}

	if (isWrongChain) {
		return (
			<section className='w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6'>
				<p className='mb-4 text-[#94A3B8] text-sm'>
					Token 合约部署在 Sepolia 测试网，请切换到 Sepolia 后继续。
				</p>
				{switchError && (
					<p className='mb-3 text-amber-300 text-sm' role='alert'>
						{switchError}
					</p>
				)}
				<Button
					className='min-h-[44px] cursor-pointer bg-[#8B5CF6] text-white hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-60'
					disabled={isSwitchPending}
					onClick={switchToSepolia}
					type='button'
				>
					{isSwitchPending ? '切换中…' : '切换到 Sepolia'}
				</Button>
			</section>
		);
	}

	return (
		<section
			aria-labelledby='token-section-title'
			className='w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6'
		>
			<h2
				className='mb-4 font-heading font-semibold text-[#F8FAFC] text-xl'
				id='token-section-title'
			>
				{typeof name === 'string' ? name : 'Token'}
			</h2>

			<dl className='mb-6 grid gap-2 text-sm'>
				<div className='flex justify-between gap-4'>
					<dt className='text-[#94A3B8]'>符号</dt>
					<dd className='font-medium text-[#F8FAFC]'>
						{typeof symbol === 'string' ? symbol : '–'}
					</dd>
				</div>
				<div className='flex justify-between gap-4'>
					<dt className='text-[#94A3B8]'>总供应量</dt>
					<dd className='font-medium text-[#F8FAFC]'>{formattedTotalSupply}</dd>
				</div>
				<div className='flex justify-between gap-4'>
					<dt className='text-[#94A3B8]'>我的余额</dt>
					<dd className='font-medium text-[#FBBF24]'>
						{formattedBalance} {typeof symbol === 'string' ? symbol : ''}
					</dd>
				</div>
			</dl>

			<div className='flex flex-col gap-3 sm:flex-row'>
				{TOKEN_MARKET_ADDRESS && (
					<Button
						asChild
						className='min-h-[44px] flex-1 cursor-pointer bg-[#F59E0B] text-[#0F172A] transition-colors duration-200 hover:bg-[#FBBF24]'
					>
						<Link href='/buy'>购买</Link>
					</Button>
				)}
				<Button
					asChild
					className='min-h-[44px] flex-1 cursor-pointer border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10'
					variant='outline'
				>
					<Link href='/transfer'>转账</Link>
				</Button>
			</div>
		</section>
	);
}

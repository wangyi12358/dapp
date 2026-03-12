'use client';

import { useCallback, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConnection, useReadContract, useWriteContract } from 'wagmi';
import { ChainGuard } from '@/components/chain-guard';
import { Button } from '@/components/ui/button';
import {
	TOKEN_ADDRESS,
	TOKEN_MARKET_ADDRESS,
	tokenAbiTyped,
	tokenMarketAbiTyped,
} from '@/lib/contracts';
import { cn } from '@/lib/utils';

export function BuyPageContent() {
	const connection = useConnection();
	const address = connection.address;
	const [buyEthAmount, setBuyEthAmount] = useState('');
	const [buyGasLimit, setBuyGasLimit] = useState('');
	const [redeemAmount, setRedeemAmount] = useState('');

	const { data: balance, refetch: refetchBalance } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'balanceOf',
		args: address ? [address] : undefined,
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

	const {
		mutateAsync: buyMutateAsync,
		isPending: isBuyPending,
		isSuccess: isBuySuccess,
	} = useWriteContract();

	const {
		mutateAsync: approveMutateAsync,
		isPending: isApprovePending,
		isSuccess: isApproveSuccess,
	} = useWriteContract();

	const {
		mutateAsync: redeemMutateAsync,
		isPending: isRedeemPending,
		isSuccess: isRedeemSuccess,
	} = useWriteContract();

	const { data: tokenPriceUSD } = useReadContract({
		address: TOKEN_MARKET_ADDRESS,
		abi: tokenMarketAbiTyped,
		functionName: 'tokenPriceInUSD',
	});

	const { data: allowance, refetch: refetchAllowance } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'allowance',
		args:
			address && TOKEN_MARKET_ADDRESS
				? [address, TOKEN_MARKET_ADDRESS]
				: undefined,
	});

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

	const handleBuy = useCallback(async () => {
		if (!(TOKEN_MARKET_ADDRESS && buyEthAmount)) return;
		const ethWei = parseUnits(buyEthAmount, 18);
		if (ethWei <= BigInt(0)) return;
		const gasLimitRaw = buyGasLimit.trim();
		const gasLimit =
			gasLimitRaw !== '' && !Number.isNaN(Number(gasLimitRaw))
				? BigInt(Math.floor(Number(gasLimitRaw)))
				: BigInt(16_000_000);
		try {
			await buyMutateAsync({
				address: TOKEN_MARKET_ADDRESS,
				abi: tokenMarketAbiTyped,
				functionName: 'buyWithETH',
				value: ethWei,
				gas: gasLimit,
			} as unknown as Parameters<typeof buyMutateAsync>[0]);
			setBuyEthAmount('');
			refetchBalance();
		} catch (err) {
			console.error(err);
		}
	}, [buyEthAmount, buyGasLimit, buyMutateAsync, refetchBalance]);

	const allowanceWei =
		allowance != null && typeof allowance === 'bigint' ? allowance : BigInt(0);
	const redeemAmountWei =
		redeemAmount !== '' && !Number.isNaN(Number(redeemAmount))
			? parseUnits(redeemAmount, decimalsNum)
			: BigInt(0);
	const hasEnoughAllowance =
		allowanceWei >= redeemAmountWei && redeemAmountWei > BigInt(0);
	const formattedAllowance =
		allowance != null && typeof allowance === 'bigint' && decimals != null
			? formatUnits(allowance, decimalsNum)
			: '0';

	const handleApprove = useCallback(async () => {
		if (
			!(TOKEN_ADDRESS && TOKEN_MARKET_ADDRESS && redeemAmount) ||
			decimals == null
		)
			return;
		const amountWei = parseUnits(redeemAmount, decimalsNum);
		if (amountWei <= BigInt(0)) return;
		try {
			await approveMutateAsync({
				address: TOKEN_ADDRESS,
				abi: tokenAbiTyped,
				functionName: 'approve',
				args: [TOKEN_MARKET_ADDRESS, amountWei],
			});
			refetchAllowance();
		} catch (err) {
			console.error(err);
		}
	}, [
		redeemAmount,
		decimals,
		decimalsNum,
		approveMutateAsync,
		refetchAllowance,
	]);

	const handleRedeem = useCallback(async () => {
		if (!(TOKEN_MARKET_ADDRESS && redeemAmount) || decimals == null) return;
		const amountWei = parseUnits(redeemAmount, decimalsNum);
		if (amountWei <= BigInt(0)) return;
		if (allowanceWei < amountWei) return;
		try {
			await redeemMutateAsync({
				address: TOKEN_MARKET_ADDRESS,
				abi: tokenMarketAbiTyped,
				functionName: 'redeemToETH',
				args: [amountWei],
				gas: BigInt(16_000_000),
			});
			setRedeemAmount('');
			refetchBalance();
		} catch (err) {
			console.error(err);
		}
	}, [
		redeemAmount,
		decimals,
		decimalsNum,
		allowanceWei,
		redeemMutateAsync,
		refetchBalance,
	]);

	return (
		<ChainGuard
			configMessage={
				<p className='text-amber-200 text-sm'>
					请在 .env.local 中设置{' '}
					<code className='rounded bg-black/20 px-1'>
						NEXT_PUBLIC_TOKEN_MARKET_ADDRESS
					</code>{' '}
					为 Token 市场合约地址。
				</p>
			}
			configured={!!TOKEN_MARKET_ADDRESS}
		>
			<section
				aria-labelledby='buy-title'
				className='w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6'
			>
				<h1
					className='mb-4 font-heading font-semibold text-[#F8FAFC] text-xl'
					id='buy-title'
				>
					购买 Token
				</h1>

				<dl className='mb-6 grid gap-2 text-sm'>
					<div className='flex justify-between gap-4'>
						<dt className='text-[#94A3B8]'>我的余额</dt>
						<dd className='font-medium text-[#FBBF24]'>
							{formattedBalance} {typeof symbol === 'string' ? symbol : ''}
						</dd>
					</div>
				</dl>

				{tokenPriceUSD != null && typeof tokenPriceUSD === 'bigint' && (
					<p className='mb-4 text-[#94A3B8] text-sm'>
						Token 价格: $
						{Number(formatUnits(tokenPriceUSD, 8)).toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 6,
						})}{' '}
						USD
					</p>
				)}

				<div className='space-y-4'>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='buy-eth-amount'
						>
							支付 ETH 数量
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='buy-eth-amount'
							inputMode='decimal'
							onChange={(e) => setBuyEthAmount(e.target.value)}
							placeholder='0'
							type='text'
							value={buyEthAmount}
						/>
					</div>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='buy-gas-limit'
						>
							Gas 上限（可选）
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='buy-gas-limit'
							inputMode='numeric'
							onChange={(e) => setBuyGasLimit(e.target.value)}
							placeholder='默认 16000000，链上限 16777216'
							type='text'
							value={buyGasLimit}
						/>
					</div>
					{isBuySuccess && (
						<p className='text-emerald-400 text-sm' role='status'>
							购买已提交成功
						</p>
					)}
					<Button
						className={cn(
							'min-h-[44px] w-full cursor-pointer bg-[#F59E0B] text-[#0F172A] transition-colors duration-200 hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-50',
						)}
						disabled={
							isBuyPending ||
							!buyEthAmount ||
							Number.isNaN(Number(buyEthAmount)) ||
							Number(buyEthAmount) <= 0
						}
						onClick={handleBuy}
						type='button'
					>
						{isBuyPending ? '购买中…' : '用 ETH 购买'}
					</Button>
				</div>

				{/* 赎回为 ETH */}
				<div className='mt-8 space-y-4 border-white/10 border-t pt-6'>
					<h2 className='font-heading font-medium text-[#F8FAFC] text-base'>
						赎回为 ETH
					</h2>
					<p className='text-[#94A3B8] text-sm'>
						将 Token 赎回为 ETH，按当前价格结算。赎回前需授权市场合约划转你的
						Token。
					</p>
					<p className='text-[#64748B] text-xs'>
						当前对市场的授权: {formattedAllowance}{' '}
						{typeof symbol === 'string' ? symbol : ''}
					</p>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='redeem-amount'
						>
							赎回 Token 数量
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='redeem-amount'
							inputMode='decimal'
							onChange={(e) => setRedeemAmount(e.target.value)}
							placeholder='0'
							type='text'
							value={redeemAmount}
						/>
						{typeof symbol === 'string' && (
							<span className='mt-1 block text-[#64748B] text-xs'>
								单位: {symbol}
							</span>
						)}
					</div>
					{isApproveSuccess && (
						<p className='text-emerald-400 text-sm' role='status'>
							授权成功，可点击「赎回为 ETH」
						</p>
					)}
					{isRedeemSuccess && (
						<p className='text-emerald-400 text-sm' role='status'>
							赎回已提交成功
						</p>
					)}
					<div className='flex flex-col gap-3 sm:flex-row'>
						{!hasEnoughAllowance && (
							<Button
								className={cn(
									'min-h-[44px] flex-1 cursor-pointer border border-amber-500/50 bg-amber-500/10 text-amber-300 transition-colors duration-200 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50',
								)}
								disabled={
									isApprovePending ||
									!redeemAmount ||
									Number.isNaN(Number(redeemAmount)) ||
									Number(redeemAmount) <= 0
								}
								onClick={handleApprove}
								type='button'
							>
								{isApprovePending ? '授权中…' : '先授权'}
							</Button>
						)}
						<Button
							className={cn(
								'min-h-[44px] flex-1 cursor-pointer border border-[#8B5CF6] bg-transparent text-[#8B5CF6] transition-colors duration-200 hover:bg-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-50',
							)}
							disabled={
								isRedeemPending ||
								!redeemAmount ||
								Number.isNaN(Number(redeemAmount)) ||
								Number(redeemAmount) <= 0 ||
								!hasEnoughAllowance
							}
							onClick={handleRedeem}
							type='button'
						>
							{isRedeemPending ? '赎回中…' : '赎回为 ETH'}
						</Button>
					</div>
				</div>
			</section>
		</ChainGuard>
	);
}

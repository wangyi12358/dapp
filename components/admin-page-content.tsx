'use client';

import { useCallback, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import {
	useBalance,
	useConnection,
	useReadContract,
	useSendTransaction,
	useWriteContract,
} from 'wagmi';
import { ChainGuard } from '@/components/chain-guard';
import { Button } from '@/components/ui/button';
import {
	TOKEN_ADDRESS,
	TOKEN_MARKET_ADDRESS,
	tokenAbiTyped,
	tokenMarketAbiTyped,
} from '@/lib/contracts';
import { cn } from '@/lib/utils';

export function AdminPageContent() {
	const connection = useConnection();
	const address = connection.address;
	const [withdrawAmount, setWithdrawAmount] = useState('');
	const [depositEthAmount, setDepositEthAmount] = useState('');
	const [approveAmount, setApproveAmount] = useState('');
	const [withdrawTokenTo, setWithdrawTokenTo] = useState('');
	const [withdrawTokenAmount, setWithdrawTokenAmount] = useState('');

	const { data: marketEthBalance, refetch: refetchMarketEth } = useBalance({
		address: TOKEN_MARKET_ADDRESS,
	});

	const { data: marketOwner } = useReadContract({
		address: TOKEN_MARKET_ADDRESS,
		abi: tokenMarketAbiTyped,
		functionName: 'owner',
	});

	const { data: symbol } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'symbol',
	});

	const { data: marketTokenBalance } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'balanceOf',
		args: TOKEN_MARKET_ADDRESS ? [TOKEN_MARKET_ADDRESS] : undefined,
	});

	const { data: decimals } = useReadContract({
		address: TOKEN_ADDRESS,
		abi: tokenAbiTyped,
		functionName: 'decimals',
	});

	const decimalsNum: number =
		typeof decimals === 'bigint'
			? Number(decimals)
			: typeof decimals === 'number'
				? decimals
				: 18;

	const isOwner =
		address &&
		marketOwner &&
		typeof marketOwner === 'string' &&
		address.toLowerCase() === (marketOwner as string).toLowerCase();

	const {
		mutateAsync: withdrawMutateAsync,
		isPending: isWithdrawPending,
		isSuccess: isWithdrawSuccess,
	} = useWriteContract();

	const { sendTransactionAsync: sendEthAsync, isPending: isDepositPending } =
		useSendTransaction();

	const {
		mutateAsync: approveMutateAsync,
		isPending: isApprovePending,
		isSuccess: isApproveSuccess,
	} = useWriteContract();

	const {
		mutateAsync: withdrawTokenMutateAsync,
		isPending: isWithdrawTokenPending,
		isSuccess: isWithdrawTokenSuccess,
	} = useWriteContract();

	const handleWithdraw = useCallback(async () => {
		if (!(TOKEN_MARKET_ADDRESS && withdrawAmount)) return;
		const amountWei = parseUnits(withdrawAmount, 18);
		if (amountWei <= BigInt(0)) return;
		try {
			await withdrawMutateAsync({
				address: TOKEN_MARKET_ADDRESS,
				abi: tokenMarketAbiTyped,
				functionName: 'withdrawETH',
				args: [amountWei],
			});
			setWithdrawAmount('');
			refetchMarketEth();
		} catch (err) {
			console.error(err);
		}
	}, [withdrawAmount, withdrawMutateAsync, refetchMarketEth]);

	const handleDepositEth = useCallback(async () => {
		if (!(TOKEN_MARKET_ADDRESS && depositEthAmount)) return;
		const valueWei = parseUnits(depositEthAmount, 18);
		if (valueWei <= BigInt(0)) return;
		try {
			await sendEthAsync({
				to: TOKEN_MARKET_ADDRESS,
				value: valueWei,
			});
			setDepositEthAmount('');
			refetchMarketEth();
		} catch (err) {
			console.error(err);
		}
	}, [depositEthAmount, sendEthAsync, refetchMarketEth]);

	const handleApproveForMarket = useCallback(async () => {
		if (
			!(TOKEN_ADDRESS && TOKEN_MARKET_ADDRESS && approveAmount) ||
			decimals == null
		)
			return;
		const amountWei = parseUnits(approveAmount, decimalsNum);
		if (amountWei <= BigInt(0)) return;
		try {
			await approveMutateAsync({
				address: TOKEN_ADDRESS,
				abi: tokenAbiTyped,
				functionName: 'approve',
				args: [TOKEN_MARKET_ADDRESS, amountWei],
			});
			setApproveAmount('');
		} catch (err) {
			console.error(err);
		}
	}, [approveAmount, decimals, decimalsNum, approveMutateAsync]);

	if (!TOKEN_MARKET_ADDRESS) {
		return (
			<section className='w-full max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6'>
				<p className='text-amber-200 text-sm'>
					请配置 NEXT_PUBLIC_TOKEN_MARKET_ADDRESS 后使用管理员功能。
				</p>
			</section>
		);
	}

	if (!isOwner && address && marketOwner) {
		return (
			<section className='w-full max-w-lg rounded-2xl border border-red-500/30 bg-red-500/5 p-6'>
				<p className='text-red-200 text-sm'>
					当前钱包不是市场合约管理员，无法操作。
				</p>
			</section>
		);
	}

	if (!address) {
		return (
			<section className='w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6'>
				<p className='text-[#94A3B8] text-sm'>请先连接钱包。</p>
			</section>
		);
	}

	return (
		<ChainGuard configMessage={null} configured={!!TOKEN_MARKET_ADDRESS}>
			<section
				aria-labelledby='admin-title'
				className='w-full max-w-lg space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6'
			>
				<h1
					className='font-heading font-semibold text-[#F8FAFC] text-xl'
					id='admin-title'
				>
					管理员
				</h1>

				{/* 1. withdrawETH：从市场合约提走 ETH */}
				<div className='space-y-3'>
					<h2 className='font-heading font-medium text-[#F8FAFC] text-base'>
						提取 ETH（withdrawETH）
					</h2>
					<p className='text-[#94A3B8] text-sm'>
						从市场合约提取 ETH 到当前钱包（仅管理员）。
					</p>
					<p className='font-medium text-[#FBBF24] text-sm'>
						市场合约当前 ETH 余额:{' '}
						{marketEthBalance?.value != null
							? formatUnits(marketEthBalance.value, 18)
							: '–'}{' '}
						ETH
					</p>
					<p className='font-medium text-[#FBBF24] text-sm'>
						市场合约当前 {typeof symbol === 'string' ? symbol : 'Token'} 余额:{' '}
						{marketTokenBalance != null &&
						typeof marketTokenBalance === 'bigint' &&
						decimals != null
							? formatUnits(marketTokenBalance, decimalsNum)
							: '–'}{' '}
						{typeof symbol === 'string' ? symbol : ''}
					</p>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='admin-withdraw-amount'
						>
							ETH 数量
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='admin-withdraw-amount'
							inputMode='decimal'
							onChange={(e) => setWithdrawAmount(e.target.value)}
							placeholder='0'
							type='text'
							value={withdrawAmount}
						/>
					</div>
					{isWithdrawSuccess && (
						<p className='text-emerald-400 text-sm' role='status'>
							提取已提交成功
						</p>
					)}
					<Button
						className={cn(
							'min-h-[44px] w-full cursor-pointer bg-[#8B5CF6] text-white hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50',
						)}
						disabled={
							isWithdrawPending ||
							!withdrawAmount ||
							Number.isNaN(Number(withdrawAmount)) ||
							Number(withdrawAmount) <= 0
						}
						onClick={handleWithdraw}
						type='button'
					>
						{isWithdrawPending ? '提取中…' : '提取 ETH'}
					</Button>
				</div>

				{/* 2. 转入 ETH 到市场合约 */}
				<div className='space-y-3 border-white/10 border-t pt-6'>
					<h2 className='font-heading font-medium text-[#F8FAFC] text-base'>
						转入 ETH 到市场
					</h2>
					<p className='text-[#94A3B8] text-sm'>
						从当前钱包向市场合约转入 ETH（用于用户购买 Token 时支付）。
					</p>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='admin-deposit-eth'
						>
							ETH 数量
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='admin-deposit-eth'
							inputMode='decimal'
							onChange={(e) => setDepositEthAmount(e.target.value)}
							placeholder='0'
							type='text'
							value={depositEthAmount}
						/>
					</div>
					<Button
						className={cn(
							'min-h-[44px] w-full cursor-pointer bg-[#F59E0B] text-[#0F172A] hover:bg-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-50',
						)}
						disabled={
							isDepositPending ||
							!depositEthAmount ||
							Number.isNaN(Number(depositEthAmount)) ||
							Number(depositEthAmount) <= 0
						}
						onClick={handleDepositEth}
						type='button'
					>
						{isDepositPending ? '转入中…' : '转入 ETH 到市场'}
					</Button>
				</div>

				{/* 3. Token approve 给 market */}
				<div className='space-y-3 border-white/10 border-t pt-6'>
					<h2 className='font-heading font-medium text-[#F8FAFC] text-base'>
						Token 授权给市场
					</h2>
					<p className='text-[#94A3B8] text-sm'>
						授权市场合约可从当前钱包划转 Token（用于用户购买时从你账户转出 Token
						到市场）。
					</p>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='admin-approve-amount'
						>
							授权数量
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='admin-approve-amount'
							inputMode='decimal'
							onChange={(e) => setApproveAmount(e.target.value)}
							placeholder='0'
							type='text'
							value={approveAmount}
						/>
						{typeof symbol === 'string' && (
							<span className='mt-1 block text-[#64748B] text-xs'>
								单位: {symbol}
							</span>
						)}
					</div>
					{isApproveSuccess && (
						<p className='text-emerald-400 text-sm' role='status'>
							授权已提交成功
						</p>
					)}
					<Button
						className={cn(
							'min-h-[44px] w-full cursor-pointer border border-[#8B5CF6] bg-transparent text-[#8B5CF6] hover:bg-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-50',
						)}
						disabled={
							isApprovePending ||
							!approveAmount ||
							Number.isNaN(Number(approveAmount)) ||
							Number(approveAmount) <= 0
						}
						onClick={handleApproveForMarket}
						type='button'
					>
						{isApprovePending ? '授权中…' : '授权给市场'}
					</Button>
				</div>
			</section>
		</ChainGuard>
	);
}

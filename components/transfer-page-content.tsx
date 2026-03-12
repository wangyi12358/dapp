'use client';

import { useCallback, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConnection, useReadContract, useWriteContract } from 'wagmi';
import { ChainGuard } from '@/components/chain-guard';
import { Button } from '@/components/ui/button';
import { TOKEN_ADDRESS, tokenAbiTyped } from '@/lib/contracts';
import { cn } from '@/lib/utils';

export function TransferPageContent() {
	const connection = useConnection();
	const address = connection.address;
	const [toAddress, setToAddress] = useState('');
	const [amount, setAmount] = useState('');

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
		mutateAsync,
		isPending: isTransferPending,
		isSuccess: isTransferSuccess,
	} = useWriteContract();

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

	const handleTransfer = useCallback(async () => {
		if (!(TOKEN_ADDRESS && toAddress.trim() && amount) || decimals == null)
			return;
		const to = toAddress.trim() as `0x${string}`;
		if (!/^0x[a-fA-F0-9]{40}$/.test(to)) return;
		try {
			const amountWei = parseUnits(amount, decimalsNum);
			await mutateAsync({
				address: TOKEN_ADDRESS,
				abi: tokenAbiTyped,
				functionName: 'transfer',
				args: [to, amountWei],
			});
			setToAddress('');
			setAmount('');
			refetchBalance();
		} catch (err) {
			console.error(err);
		}
	}, [toAddress, amount, decimals, decimalsNum, mutateAsync, refetchBalance]);

	return (
		<ChainGuard
			configMessage={
				<p className='text-amber-200 text-sm'>
					请在 .env.local 中设置{' '}
					<code className='rounded bg-black/20 px-1'>
						NEXT_PUBLIC_TOKEN_ADDRESS
					</code>{' '}
					为 Token 合约地址。
				</p>
			}
			configured={!!TOKEN_ADDRESS}
		>
			<section
				aria-labelledby='transfer-title'
				className='w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6'
			>
				<h1
					className='mb-4 font-heading font-semibold text-[#F8FAFC] text-xl'
					id='transfer-title'
				>
					转账
				</h1>

				<dl className='mb-6 grid gap-2 text-sm'>
					<div className='flex justify-between gap-4'>
						<dt className='text-[#94A3B8]'>我的余额</dt>
						<dd className='font-medium text-[#FBBF24]'>
							{formattedBalance} {typeof symbol === 'string' ? symbol : ''}
						</dd>
					</div>
				</dl>

				<div className='space-y-4'>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='transfer-to'
						>
							收款地址
						</label>
						<input
							aria-invalid={
								!!(toAddress && !/^0x[a-fA-F0-9]{40}$/.test(toAddress.trim()))
							}
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='transfer-to'
							onChange={(e) => setToAddress(e.target.value)}
							placeholder='0x...'
							type='text'
							value={toAddress}
						/>
					</div>
					<div>
						<label
							className='mb-1 block text-[#94A3B8] text-sm'
							htmlFor='transfer-amount'
						>
							数量
						</label>
						<input
							className='w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]'
							id='transfer-amount'
							inputMode='decimal'
							onChange={(e) => setAmount(e.target.value)}
							placeholder='0'
							type='text'
							value={amount}
						/>
						{typeof symbol === 'string' && (
							<span className='mt-1 block text-[#64748B] text-xs'>
								单位: {symbol}
							</span>
						)}
					</div>
					{isTransferSuccess && (
						<p className='text-emerald-400 text-sm' role='status'>
							转账已提交成功
						</p>
					)}
					<Button
						className={cn(
							'min-h-[44px] w-full cursor-pointer bg-[#8B5CF6] text-white transition-colors duration-200 hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50',
						)}
						disabled={
							isTransferPending ||
							!toAddress.trim() ||
							!amount ||
							!/^0x[a-fA-F0-9]{40}$/.test(toAddress.trim()) ||
							Number.isNaN(Number(amount)) ||
							Number(amount) <= 0
						}
						onClick={handleTransfer}
						type='button'
					>
						{isTransferPending ? '处理中…' : '转账'}
					</Button>
				</div>
			</section>
		</ChainGuard>
	);
}

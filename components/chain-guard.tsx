'use client';

import { useCallback, useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';

const SEPOLIA_ID = sepolia.id;

interface ChainGuardProps {
	children: React.ReactNode;
	/** 若未配置则显示该提示（如 Token 或 市场 地址） */
	configMessage?: React.ReactNode;
	/** 是否已配置（如 TOKEN_ADDRESS 或 TOKEN_MARKET_ADDRESS） */
	configured: boolean;
}

export function ChainGuard({
	children,
	configMessage,
	configured,
}: ChainGuardProps) {
	const chainId = useChainId();
	const { mutateAsync: switchChainAsync, isPending: isSwitchPending } =
		useSwitchChain();
	const [switchError, setSwitchError] = useState<string | null>(null);

	const isWrongChain = chainId !== SEPOLIA_ID;

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

	if (!configured && configMessage) {
		return (
			<section className='mx-auto w-full max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6'>
				{configMessage}
			</section>
		);
	}

	if (isWrongChain) {
		return (
			<section className='mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6'>
				<p className='mb-4 text-[#94A3B8] text-sm'>
					请切换到 Sepolia 测试网后继续。
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

	return <>{children}</>;
}

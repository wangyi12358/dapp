import type { Metadata } from 'next';
import { Exo_2, Orbitron } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import { Providers } from '@/components/providers';

const orbitron = Orbitron({
	variable: '--font-orbitron',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

const exo2 = Exo_2({
	variable: '--font-exo2',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Web3 DAPP',
	description: 'Connect your wallet and interact with the blockchain',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className='dark' lang='en'>
			<body
				className={`${orbitron.variable} ${exo2.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

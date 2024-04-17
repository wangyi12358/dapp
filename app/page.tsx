'use client'
import { Layout } from '@/lib/components/layout';
import web3 from '@/lib/utils/web3';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

interface Account {
  address: string
  balance: bigint
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])

  async function initAccounts() {
    const _accounts = await web3.eth.getAccounts();
    const _balances = await Promise.all(_accounts.map(x => web3.eth.getBalance(x)));
    setAccounts(_accounts.map((address, i) => ({
      address,
      balance: _balances[i]
    })))
  }

  useEffect(() => {
    initAccounts()
  }, [])

  return (
    <Layout>
      <Button color="primary">
        Welcome to Ethereum ICO DApp!
      </Button>
      <ul className='ml-2'>
        {accounts.map(account => (
          <li key={account.address}>
            {account.address} {'=>'} {web3.utils.fromWei(account.balance, 'ether')} ETH
          </li>
        ))}
      </ul>
    </Layout>
  );
}

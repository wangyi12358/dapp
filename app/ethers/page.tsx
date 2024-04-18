'use client';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';

export default function Ethers() {
  const providerRef = useRef<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<ethers.JsonRpcSigner | null>(null);

  function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      providerRef.current = provider;
        // 监听账户变化事件
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('accountsChanged', accounts);
          setAccount(accounts[0]);
        });
    }
  }

  async function handleConnectWallet() {
    try {
      // 请求用户授权连接到以太坊账户
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // 获取当前连接的账户
      const accounts = await providerRef.current?.listAccounts();
      console.log('accounts', accounts);
      if (accounts) setAccount(accounts[0]);
    } catch (error) {
      console.error('连接钱包失败：', error);
    }
  }

  useEffect(() => {
    connectWallet();
  }, [])

  return (
    <div className='p-3'>
      <h1>使用 Ethers.js 连接钱包</h1>

      <h2>钱包连接状态：{account ? '已连接' : '未连接'}</h2>
      {account && <p>当前连接的账户：{account?.address}</p>}
      {!account && (
        <button onClick={handleConnectWallet}>连接钱包</button>
      )}
    </div>
  )
}
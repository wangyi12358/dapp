import getConfig from 'next/config';
import Web3 from 'web3';

const { publicRuntimeConfig } = getConfig() ?? {};

let web3: Web3;
// 浏览器环境且已经安装了 Metamask
if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  try {
      // 请求用户授权连接到以太坊
      window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
      // 用户拒绝了访问
      console.error('User denied access to the Ethereum blockchain');
  }
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(publicRuntimeConfig.infuraUrl));
}

export default web3;
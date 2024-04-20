'use client'
import { Layout } from '@/lib/components/layout';
import web3 from '@/lib/utils/web3';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useSetState } from 'ahooks';
import { useEffect, useState } from 'react';
interface Account {
  address: string
  balance: string
}

const modalBoxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [openAddress, setOpenAddress] = useState('')
  const [transferInfo, setTransferInfo] = useSetState({
    to: '',
    value: ''
  })

  async function initAccounts() {
    const _accounts = await web3.eth.getAccounts();
    console.log('_accounts==', _accounts)

    const _balances = await Promise.all(_accounts.map(x => web3.eth.getBalance(x)));
    setAccounts(_accounts.map((address, i) => ({
      address,
      balance: _balances[i]
    })))
  }

  useEffect(() => {
    initAccounts()
  }, [])

  async function onTransfer() {
    console.log('transferInfo==', transferInfo)
    const txObject = {
      from: openAddress,
      to: transferInfo.to,
      value: web3.utils.toWei(transferInfo.value.toString(), 'ether'), // 转账金额，以wei为单位
    };
    const result = await web3.eth.sendTransaction(txObject);
    console.log('result==', result)
    setOpenAddress('')
    setTransferInfo({
      to: '',
      value: ''
    })
  }

  return (
    <Layout>
      <Button color="primary">
        Welcome to Ethereum ICO DApp!
      </Button>
      <ul className='ml-2'>
        {accounts.map(account => (
          <li key={account.address}>
            <span className='mr-2'>{account.address} {'=>'} {web3.utils.fromWei(account.balance, 'ether')} ETH</span>
            <Button
              onClick={() => setOpenAddress(account.address)}
              variant="contained"
              color="primary"
            >转账</Button>
          </li>
        ))}
      </ul>
      <Modal
        open={!!openAddress}
        onClose={() => setOpenAddress('')}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <div className='space-y-3'>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
              转账
            </Typography>
            <TextField
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferInfo({ to: e.target.value })}
              id="outlined-basic"
              label="收款地址"
              fullWidth
              variant="outlined"
            />
            <TextField
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferInfo({ value: e.target.value })}
              id="outlined-basic"
              label="转账金额"
              type='number'
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={onTransfer}
            >确定</Button>
          </div>
        </Box>
      </Modal>
    </Layout>
  );
}

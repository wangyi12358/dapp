import { Button, TextField } from '@mui/material'
export default function Balance() {
  return (
    <div className="p-3">
      <TextField
        label="Network"
        variant="outlined"
        className="mb-3"
        fullWidth
      />
      <TextField
        label="Address"
        variant="outlined"
        className="mb-3"
        fullWidth
      />
      <Button>查询</Button>
    </div>
  )
}
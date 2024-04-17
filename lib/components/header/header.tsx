import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';

export interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <AppBar position="static" color="default">
      <div className="mx-auto w-4/5 max-w-[1200px] flex">
          <Toolbar className="p-0 flex-1">
            <Typography color="inherit" className="border-r border-solid border-[#CCCCCC] pr-4 mr-4">
              众筹 DApp
            </Typography>
            <p className="flex-1">
              <a href="/">
                <Typography color="inherit">
                  项目列表
                </Typography>
              </a>
            </p>
            <Button color="primary">
              发起项目
            </Button>
          </Toolbar>
        </div>
    </AppBar>
  );
};
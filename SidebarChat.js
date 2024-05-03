import React from 'react';
import "./SidebarChat.css";
import { Avatar } from '@mui/material';

function SidebarChart() {
  return (
    <div className='sidebarChat'>
        <Avatar/>
        <div className='sidebarChat_info'>
            <h2>Room name</h2>
            <p>This is the last message</p>
        </div>
    </div>
  )
}

export default SidebarChart

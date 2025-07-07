import React from 'react'
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <div style={{display: "block", position: 'fixed', bottom: "0", left:"0", right:"0"}}>
     <Box sx={{ bgcolor: '#211747', p: 4, color:"white", height: "32px"}} component="footer">

        <Typography
          variant="subtitle1"
          align="center"
          color="white"
          component="p"
          marginTop="-10px"
        >
        </Typography>

      </Box>
      </div>
  )
}
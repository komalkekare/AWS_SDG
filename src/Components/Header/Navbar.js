import React from "react";
import { AppBar, Toolbar, Box, IconButton, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BrillioLogo from "../../assests/BrillioLogo.png";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";


export default function Navbar() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#211747", // Replace with your desired color
      },
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Link className="navLink" to="/">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              ></IconButton>

              <img src={BrillioLogo} alt="Logo" style={{ height: "35px" }} />
            </Link>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} 
            >
              SYNTHETIC DATA GENERATION
        </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </Box>
    </ThemeProvider>
  );
}

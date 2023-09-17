import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
// import { Text } from "react-native";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { signInWithGoogle, signOutUser } from "../../firebase";
import React from "react";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navDropdownTitle = (
    <IconButton>
      <PersonOutlinedIcon />
    </IconButton>
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedValue === "true" ? true : false);
  }, []);

  const handleLogin = async () => {
    try {
      const log = await signInWithGoogle();
      log ? handleLoginSuccess() : handleLoginFailure();
      window.location.reload();
    } catch (error) {
      console.error("Error signing in:", error);
      handleLoginFailure();
    }
  };

  const handleLoginSuccess = (response) => {
    console.log("Google Sign-In successful:", response);
    // setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Function to handle login failure
  const handleLoginFailure = (error) => {
    // setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    console.error("Google Sign-In failed:", error);
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    // setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    signOutUser();
    window.location.reload();
  };

  const check_status = () => {
    console.log(isLoggedIn);
  };

  return (
    <Box display="flex" justifyContext="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" marginLeft="auto">
        <Box
          style={{
            margin: "3px 8px 0px 0px",
          }}
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        </Box>

        {isLoggedIn === false ? (
          <Box
            onClick={handleLogin}
            style={{
              margin: "3px 8px 0px 0px",
            }}
          >
            <Typography variant="h7" color={colors.grey[100]}>
              Login
            </Typography>
            <IconButton>
              <LoginIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            onClick={handleLogout}
            style={{
              margin: "3px 8px 0px 0px",
            }}
          >
            <Typography variant="h7" color={colors.grey[100]}>
              Logout
            </Typography>
            <IconButton>
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;

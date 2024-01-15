import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Header from "./Header";
import { Link } from "react-router-dom";
import Logout from "../components/Logout";
import ImportFormModal from "../components/ImportFormModal";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

const pages = ["Konkursy", "Wydarzenia", "Strona Główna", "użytkownicy"];
const settings = ["Profil", "Moje prace", "Importuj"];
const settingsLinks = {
  Profil: "/profile",
};
const pagesLinks = {
  Konkursy: "/",
  Wydarzenia: "/",
  "Strona Główna": "https://www.fundacjabowarto.pl/",
  użytkownicy: "/users",
};

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [showImportModal, setShowImportModal] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const currentUserLink = `${
      import.meta.env.VITE_API_URL
    }api/users/current_user/`;
    const headersCurrentUser = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + accessToken,
      },
    };
    axios
      .get(currentUserLink, headersCurrentUser)
      .then((res) => {
        const responseData = res.data;
        setUserData(responseData);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const isStaff = userData.is_staff === true;
  const filteredPages = isStaff
    ? pages
    : pages.filter((page) => page !== "użytkownicy");

  const handleImportModalClose = () => {
    setShowImportModal(false);
    handleCloseUserMenu();
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ padding: "10px" }}>
            <div style={{ paddingRight: "20px" }}>
              <Header logoSize="150px"></Header>
            </div>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {filteredPages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {filteredPages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "black", display: "block" }}
                  component={Link}
                  to={pagesLinks[page]}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {accessToken ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={
                        setting === "Importuj"
                          ? setShowImportModal
                          : handleCloseUserMenu
                      }
                      component={Link}
                      to={settingsLinks[setting]}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}{" "}
                  <Logout></Logout>
                </Menu>
              </Box>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ color: "black" }}
                >
                  Zaloguj się
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{ color: "black" }}
                >
                  Zarejestruj się
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Dialog
        open={Boolean(showImportModal)}
        onClose={handleImportModalClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "1.8rem",
          }}
        >
          <span style={{ marginRight: "auto" }}>
            Import placówek z pliku .csv
          </span>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleImportModalClose}
            aria-label="close"
            style={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ImportFormModal />
        </DialogContent>
      </Dialog>
    </>
  );
}
export default ResponsiveAppBar;

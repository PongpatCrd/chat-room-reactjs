import React, { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import API from "../../helpers/APIConnector/APIConnector";

import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import LabelIcon from "@material-ui/icons/Label";

import MenuIcon from "@material-ui/icons/Menu";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HeaderCss from "./Header.module.css";

import LoginModal from "../../components/LoginModal/LoginModal";
import Toast from "../../helpers/SweetAlert/SweetAlert";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { CommonContext } from "../../contexts/CommonContext/CommonContext";

const styles = makeStyles({
  appBar: {
    backgroundColor: "#127d77",
    color: "white",
  },
});

const Header = () => {
  const { user, dispatch } = useContext(UserContext);
  const { common, dispatch: commonDispatch } = useContext(CommonContext);
  const [removeCookie] = useCookies()

  const [openSiderBar, setOpenSiderBar] = useState(false);

  const f = {
    handleDrawerOpen: () => setOpenSiderBar(true),
    handleDrawerClose: () => setOpenSiderBar(false),
    openLoginModal: () => commonDispatch({ type: 'SET_SHOW_LOGIN_MODAL', data: { showLoginModal: true } }),
    closeLoginModal: () => commonDispatch({ type: 'SET_SHOW_LOGIN_MODAL', data: { showLoginModal: false } }),
    logOut: (e) => {
      e.preventDefault();

      API.post("/logout", {
        username: user.username,
        accessToken: user.accessToken,
      })
        .then((res) => {
          const data = res.data;

          if (data.status) {
            new Toast({ icon: "success", title: data.msg }).shoot();
            dispatch({ type: "REMOVE_USER" });
            removeCookie('refreshToken')
          } else {
            new Toast({ icon: "error", title: data.msg }).shoot();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  };

  const classes = styles();

  return (
    <div>
      {/* <Button onClick={() => API.post('/test')}>asaf</Button> */}
      <LoginModal
        show={common.showLoginModal}
        closeFn={f.closeLoginModal}
      ></LoginModal>

      <AppBar className={classes.appBar} position="relative">
        <Toolbar>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={f.handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            </Grid>

            <Grid item xs>
              <Typography variant="h6">{common.headerTitle}</Typography>
            </Grid>

            <Grid item>
              {Object.keys(user).length > 0 ? (
                <div className={HeaderCss.logoutBtn}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={f.logOut}
                    startIcon={<ExitToAppIcon />}
                  >
                    <b>Logout</b>
                  </Button>
                </div>
              ) : (
                <div className={HeaderCss.loginBtn}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={f.openLoginModal}
                    startIcon={<SupervisorAccountIcon />}
                  >
                    <b>Login</b>
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer variant="persistent" anchor="left" open={openSiderBar}>
        <div className={HeaderCss.sideBarHeader}>
          <IconButton onClick={f.handleDrawerClose}>
            <ArrowBackIosIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem component={Link} to="/" onClick={f.handleDrawerClose}>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem component={Link} to="/rooms" onClick={f.handleDrawerClose}>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>

          <ListItem
            button
            component={Link}
            to="/history"
            onClick={f.handleDrawerClose}
          >
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="History" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Header;

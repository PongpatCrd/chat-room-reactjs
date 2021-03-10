import React, { useState, useContext } from "react";
import API from "../../helpers/APIConnector/APIConnector";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";

import Toast from "../../helpers/SweetAlert/SweetAlert";

import { UserContext } from "../../contexts/UserContext/UserContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LoginModal = ({ show, closeFn }) => {
  const { user, dispatch } = useContext(UserContext);

  const [data, setData] = useState({
    username: "",
    password: "",
    isShowPassword: false,
    isOnProcess: false,
  });

  const f = {
    inputUsername: (e) => {
      setData((prevState) => ({ ...prevState, username: e.target.value }));
    },
    inputPassword: (e) => {
      setData((prevState) => ({ ...prevState, password: e.target.value }));
    },
    resetInputData: () => {
      setData((prevState) => ({ ...prevState, username: "", password: "" }));
    },
    showPassword: () => {
      setData((prevState) => ({ ...prevState, isShowPassword: true }));
    },
    hidePassword: () => {
      setData((prevState) => ({ ...prevState, isShowPassword: false }));
    },
    onLogin: () => {
      if (!data.username) {
        new Toast({ icon: "error", title: "Please filled username" }).shoot();
        return;
      }

      if (!data.password) {
        new Toast({ icon: "error", title: "Please filled password" }).shoot();
        return;
      }

      setData((prevState) => ({ ...prevState, isOnProcess: true }));
      API.post("/login", {
        username: data.username,
        password: data.password,
      })
        .then((res) => {
          const data = res.data;

          if (data.status && data.data) {
            new Toast({
              icon: "success",
              title: `Hi ${data.data.displayName}, Wellcome!`,
            }).shoot();

            f.resetInputData();

            dispatch({ type: "SET_USER", data: data.data });
            closeFn();
          } else {
            new Toast({ icon: "error", title: data.msg }).shoot();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setData((prevState) => ({ ...prevState, isOnProcess: false }));
        });
    },
  };

  return (
    <div>
      <Dialog
        open={show}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeFn}
      >
        <DialogTitle>
          <b>Login Form</b>
        </DialogTitle>

        <DialogContent>
          <div>
            <form>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
              >
                <Grid direction="column" container>
                  <FormControl>
                    <TextField
                      value={data.username}
                      name="username"
                      label="username"
                      variant="outlined"
                      onInput={f.inputUsername}
                    />
                    <hr></hr>
                  </FormControl>

                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      value={data.password}
                      type={data.isShowPassword ? "text" : "password"}
                      onInput={f.inputPassword}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onMouseDown={f.showPassword}
                            onMouseUp={f.hidePassword}
                            edge="end"
                          >
                            {!data.isShowPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </div>
        </DialogContent>

        <DialogActions>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={6} sm={6} direction="row" container>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={data.isOnProcess}
                onClick={f.onLogin}
                startIcon={<VpnKeyIcon />}
              >
                <b>Login</b>
              </Button>
            </Grid>

            <Grid item xs={6} sm={6} direction="row" container>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                startIcon={<ExitToAppIcon />}
                onClick={closeFn}
              >
                Close
              </Button>
            </Grid>
            <hr></hr>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginModal;

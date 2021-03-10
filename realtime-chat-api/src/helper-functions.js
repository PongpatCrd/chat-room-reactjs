const path = require("path");
const fs = require("fs");
const crypto = require("crypto-js");
const cryptoRandomString = require("crypto-random-string");
const configs = require("./configs");

module.exports.createSecretKey = () => {
  const filePath = path.join(__dirname, "../", ".env");

  try {
    const data = fs.readFileSync(filePath, "UTF-8");

    const lines = data.split(/\r?\n/);

    let result = "";
    let hasAppKey = false;

    lines.forEach((line) => {
      if (line.indexOf("APP_KEY") >= 0) {
        hasAppKey = true;
      }

      result += "\n" + line;
    });

    if (!hasAppKey) {
      const key = cryptoRandomString({ length: 64, type: "base64" });
      result = `APP_KEY = ${key}\n` + result;

      fs.writeFileSync(filePath, result, "utf-8", (err) => {
        if (err) console.error(err);
      });

      console.log("APP_KEY Created!");
    } else {
      console.log("Already has APP_KEY");
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.encryptVal = (val) => {
  const key = process.env.APP_KEY;

  const encrypted = crypto.AES.encrypt(val, key).toString();
  return encrypted;
};

module.exports.decryptVal = (val) => {
  const key = process.env.APP_KEY;
  const dec = crypto.AES.decrypt(val, key);
  const txt = dec.toString(crypto.enc.Utf8);
  return txt;
};

module.exports.genUUID = () => {
  const uuid = require("uuid");
  let uid = uuid
    .v4()
    .split("-")
    .join("");
  return uid;
};

module.exports.generalResponse = (data = null, status, msg = "") => {
  if (typeof status === "undefined") throw "status must giving.";

  return {
    data: data,
    status: status,
    msg: msg,
  };
};

module.exports.sendActivationEmail = async (user) => {
  const nodemailer = require("nodemailer");
  const apiURL = "/user/activate";

  let status = false;
  if (user) {
    const transporter = nodemailer.createTransport({
      host: configs.activateEmailHost,
      port: configs.activateEmailPort,
      secure: configs.activateEmailPort == 465 ? true : false, // true for 465, false for other ports
      auth: {
        user: configs.activateEmailSender,
        pass: configs.activatePwdSender,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: configs.activateEmailSender,
        to: user.email,
        subject: "[Chat App] Please verify your email address.", // Subject line
        html: `
          <p>You are almost done, Is your email is <b style="color: red;">${user.email.toLowerCase()}</b> ?</p>
  
          <button onclick="window.open(${process.baseApiURL}/${apiURL}/${
          user.activateToken
        });">Verify email address</button>
          `,
      });

      status = true;
    } catch (e) {
      throw e;
    }
    transporter.close();

    return status;
  }
};

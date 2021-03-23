const path = require("path");
const fs = require("fs");
const crypto = require("crypto-js");
const cryptoRandomString = require("crypto-random-string");
const jwt = require("jsonwebtoken");
const configs = require("./configs");

module.exports.createAppKey = () => {
  const filePath = path.join(__dirname, "../", ".env");

  try {
    const data = fs.readFileSync(filePath, "UTF-8");

    const lines = data.split(/\r?\n/);

    let result = "";
    let hasAppKey = false;

    lines.forEach((line) => {
      if (line.indexOf("APP_KEY") >= 0) {
        hasAppKey = true;
      } else {
        result += "\n" + line;
      }
    });

    if (!hasAppKey) {
      const key = cryptoRandomString({ length: 256, type: "base64" });
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

module.exports.createJWTSecret = () => {
  const filePath = path.join(__dirname, "../", ".env");

  try {
    const data = fs.readFileSync(filePath, "UTF-8");

    const lines = data.split(/\r?\n/);

    let result = "";
    let hasJWTAccessSecret = false;
    let hasJWTRefreshSecret = false;
    // 0 = JWT_ACCESS_SECRET || 1 = JWT_REFRESH_SECRET
    let secret = ["", ""];

    lines.forEach((line) => {
      if (line.indexOf("JWT_ACCESS_SECRET") >= 0) {
        hasJWTAccessSecret = true;
        secret[0] = `${line}\n`;
      } else if (line.indexOf("JWT_REFRESH_SECRET") >= 0) {
        hasJWTRefreshSecret = true;
        secret[1] = `${line}\n`;
      } else {
        result += "\n" + line;
      }
    });

    if (!hasJWTAccessSecret) {
      const key = cryptoRandomString({ length: 256, type: "base64" });
      secret[0] = `JWT_ACCESS_SECRET = ${key}\n`;
    }

    if (!hasJWTRefreshSecret) {
      const key = cryptoRandomString({ length: 256, type: "base64" });
      secret[1] = `JWT_REFRESH_SECRET = ${key}\n`;
    }

    result = secret[0] + secret[1] + result;

    fs.writeFileSync(filePath, result, "utf-8", (err) => {
      if (err) console.error(err);
    });

    console.log('createJWTSecret Success!!')
  } catch (err) {
    console.error(err);
  }
};

module.exports.generateHash = (val) => {
  const hashed = crypto
    .SHA3(val, { outputLength: 256 })
    .toString(crypto.enc.Base64);
  return hashed;
};

module.exports.generateAccessJWT = (userData) => {
  const key = process.env.JWT_ACCESS_SECRET;

  const token = jwt.sign(userData, key, {
    algorithm: "HS512",
    expiresIn: "1m"
  });

  return token;
};

module.exports.verifyAccessJWT = (token) => {
  const key = process.env.JWT_ACCESS_SECRET;

  return jwt.verify(token, key, { algorithm: "HS512" });
};

module.exports.generateRefreshJWT = (userData) => {
  const key = process.env.JWT_REFRESH_SECRET

  const token = jwt.sign(userData, key, {
    algorithm: "HS512",
    expiresIn: "15d"
  })
  return token
}

module.exports.veriftRefreshJWT = (token) => {
  const key = process.env.JWT_REFRESH_SECRET;

  return jwt.verify(token, key, { algorithm: "HS512" });
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

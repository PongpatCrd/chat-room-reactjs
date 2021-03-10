const userModel = require("../model/users");
const conn = require("../databases/mongo-connection");
const hpf = require("../helper-functions");

module.exports.createUser = async (req, res, next) => {
  const data = req.body;

  const uuid = hpf.genUUID();
  try {
    const user = await userModel.create({
      ...data,
      isActive: false,
      activateToken: uuid,
      isActivated: false,
    });

    // user.sendActivationEmail();
    return res.send(hpf.generalResponse(user, true));
  } catch (e) {
    return res.send(hpf.generalResponse(null, false, e.message));
  }
};

module.exports.login = async (req, res, next) => {
  /*
  data format
  {
    username: required,
    password: required
  }
  */

  const data = req.body;

  const session = await userModel.startSession();
  session.startTransaction();

  const tokenExpiry = new Date(conn.now());
  tokenExpiry.setDate(tokenExpiry.getDate() + 365);

  const user = await userModel.findOneAndUpdate(
    {
      username: data.username,
      isActive: true,
      isActivated: true,
    },
    {
      accessToken: hpf.genUUID(),
      accessTokenExpiry: tokenExpiry,
    },
    {
      new: true,
      session: session,
    }
  );

  await session.commitTransaction();
  session.endSession();

  if (user) {
    if (user.isMatchedPassword(data.password)) {
      return res.send(hpf.generalResponse({
        username: user.username,
        displayName: hpf.decryptVal(user.displayName),
        accessToken: user.accessToken,
      }, true));
    } else {
      return res.send(hpf.generalResponse(null, false, "password not match."));
    }
  } else {
    return res.send(hpf.generalResponse(null, false, "username incorrect"));
  }
};

module.exports.logout = async (req, res, next) => {
  /*
  data format
  {
    username: required,
    accessToken: required
  }
  */
  const data = req.body;

  const session = await userModel.startSession();
  session.startTransaction();

  const tokenExpiry = new Date(conn.now());

  const user = await userModel.findOneAndUpdate(
    {
      username: data.username,
      isActive: true,
      isActivated: true,
      accessToken: data.accessToken,
      accessTokenExpiry: { $gt: tokenExpiry }
    },
    {
      accessTokenExpiry: tokenExpiry,
    },
    {
      new: true,
      session: session,
    }
  );

  await session.commitTransaction();
  session.endSession();
   
  if (user){
    return res.send(hpf.generalResponse(null, true, 'Logout!'));
  }
  else{
    return res.send(hpf.generalResponse(null, false, 'Invalid username or accessToken'));
  }
};

module.exports.activateUse = async (req, res, next) => {
  const data = req.params;
  const session = await userModel.startSession();
  session.startTransaction();

  const user = await userModel.findOneAndUpdate(
    {
      activateToken: data.activateToken,
      isActivated: false,
    },
    {
      isActive: true,
      isActivated: true,
    },
    {
      new: true,
      session: session,
    }
  );

  await session.commitTransaction();
  session.endSession();

  if (user) return res.send(hpf.generalResponse(user, true));
  return res.send(
    hpf.generalResponse(null, false, "Token not match to any docs or it already activated!")
  );
};

module.exports.sendActivationEmail = async (req, res, next) => {
  const data = req.body;

  const user = await userModel.findOne({
    activateToken: data.activateToken,
    isActive: false,
    isActivated: false,
  });

  try {
    let status = false;
    if (user) status = await user.sendActivationEmail();
    return res.send(hpf.generalResponse(null, status, ""));
  } catch (e) {
    return res.send(hpf.generalResponse(null, false, e.message));
  }
};

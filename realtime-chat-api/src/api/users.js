const userModel = require("../model/users");
const conn = require("../databases/mongo-connection");
const hpf = require("../helper-functions");
const redisCli = require("../utility/redis");

module.exports.createUser = async (req, res) => {
  /*
    data format
    {
      username: required,
      password: required,
      email: required,
      displayName: required
    }
    
    return format
    {
      data: user
      status: bool,
      msg: str
    }
  */
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

module.exports.login = async (req, res) => {
  /*
    data format
    {
      username: required,
      password: required
    }

    return format
    {
      data: {
        user: {
          username: str,
          displayName: str,
          lastOnlineAt: date
        },
        accessToken: str => {userId},
        refreshToken: str => {userId}
      },
      status: bool,
      msg: str
    }
  */

  const data = req.body;
  const session = await userModel.startSession();
  session.startTransaction();

  const user = await userModel
    .findOne({
      username: data.username,
      isActive: true,
      isActivated: true,
    })
    .session(session);

  if (user) {
    const isMatchPassword = await user.isMatchedPassword(data.password);

    if (isMatchPassword) {
      const newAccessToken = hpf.generateAccessJWT({ userId: user.id });
      const newRefreshToken = hpf.generateRefreshJWT({ userId: user.id });

      const dbTimeNow = new Date(conn.now());
      user.isOnline = true;
      user.lastOnlineAt = dbTimeNow;
      await user.save();

      await session.commitTransaction();
      session.endSession();

      let refreshTokenStore = await redisCli.get(`refreshToken`);
      // get objects with key is user.id and value is array of refresh token
      refreshTokenStore = await JSON.parse(refreshTokenStore);

      const key = user.id;
      if (refreshTokenStore) {
        console.log("refreshTokenStore")
        if (refreshTokenStore[key]) {
          console.log("refreshTokenStore key 1")
          refreshTokenStore[key].push(newRefreshToken);
        } else {
          console.log("refreshTokenStore key false")
          refreshTokenStore[key] = [newRefreshToken];
        }
      } else {
        refreshTokenStore = {
          key: [newRefreshToken]
        }
      }

      refreshTokenStore = await JSON.stringify(refreshTokenStore)
      await redisCli.set("refreshToken", refreshTokenStore);

      return res.send(
        hpf.generalResponse(
          {
            user: {
              username: user.username,
              displayName: hpf.decryptVal(user.displayName),
              lastOnlineAt: user.lastOnlineAt,
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          true
        )
      );
    } else {
      return res.send(hpf.generalResponse(null, false, "password not match."));
    }
  } else {
    return res.send(
      hpf.generalResponse(
        null,
        false,
        "username incorrect or this user is not activated yet."
      )
    );
  }
};

module.exports.logout = async (req, res) => {
  /*
  data format
  {
    username: required,
  }
  */
  const data = req.body;

  const session = await userModel.startSession();
  session.startTransaction();

  const user = await userModel.findOneAndUpdate(
    {
      username: data.username,
      isActive: true,
      isActivated: true,
    },
    {
      isOnline: false,
    },
    {
      new: true,
      session: session,
    }
  );

  await session.commitTransaction();
  session.endSession();

  if (user) {
    return res.send(hpf.generalResponse(null, true, "Logout!"));
  } else {
    return res.send(
      hpf.generalResponse(null, false, "Invalid username or system error.")
    );
  }
};

module.exports.activateUse = async (req, res) => {
  /*
  {
    activateToken: required
  }
  */
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
    hpf.generalResponse(
      null,
      false,
      "Token not match to any docs or it already activated!"
    )
  );
};

module.exports.sendActivationEmail = async (req, res) => {
  /*
  {
    activateToken: required
  }
  */
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

module.exports.getNewToken = (req, res) => {
  // check token is goten
  try {
    // got refresh token
    const token = req.headers["authorization"].split(" ")[1];

    // verify token is valid
    try {
      const data = hpf.veriftRefreshJWT(token);
      const newAccessToken = hpf.generateAccessJWT({ userId: data.userId });

      redisCli.SET;

      return res.send(hpf.generalResponse(newAccessToken, true));
    } catch (error) {
      return res
        .status(403)
        .send(hpf.generalResponse(null, false, "Invalid  refresh token"));
    }
  } catch (error) {
    return res
      .status(404)
      .send(hpf.generalResponse(null, false, "Missing refresh token"));
  }
};
const hpf = require("../helper-functions");

module.exports.test = (req, res, next) => {
  // console.log(req.cookies.refreshToken)
  const data = req.body;
  console.log(data)
  return res.send(hpf.generalResponse(null, true))
}
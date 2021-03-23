const userModel = require("../model/users");
const conn = require("../databases/mongo-connection");
const hpf = require("../helper-functions");

// verify JWT
module.exports.checkAccessJWT = (req, res, next) => {
    console.log('checkAccessJWT')
    try {
        // check must provide authorization
        const token = req.headers['authorization'].split(' ')[1]

        try {
            hpf.verifyAccessJWT(token)
        } catch (error) {
            if (error.name === "TokenExpiredError") return res.status(401).send(hpf.generalResponse(null, false, 'Token already expire'))
            else return res.status(401).send(hpf.generalResponse(null, false, 'Unauthorized access.'))
        }

    } catch (error) {
        return res.status(403).send(hpf.generalResponse(null, false, 'No authorization provide'))
    }
    next()
}
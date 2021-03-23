const roomModel = require('../model/rooms');
const conn = require('../databases/mongo-connection')
const hpf = require('../helper-functions');

module.exports.createRoom = async (req, res) => {
    /*
    data format
        {
            accessToken: str
        }
    */
    const data = req.body
    try {
      const session = await roomModel.startSession();
      session.startTransaction();
      
      const doc = await roomModel.create({
        
      }, {session})
  
      await session.commitTransaction();
      session.endSession();

      return res.send(hpf.generalResponse(doc, true))
    } catch (error) {
      return res.send(hpf.generalResponse(null, false, `create room failed, ${error}`))
    }
}
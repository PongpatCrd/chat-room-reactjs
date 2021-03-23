const conn = require("../databases/mongo-connection");
const ObjectId = conn.Schema.Types.ObjectId

const schema = new conn.Schema(
  {
    roomName: { type: String, unique: true, required: true },
    createdBy: { type: ObjectId, ref: "User", required: true },
    members: [{ type: ObjectId, ref: "User" }],
    msgs: [
      {
        msg: String,
        sender: { type: ObjectId, ref: "User" },
        readers: [{ type: ObjectId, ref: "User" }],
        timeStamp: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = conn.model("Rooms", schema);

const conn = require("../databases/mongo-connection");
const hpf = require("../helper-functions");

const schema = new conn.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    activateToken: { type: String, unique: true, required: true },
    isActivated: { type: Boolean, required: true, default: false },
    isOnline: { type: Boolean, required: true, default: false },
    lastOnlineAt: { type: Date, default: null }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

schema.pre("save", function(next) {
  console.log("pre save");
  try {
    if (this.isModified("password"))
      this.password = hpf.encryptVal(hpf.generateHash(this.password));
    if (this.isModified("displayName"))
      this.displayName = hpf.encryptVal(this.displayName);
    if (this.isModified("email"))
      this.email = hpf.encryptVal(this.email);
    next();
  } catch (e) {
    next(e);
  }
});

schema.pre("findOneAndUpdate", function(next) {
  console.log("pre findOneAndUpdate");
  try {
    if (this._update.password)
      this._update.password = hpf.encryptVal(hpf.generateHash(this._update.password));
    if (this._update.displayName)
      this._update.displayName = hpf.encryptVal(this._update.displayName);
    if (this._update.email)
      this._update.email = hpf.encryptVal(this._update.email);
    next();
  } catch (e) {
    next(e);
  }
});

schema.methods.isMatchedPassword = async function(candidatePassword) {
  if (candidatePassword != this.password) {
    const inputPassword = hpf.generateHash(candidatePassword)
    const dbPassword = hpf.decryptVal(this.password)
    return inputPassword === dbPassword;
  }
  else {
    return false
  }

};

schema.methods.sendActivationEmail = function() {
  const status = hpf.sendActivationEmail(this);
  return status;
}

module.exports = conn.model("User", schema);
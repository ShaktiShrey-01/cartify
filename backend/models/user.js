import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userschema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   role: { type: String, default: "user" },
   address:[{
    _id: false,
    buildingname:{type:String},
    colony:{type:String},
    city:{type:String},
    state:{type:String},
    pincode:{type:String},
   }],
  // Keep refresh token server-side for re-issuing access tokens.
  refreshtoken:{type:String},
   
   orders:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });
userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userschema.methods.isPasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}
userschema.methods.genarateaccesstoken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email,
      username: this.username,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
// NOTE: The controller calls `genaraterefreshtoken` (typo). Keep the same name.
userschema.methods.genaraterefreshtoken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}
const User = mongoose.model('User', userschema);
export default User;
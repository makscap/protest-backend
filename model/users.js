const User = require("./schemas/users");

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const updateById = async (id, data) => {
  return await User.findOneAndUpdate({ _id: id }, { ...data }, { new: true });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};
const findByVerifyToken = async (token) => {
  return await User.findOne({ verifyToken: token });
};

const updateVerifyToken = async (id, verify, token) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken: token });
};

const create = async ({ name, email, password, verify, verifyToken }) => {
  const user = new User({ name, email, password, verify, verifyToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatarURL: avatar });
};

module.exports = {
  updateById,
  findById,
  create,
  updateToken,
  findByEmail,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
};

const User = require("../models/userModel");
const Message = require("../models/messageModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password, isAvatarImageSet, avatarImage } =
      req.body;
    console.log(req.body);
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      isAvatarImageSet,
      avatarImage,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    const userMessages = await Promise.all(
      users.map(async (user) => {
        const latestMessage = await Message.findOne({
          users: { $all: [req.params.id, user._id] },
        })
          .sort({ createdAt: -1 }) 
          .select("createdAt"); 

        return {
          ...user._doc,
          latestMessageTime: latestMessage ? latestMessage.createdAt : null,
        };
      })
    );

    userMessages.sort((a, b) => {
      const timeA = a.latestMessageTime ? new Date(a.latestMessageTime) : 0;
      const timeB = b.latestMessageTime ? new Date(b.latestMessageTime) : 0;
      return timeB - timeA; 
    });

    return res.json(userMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAdminUser = async (req, res, next) => {
  try {
    const users = await User.findOne({ role: 1 }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json([users]);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

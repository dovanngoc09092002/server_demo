const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Users, Friendships, Messages, sequelize } = require("../models");
var jwt = require("jsonwebtoken");

export const userRegisterService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const checkUser = await Users.findOne({
        where: {
          username: body.username,
        },
      });
      if (checkUser) {
        reslove({
          errCode: 1,
          message: "Tài khoản đã tồn tại",
        });
      }
      const hash = bcrypt.hashSync(body.password, 12);
      const user = await Users.create({
        username: body.username,
        password: hash,
        name: body.name,
        avatar:
          "https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang-den.png",
        isactive: 0,
      });
      reslove({
        errCode: 0,
        message: "Tạo tài khoản thành công",
      });
    } catch (error) {
      reject(error);
    }
  });

//logins
export const userLoginService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const user = await Users.findOne({
        where: { username: body.username },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          message: "Tài khoản không tồn tại",
        });
      } else {
        const checkPassword = bcrypt.compareSync(body.password, user.password);
        if (!checkPassword) {
          reslove({
            errCode: 1,
            message: "Mật khẩu không đúng",
          });
        } else {
          delete user.password;
          const userUpdated = await Users.update(
            { isactive: true },
            { where: { id: user.id } }
          );

          const token = jwt.sign({ user: user }, "MYKEY", { expiresIn: "24h" });
          reslove({
            errCode: 0,
            message: "Đăng nhập thành công",
            token: token,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const userLogoutService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const user = await Users.findOne({
        where: { id: parseInt(body.idUser) },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          isLogout: false,
          message: "Tài khoản không tồn tại",
        });
      } else {
        const userUpdated = await Users.update(
          { isactive: false },
          { where: { id: user.id } }
        );
        reslove({
          errCode: 0,
          message: "Đăng xuất thành công",
          isLogout: true,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
export const userchangePassservice = (body) =>
 
  new Promise(async (reslove, reject) => {
    try {
      if(!body.currentPass || !body.newPass){
        reslove({
          errCode : 1,
          message : 'Cần điền đủ thông tin'
        })
      }
      const user = await Users.findOne({
        where: { id: parseInt(body.idUser) },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          isLogout: false,
          message: "Tài khoản không tồn tại",
        });
      } else {
        const checkPassword = bcrypt.compareSync(
          body.currentPass,
          user.password
        );
        if (!checkPassword) {
          reslove({
            errCode: 1,
            message: "Mật khẩu không đúng",
          });
        } else {
          const hash = bcrypt.hashSync(body.newPass, 12);
          const userUpdated = await Users.update(
            { password: hash },
            { where: { id: user.id } }
          );
          reslove({
            errCode: 0,
            message: "Đổi mật khẩu thành công",
            reLogin: true,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const userGetprofileService = (id) =>
  new Promise(async (reslove, reject) => {
    try {
      const user = await Users.findOne({
        where: { id: id },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 1,
          message: "Tài khoản không tồn tại",
        });
      }
      delete user.password;
      reslove({
        errCode: 0,
        message: "Thông tin tài khoản thành công",
        user: user,
      });
    } catch (error) {
      reject(error);
    }
  });

//update user
export const userUpdateService = (body) =>
  new Promise(async (reslove, reject) => {
    const decode = jwt.verify(body.token, "MYKEY");
    try {
      const user = await Users.findOne({
        where: {
          id: decode.user.id,
        },
        raw: true,
      });
      if (!user) {
        reslove({
          errCode: 404,
          message: "User not found",
        });
      }

      await Users.update(
        {
          name: body.name,
          avatar: body.avatar,
          username: body.username,
        },
        { where: { id: decode.user.id } }
      );

      reslove({
        errCode: 0,
        message: "Update Thành Công",
      });
    } catch (error) {
      reject(error);
    }
  });

export const userGetMessService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      function uniqueArray(orinalArray) {
        return orinalArray.filter((elem, position, arr) => {
          return arr.indexOf(elem) == position;
        });
      }
      let result = [];
      // Lấy ra danh sách bạn bè của người dùng
      const friendIds = await Friendships.findAll({
        attributes: ["status", "senderId", "receiverId"],
        where: {
          status: "accepted",
          [Op.or]: [{ senderId: body.userid }, { receiverId: body.userid }],
        },
      });

      // Chuyển đổi danh sách bạn bè thành một mảng các friendId
      const friendIdArray = friendIds.map((friendship) => {
        if (friendship.senderId === body.userid) {
          return friendship.receiverId;
        }

        if (friendship.receiverId === body.userid) {
          return friendship.senderId;
        }
      });

      const newarray = uniqueArray(friendIdArray);

      // Lấy ra danh sách các tin nhắn đã gửi hoặc nhận từ bạn bè

      for (let i = 0; i < newarray.length; i++) {
        const messages = await Messages.findAll({
          attributes: ["content", "senderId", "receiverId", "createdAt"],
          where: {
            [Op.or]: [
              { senderId: body.userid, receiverId: newarray[i] },
              { senderId: newarray[i], receiverId: body.userid },
            ],
          },
          include: [
            {
              model: Users,
              as: "userreceiver",
              attributes: ["id", "avatar", "username", "name"],
            },
            {
              model: Users,
              as: "usersender",
              attributes: ["id", "avatar", "username", "name"],
            },
          ],
          order: [["createdAt", "ASC"]],
        });
        result.push(messages[messages.length - 1]);
      }
      // // Lấy ra tin nhắn gần nhất giữa bạn và người bạn của mình

      reslove({
        errCode: 0,
        result,
      });
    } catch (error) {
      reject(error);
    }
  });

export const searchUser = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const users = await Users.findAll({
        where: {
          name: { [Op.like]: `%${body.search}%` },
          id: {
            [Op.ne]: body.idUser,
          },
        },
        limit: 4,
      });
      users.forEach((element) => {
        element.password = null;
      });
      reslove({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });

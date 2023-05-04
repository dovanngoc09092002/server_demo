var jwt = require("jsonwebtoken");

const { Posts, Users } = require("../models");

export const createPostService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const newpost = await Posts.create({
        UserId: body.id,
        postText: body.postText,
        postImage: body.postImage,
        likes: 0,
      });
      const post = await Posts.findOne({
        where: { id: newpost.id, UserId: newpost.UserId },
        include: {
          model: Users,
          as: "user",
        },
      });
      reslove({
        errCode: 0,
        message: "Tạo Bài Viết Thành Công",
        data: post,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsByidpostService = (id) =>
  new Promise(async (reslove, reject) => {
    try {
      const posts = await Posts.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["id", "username", "avatar", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      reslove({
        errCode: 0,
        data: posts,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsByIdService = (bodyId) =>
  new Promise(async (reslove, reject) => {
    const post = await Posts.findOne({
      where: {
        id: parseInt(bodyId.idPost),
        UserId: bodyId.idUser,
      },
      raw: true,
    });
    if (!post) {
      reslove({
        errCode: 1,
        message: "Không tìm thấy bài post của bạn",
      });
    }

    reslove({
      errCode: 0,
      message: "success",
      data: post,
    });

    try {
      reslove({
        errCode: 0,
        message: "success",
        bodyId,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePostsByIdService = (body) =>
  new Promise(async (reslove, reject) => {
    const post = await Posts.findOne({
      where: {
        id: parseInt(body.idPost),
        UserId: body.idUser,
      },
      raw: true,
    });
    if (!post) {
      reslove({
        errCode: 1,
        message: "Không tìm thấy bài post bạn có quyền sửa",
      });
    }
    const postUpdate = await Posts.update(
      {
        postText: body.postText,
        postImage: body.postImage,
      },
      {
        where: {
          id: parseInt(body.idPost),
          UserId: body.idUser,
        },
      }
    );

    reslove({
      errCode: 0,
      message: "success",
    });

    try {
      reslove({
        errCode: 0,
        message: "success",
        bodyId,
      });
    } catch (error) {
      reject(error);
    }
  });
export const getImagesService = (id) =>
  new Promise(async (reslove, reject) => {
    try {
      const newid = parseInt(id);
      const images = [];
      const result = await Posts.findAll({
        where: { UserId : newid },
        limit : 6
      })
      result.forEach((element) => { images.push(element.postImage) });



      reslove({
        data: images,
      });
    } catch (error) {
      reject(error);
    }
  });


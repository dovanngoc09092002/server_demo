import { rejects } from "assert";

const { Videos, Users } = require("../models");

export const createVideoService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const newVideo = await Videos.create({
        UserId: body.idUser,
        video: body.video,
        image: body.image,
      });

      reslove({
        errCode: 0,
        message: "Tạo Tin Thành Công",
        data: newVideo,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getVideoService = (body) =>
  new Promise(async (reslove, reject) => {
    try {
      const currentPage = body.page || 1;
      const perPage = body.limit;
      const offset = (currentPage - 1) * perPage;
      const results = await Videos.findAll({
        offset,
        limit: perPage,
        include: {
          model: Users,
          as: "user",
          attributes: ["id", "username", "avatar", "name"],
        },
        order: [["createdAt", "DESC"]],
      });

      const totalResults = await Videos.count();
      const totalPages = Math.ceil(totalResults / perPage);

      reslove({
        errCode: 0,
        message: "lấy Tin Thành Công",
        totalPages,
        results,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getVideoByIdService = (id) =>
  new Promise(async (reslove, reject) => {
    try {
      const result = await Videos.findOne({
        where: { id: id },
        include : {
          model : Users,
          as : 'user'
        }
      });

      if (!result) {
        reslove({
          errCode: 0,
          message: "Không tồn tại video",
        });
      } else {
        reslove({
          errCode: 0,
          message: "Lấy video bởi id thành công",
          data: result,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

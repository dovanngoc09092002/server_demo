const videoService = require("../services/videoService");

export const createVideoController = async (req, res) => {
  const { video, image } = req.body;

  const idUser = req.idUser;

  try {
    if (!video || !image) {
      return res.status(400).json({
        errCode: 1,
        message: "Không đủ dữ liệu",
      });
    }
    const body = {
      idUser: idUser,
      video: video,
      image: image,
    };
    const response = await videoService.createVideoService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getVideoController = async (req, res) => {
  const { page, limit } = req.query;

  const idUser = req.idUser;

  try {
    const body = {
      idUser: idUser,
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const response = await videoService.getVideoService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getVideoByIdController = async (req, res) => {
  const id = req.params.id;
  
  try {
    const response = await videoService.getVideoByIdService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

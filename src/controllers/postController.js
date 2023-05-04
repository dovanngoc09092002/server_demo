const postService = require("../services/postService");

export const createPostController = async (req, res) => {
  const { postText, postImage } = req.body;
  const body = {
    id: req.idUser,
    postText: postText,
    postImage: postImage,
  };

  try {
    const response = await postService.createPostService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getPostbyidpostController = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await postService.getPostsByidpostService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getPostbyidController = async (req, res) => {
  const id = req.idUser;
  const idPost = req.params.id;
  const bodyId = {
    idUser: id,
    idPost: idPost,
  };
  try {
    const response = await postService.getPostsByIdService(bodyId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

export const updatePostbyidController = async (req, res) => {
  const id = req.idUser;
  const idPost = req.params.id;
  const postText = req.body.postText;
  const postImage = req.body.postImage;

  const body = {
    idUser: id,
    idPost: idPost,
    postImage,
    postText,
  };
  try {
    const response = await postService.updatePostsByIdService(body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};
export const getimages = async (req, res) => {
  const id = req.idUser;
  try {
    const response = await postService.getImagesService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: "Lỗi server",
      error: error,
    });
  }
};

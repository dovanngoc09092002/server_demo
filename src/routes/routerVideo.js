const express = require("express");
const videoRouter = express.Router();
const videoControler = require("../controllers/videoController");
const { middlewareLogin } = require("../middware/middwareLogin");

//api tạo video mới
videoRouter.post("/create", middlewareLogin, videoControler.createVideoController);
module.exports = videoRouter;

//api lấy ra video theo trang 
videoRouter.get("/get", middlewareLogin, videoControler.getVideoController);
module.exports = videoRouter;

//api lấy video theo id
videoRouter.get("/getbyid/:id", videoControler.getVideoByIdController);
module.exports = videoRouter;

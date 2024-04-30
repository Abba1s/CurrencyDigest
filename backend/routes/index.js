const express = require("express");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
//_____________________________________________ ROUTES START_______________________________________________

//_____________________________________________USER ROUTES_______________________________
//register
router.post("/register", authController.register);
//login
router.post("/login", authController.login);
//logout
router.post("/logout", authMiddleware, authController.logout);
//refresh tokens
router.get("/refresh", authController.refresh);

//_____________________________________________BLOG ROUTES_______________________________
//create blog
router.post("/blog/create", authMiddleware, blogController.createBlog);
//All blogs
router.get("/blog/all", authMiddleware, blogController.allBlogs);
//blog by id
router.get("/blog/:id", authMiddleware, blogController.blogById);
//update blog by id
router.put("/blog", authMiddleware, blogController.updateBlog);
//delete blog by id
router.delete("/blog/:id", authMiddleware, blogController.deleteBlogById);

//_____________________________________________COMMENT ROUTES_______________________________
//create comment
router.post("/comment/create", authMiddleware, commentController.createComment);
//getting all comments on blog Id
router.get("/comment/:id", authMiddleware, commentController.getById);

//_____________________________________________ ROUTES END_____________________________________________________

module.exports = router;

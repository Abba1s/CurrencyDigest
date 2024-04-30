const Blog = require("../models/blog");
const Comment = require("../models/comment");
const BlogDTO = require("../dto/blog");
const BlogDetailDTO = require("../dto/blog-detail");
const JOI = require("joi");
const fs = require("fs");
const { BACKEND_SERVER_PATH } = require("../config/index");

var idRegex = /^[0-9a-fA-F]{24}$/;

const blogController = {
  //_____________________________________________CREATE BLOG API_______________________________
  async createBlog(req, res, next) {
    const createBlogSchema = JOI.object({
      title: JOI.string().required(),
      content: JOI.string().required(),
      author: JOI.string().regex(idRegex).required(),
      photoPath: JOI.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, content, photoPath, author } = req.body;
    const user = req.user;

    //read as buffer
    const buffer = Buffer.from(
      photoPath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    //random name
    const imagePath = `${Date.now()}-${author}.png`;
    //save locally
    try {
      fs.writeFileSync(`./storage/${imagePath}`, buffer);
    } catch (error) {
      next(error);
    }

    let newBlog;
    try {
      let blog = new Blog({
        title,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        author,
      });
      newBlog = await blog.save();
    } catch (error) {
      next(error);
    }

    const blogDto = new BlogDTO(newBlog);

    return res.status(200).json({ blog: blogDto });
  },
  //_____________________________________________ALL BLOGS API_______________________________

  async allBlogs(req, res, next) {
    try {
      const blogs = await Blog.find({});
      const blogDto = [];
      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogDto.push(dto);
      }

      return res.status(200).json({ blogs: blogDto });
    } catch (error) {
      next(error);
    }
  },
  //_____________________________________________SINGLE BLOG API_______________________________

  async blogById(req, res, next) {
    //validate id
    //response

    try {
      const { id } = req.params;
      const getByIdSchema = JOI.object({
        id: JOI.string().regex(idRegex).required(),
      });
      const { error } = getByIdSchema.validate(req.params);
      if (error) {
        next(error);
      }
      try {
        const blog = await Blog.findOne({ _id: id }).populate("author");

        if (!blog) {
          const error = {
            status: 404,
            message: "Blog not found",
          };
          return next(error);
        }

        const blogDetailDto = new BlogDetailDTO(blog);

        return res.status(200).json({ blog: blogDetailDto });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  },
  //_____________________________________________UPDATE BLOG API_______________________________

  async updateBlog(req, res, next) {
    //validate blog
    //delete prev photo if
    //save new photo
    //response

    try {
      const updateBlogSchema = JOI.object({
        title: JOI.string().required(),
        content: JOI.string().required(),
        author: JOI.string().regex(idRegex).required(),
        blogId: JOI.string().regex(idRegex).required(),
        photo: JOI.string().required(),
      });

      const { error } = updateBlogSchema.validate(req.body);

      const { title, content, author, blogId, photo } = req.body;
      if (error) {
        next(error);
      }
      try {
        const blog = await Blog.findOne({ _id: blogId });

        if (!blog) {
          const error = {
            status: 404,
            message: "Blog could not update !",
          };
          return next(error);
        }
        if (photo) {
          let prevPhoto = blog.photoPath;
          prevPhoto = prevPhoto.split("/").at(-1);
          fs.unlinkSync(`storage/${prevPhoto}`);
          //read as buffer
          const buffer = Buffer.from(
            photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
            "base64"
          );
          //random name
          const imagePath = `${Date.now()}-${author}.png`;
          //save locally
          try {
            fs.writeFileSync(`./storage/${imagePath}`, buffer);
          } catch (error) {
            next(error);
          }
          await Blog.updateOne(
            { _id: blogId },
            {
              title,
              content,
              photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
            }
          );
        } else {
          await Blog.updateOne(
            { _id: blogId },
            {
              title,
              content,
            }
          );
        }
      } catch (error) {
        next(error);
      }
      return res.status(200).json({ msg: "Blog Updated" });
    } catch (error) {
      next(error);
    }
  },
  //_____________________________________________DELETE BLOG API_______________________________
  async deleteBlogById(req, res, next) {
    //validate id
    const getByIdSchema = JOI.object({
      id: JOI.string().regex(idRegex).required(),
    });
    const { error } = getByIdSchema.validate(req.params);
    if (error) {
      next(error);
    }

    const { id } = req.params;
    try {
      await Blog.deleteOne({ _id: id });
      await Comment.deleteMany({ blog: id });
    } catch (error) {
      next(error);
    }

    return res.status(200).json({ msg: "Blog Deleted Successfully !" });
  },
};

module.exports = blogController;

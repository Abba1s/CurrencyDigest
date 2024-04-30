const Comment = require("../models/comment");
const CommentDTO = require("../dto/comment");
const JOI = require("joi");
var idRegex = /^[0-9a-fA-F]{24}$/;

const commentController = {
  //_____________________________________CREATE COMMENT API_________________________________
  async createComment(req, res, next) {
    const commentSchema = JOI.object({
      content: JOI.string().required(),
      blog: JOI.string().regex(idRegex).required(),
      author: JOI.string().regex(idRegex).required(),
    });

    const { error } = commentSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { content, blog, author } = req.body;
    let comment;
    try {
      let newComment = new Comment({ content, blog, author });
      comment = await newComment.save();
      if (!comment) {
        const error = {
          status: 409,
          message: "Comment not created !",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    return res.status(201).json({ msg: "Created Successfully !" });
  },
  //_____________________________________GET COMMENTS API_________________________________
  async getById(req, res, next) {
    const idSchema = JOI.object({
      id: JOI.string().regex(idRegex).required(),
    });

    const { error } = idSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { id } = req.params;
    let matchedComment;
    try {
      matchedComment = await Comment.find({ blog: id }).populate("author");
      if (matchedComment.length == 0) {
        matchedComment = "0 Comments !";
      }
    } catch (error) {
      return next(error);
    }
    let commentDto = [];

    for (let i = 0; i < matchedComment.length; i++) {
      const dto = new CommentDTO(matchedComment[i]);
      commentDto.push(dto);
    }
    return res.status(200).json({ data: commentDto });
    // return res.status(200).json({ data: matchedComment });
  },
};

module.exports = commentController;

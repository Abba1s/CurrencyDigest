class CommentDTO {
  constructor(comment) {
    (this.id = comment._id),
      (this.content = comment.content),
      (this.createdAt = comment.createdAt),
      (this.autorName = comment.author.name),
      (this.authorUsername = comment.author.username);
  }
}

module.exports = CommentDTO;

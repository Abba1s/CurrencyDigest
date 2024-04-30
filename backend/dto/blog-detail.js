class BlogDetailDTO {
  constructor(blog) {
    (this.id = blog._id),
      (this.title = blog.title),
      (this.content = blog.content),
      (this.photo = blog.photoPath),
      (this.createdAt = blog.createdAt),
      (this.autorName = blog.author.name),
      (this.authorUsername = blog.author.username);
  }
}

module.exports = BlogDetailDTO;

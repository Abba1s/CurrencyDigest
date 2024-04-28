//User Data Transfer Object

class UserDTO {
  constructor(user) {
    (this.id = user._id),
      (this.name = user.name),
      (this.username = user.username),
      (this.email = user.email);
  }
}
module.exports = UserDTO;

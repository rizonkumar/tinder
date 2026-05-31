const UserDto = require("./user-dto");

class AuthDto {
  constructor(user, token) {
    this.user = new UserDto(user);
    this.token = token;
  }
}

module.exports = AuthDto;

import UserDto from "./user-dto.js";

class AuthDto {
  constructor(user, token) {
    this.user = new UserDto(user);
    this.token = token;
  }
}

export default AuthDto;

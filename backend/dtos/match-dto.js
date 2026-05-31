import UserDto from "./user-dto.js";

class SwipeResultDto {
  constructor(result) {
    this.user = new UserDto(result.user);
    this.isMatch = !!result.isMatch;
    this.matchedUser = result.matchedUser ? new UserDto(result.matchedUser) : null;
    this.action = result.action;
  }
}

class ProfileDto {
  constructor(user, isSuperLikedByTarget = false) {
    const userObj = typeof user.toObject === "function" ? user.toObject() : user;
    this.id = userObj._id.toString();
    this._id = this.id;
    this.name = userObj.name;
    this.age = userObj.age;
    this.gender = userObj.gender;
    this.bio = userObj.bio || "";
    this.image = userObj.image || "";
    this.interests = userObj.interests || [];
    this.isSuperLikedByTarget = !!isSuperLikedByTarget;
  }
}

export { SwipeResultDto, ProfileDto };

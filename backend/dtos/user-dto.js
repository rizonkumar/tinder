class UserDto {
  constructor(user) {
    if (!user) return;
    const userObj =
      typeof user.toObject === "function" ? user.toObject() : user;

    this.id = userObj._id.toString();
    this.name = userObj.name;
    this.email = userObj.email;
    this.age = userObj.age;
    this.gender = userObj.gender;
    this.genderPreference = userObj.genderPreference;
    this.bio = userObj.bio || "";
    this.image = userObj.image || "";
    this.interests = userObj.interests || [];
    this.isGold = !!userObj.isGold;
    this.incognitoMode = !!userObj.incognitoMode;

    this.likes = this._mapUserReferences(userObj.likes);
    this.dislikes = this._mapUserReferences(userObj.dislikes);
    this.superLikes = this._mapUserReferences(userObj.superLikes);
    this.matches = this._mapUserReferences(userObj.matches);

    this.swipeHistory = (userObj.swipeHistory || []).map((item) => ({
      user: item.user ? item.user.toString() : null,
      action: item.action,
      timestamp: item.timestamp,
    }));

    this.createdAt = userObj.createdAt;
    this.updatedAt = userObj.updatedAt;
  }

  _mapUserReferences(refs) {
    if (!refs) return [];
    return refs
      .map((ref) => {
        if (!ref) return null;
        if (typeof ref === "object" && ref._id) {
          return {
            id: ref._id.toString(),
            name: ref.name,
            image: ref.image || "",
            bio: ref.bio || "",
            age: ref.age,
          };
        }
        return ref.toString();
      })
      .filter(Boolean);
  }
}

module.exports = UserDto;

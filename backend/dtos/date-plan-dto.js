class DatePlanDto {
  constructor(datePlan) {
    if (!datePlan) return;
    const doc = typeof datePlan.toObject === "function" ? datePlan.toObject() : datePlan;

    this.id = doc._id.toString();
    this._id = this.id;
    this.userA = this._mapUserRef(doc.userA);
    this.userB = this._mapUserRef(doc.userB);
    this.categoryVotes = doc.categoryVotes
      ? doc.categoryVotes.map((v) => ({
          userId: v.user.toString(),
          category: v.category,
        }))
      : [];
    this.venueProposals = doc.venueProposals
      ? doc.venueProposals.map((v) => ({
          id: v.id,
          proposedBy: v.proposedBy.toString(),
          title: v.title,
          location: v.location,
          votes: v.votes ? v.votes.map((vt) => vt.toString()) : [],
        }))
      : [];
    this.dateTimeProposals = doc.dateTimeProposals
      ? doc.dateTimeProposals.map((t) => ({
          id: t.id,
          proposedBy: t.proposedBy.toString(),
          date: t.date,
          time: t.time,
          votes: t.votes ? t.votes.map((vt) => vt.toString()) : [],
        }))
      : [];
    this.finalVenue = doc.finalVenue || null;
    this.finalDateTime = doc.finalDateTime || null;
    this.status = doc.status;
    this.createdAt = doc.createdAt;
    this.updatedAt = doc.updatedAt;
  }

  _mapUserRef(ref) {
    if (!ref) return null;
    if (typeof ref === "object" && ref._id) {
      return {
        id: ref._id.toString(),
        _id: ref._id.toString(),
        name: ref.name,
        image: ref.image || "",
      };
    }
    return ref.toString();
  }
}

export default DatePlanDto;

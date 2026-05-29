const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getDeterministicVibe = (idA, idB, seed) => {
  const sortedIds = [idA, idB].sort().join("-");
  return hashCode(sortedIds + seed) % 100;
};

const getUserSchedule = (userId) => {
  return hashCode(userId + "schedule") % 2 === 0 ? "Night Owl" : "Early Bird";
};

export const calculateCompatibility = (userA, userB) => {
  if (!userA || !userB) {
    return {
      scores: {
        socialHobbies: 70,
        culturalVibes: 70,
        activeHours: 70,
        ageFit: 70,
        conversationEnergy: 70,
      },
      metadata: {
        sharedInterests: [],
        scheduleA: "Night Owl",
        scheduleB: "Night Owl",
        ageDiff: 0,
        overallScore: 70,
      },
    };
  }

  const idA = userA._id || "userA";
  const idB = userB._id || "userB";

  const interestsA = userA.interests || [];
  const interestsB = userB.interests || [];
  const sharedInterests = interestsA.filter((i) =>
    interestsB.some((j) => j.toLowerCase() === i.toLowerCase()),
  );

  let socialHobbies = 0;
  if (sharedInterests.length > 0) {
    socialHobbies = 50 + Math.min(5, sharedInterests.length) * 10;
  } else {
    socialHobbies = 55 + (getDeterministicVibe(idA, idB, "social") % 16);
  }

  let culturalVibes = 60 + (getDeterministicVibe(idA, idB, "cultural") % 31);
  culturalVibes += Math.min(4, sharedInterests.length) * 2.5;
  culturalVibes = Math.min(100, culturalVibes);

  const scheduleA = getUserSchedule(idA);
  const scheduleB = getUserSchedule(idB);
  let activeHours = 0;
  if (scheduleA === scheduleB) {
    activeHours = 85 + (getDeterministicVibe(idA, idB, "hours") % 14);
  } else {
    activeHours = 65 + (getDeterministicVibe(idA, idB, "hours") % 16);
  }

  const ageA = userA.age || 25;
  const ageB = userB.age || 25;
  const ageDiff = Math.abs(ageA - ageB);
  const ageFit = Math.max(50, 100 - ageDiff * 5);

  let conversationEnergy = 70 + (getDeterministicVibe(idA, idB, "energy") % 26);
  const bioA = userA.bio || "";
  const bioB = userB.bio || "";
  if (bioA.length > 30 && bioB.length > 30) {
    conversationEnergy += 5;
  }
  conversationEnergy = Math.min(100, conversationEnergy);

  const roundedSocial = Math.round(socialHobbies);
  const roundedCultural = Math.round(culturalVibes);
  const roundedActive = Math.round(activeHours);
  const roundedAge = Math.round(ageFit);
  const roundedEnergy = Math.round(conversationEnergy);

  const overallScore = Math.round(
    (roundedSocial +
      roundedCultural +
      roundedActive +
      roundedAge +
      roundedEnergy) /
      5,
  );

  return {
    scores: {
      socialHobbies: roundedSocial,
      culturalVibes: roundedCultural,
      activeHours: roundedActive,
      ageFit: roundedAge,
      conversationEnergy: roundedEnergy,
    },
    metadata: {
      sharedInterests,
      scheduleA,
      scheduleB,
      ageDiff,
      overallScore,
    },
  };
};

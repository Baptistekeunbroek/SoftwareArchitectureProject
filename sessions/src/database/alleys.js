const alleys = [
  {
    parkId: 1,
    alleyNb: 1,
    qrCode: "anubfajncajikclxjkqnujg",
    isInUse: false,
  },
];

const findFreeAlley = (parkId) =>
  alleys.find((alley) => alley.isInUse === false && alley.parkId === parkId);

const modifyAlley = (parkId, alleyNb, isInUse) => {
  const alley = alleys.find(
    (alley) => alley.parkId === parkId && alleyNb === alley.alleyNb
  );
  if (!alley) return false;
  const alleyIndex = alleys.findIndex(
    (alley) => alley.parkId === parkId && alleyNb === alley.alleyNb
  );
  alleys[alleyIndex] = { ...alley, isInUse };
  return true;
};

module.exports = {
  findFreeAlley,
  modifyAlley,
};

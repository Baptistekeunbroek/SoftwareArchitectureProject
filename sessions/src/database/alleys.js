const alleys = [
  {
    parkId: 1,
    alleyNb: 1,
    qrCode: "thisisaqrcodecodecode",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 2,
    qrCode: "anotherqrcodecode",
    isInUse: false,
  },
];

const findAvailableAlley = (parkId) => {
  const availableAlley = alleys.find(
    (alley) => alley.isInUse === false && alley.parkId === parkId
  );
  return availableAlley;
};

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
  findAvailableAlley,
  modifyAlley,
};

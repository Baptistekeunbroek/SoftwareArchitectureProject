const alleys = [
  {
    parkId: 1,
    alleyNb: 1,
    qrCode: "thisisaqrcodecodecode",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 1,
    qrCode: "anotherqrcodecode",
    isInUse: false,
  },
];

const findAvailableAlley = (parkId) => {
  console.log("Searching for available alley for park ID:", parkId);
  console.log("All alleys:", alleys);

  const availableAlley = alleys.find(
    (alley) => alley.isInUse === false && alley.parkId === parkId
  );

  if (availableAlley) {
    console.log("Available alley found:", availableAlley);
  } else {
    console.log("No available alley found for park ID:", parkId);
  }

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

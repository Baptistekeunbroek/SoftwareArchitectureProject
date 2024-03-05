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
    qrCode: "qrcode1",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 2,
    qrCode: "anotherqrcodecode",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 3,
    qrCode: "qrcode3",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 4,
    qrCode: "qrcode4",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 5,
    qrCode: "qrcode5",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 6,
    qrCode: "qrcode6",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 7,
    qrCode: "qrcode7",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 8,
    qrCode: "qrcode8",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 9,
    qrCode: "qrcode9",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 10,
    qrCode: "qrcode10",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 11,
    qrCode: "qrcode11",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 12,
    qrCode: "qrcode12",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 13,
    qrCode: "qrcode13",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 14,
    qrCode: "qrcode14",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 15,
    qrCode: "qrcode15",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 16,
    qrCode: "qrcode16",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 17,
    qrCode: "qrcode17",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 18,
    qrCode: "qrcode18",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 19,
    qrCode: "qrcode19",
    isInUse: false,
  },
  {
    parkId: 2,
    alleyNb: 20,
    qrCode: "qrcode20",
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

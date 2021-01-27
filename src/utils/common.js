const getRandomInteger = (min, max) => min + Math.floor(Math.random() * (max + 1 - min));

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export {
  getRandomInteger,
  getRandomItem
};

import dayjs from 'dayjs';

const pointsSortDate = (a, b) => dayjs(b.date).diff(dayjs(a.date));

const pointsSortDuration = (a, b) => {
  const durationA = dayjs(a.timeEnd).diff(a.timeStart, `minute`);
  const durationB = dayjs(b.timeEnd).diff(b.timeStart, `minute`);
  return durationA - durationB;
};

const pointsSortPrice = (a, b) => a.price - b.price;

export {
  pointsSortDate,
  pointsSortDuration,
  pointsSortPrice
};

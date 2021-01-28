import dayjs from "dayjs";
import {FilterType} from "../const";

const isPastPoint = (point) => {
  return point.date < dayjs();
};
const isFuturePoint = (point) => {
  return point.date > dayjs();
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point))
};
export {
  filter
};

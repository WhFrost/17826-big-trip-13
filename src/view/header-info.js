import dayjs from 'dayjs';
// import {points} from '../mock/point.js';
import {pointsSortDate} from '../utils/sort.js';
import AbstractView from '../view/abstract.js';

const createInfo = (points) => {
  let cities = points.reduce((total, current) => total.city + ` &mdash; ` + current.city);
  if (points.length > 3) {
    cities = points[0].city + ` &mdash; ... &mdash; ` + points[points.length - 1].city;
  }
  points.sort(pointsSortDate);
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${cities}</h1>
  <p class="trip-info__dates">${dayjs(points[0].date).format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dayjs(points[points.length - 1].date).format(`DD`)}</p>
  </div>`;
};

export default class HeaderInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }
  getTemplate() {
    return createInfo(this._points);
  }
}

import dayjs from 'dayjs';
import AbstractView from '../view/abstract.js';

const renderTemplateOffers = (offers) => {
  let str = ``;
  if (offers.length > 0) {
    offers.forEach((offer) => {
      str += `<li class="event__offer">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
    </li>`;
    });
  }
  return str;
};

const createPoint = (point) => {
  const {date, type, city, timeStart, timeEnd, price, offers, isFavorite} = point;
  const title = `${type} ${city}`;

  const getDuration = (startTime, endTime) => {
    let str = ``;
    const diff = dayjs(endTime).diff(startTime, `minute`);
    if (diff / 60 <= 0) {
      str += diff;
    }
    str += Math.trunc(diff / 60) + `H ` + (diff % 60) + `M`;
    return str;
  };
  const duration = getDuration(timeStart, timeEnd);

  const offersList = renderTemplateOffers(offers);

  const favoriteClassName = isFavorite
    ? `event__favorite-btn event__favorite-btn--active`
    : `event__favorite-btn`;

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${date}">${dayjs(date).format(`MMM DD`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${title}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${timeStart}">${dayjs(timeStart).format(`HH:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${timeEnd}">${dayjs(timeEnd).format(`HH:mm`)}</time>
      </p>
      <p class="event__duration">${duration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersList}
    </ul>
    <button class="${favoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }
  getTemplate() {
    return createPoint(this._point);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }
  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}

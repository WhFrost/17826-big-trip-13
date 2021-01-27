import dayjs from 'dayjs';
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {pointTypes, citiesList, offersList} from '../mock/point.js';
import SmartView from '../view/smart.js';

const createPointTypesTemplate = (currentPointType, defaultPointTypes) => {
  return defaultPointTypes.map((type) => `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
    value="${type.toLowerCase()}"
    ${currentPointType === type ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>`).join(``);
};

const createPointCitiesTemplate = (cities) => {
  return cities.reduce((total, current) => total + `<option value="${current}"></option>`, `<datalist id="destination-list-1">`) + `</datalist>`;
};

const createPointDateTemplate = (timeStart, timeEnd) => {
  return `<div class="event__field-group  event__field-group--time">
  <label class="visually-hidden" for="event-start-time-1">From</label>
  <input class="event__input  event__input--time" id="event-start-time-1" type="text"
  name="event-start-time" value="${dayjs(timeStart).format(`DD/MM/YY HH:mm`)}">
  &mdash;
  <label class="visually-hidden" for="event-end-time-1">To</label>
  <input class="event__input  event__input--time" id="event-end-time-1" type="text"
  name="event-end-time" value="${dayjs(timeEnd).format(`DD/MM/YY HH:mm`)}">
  </div>`;
};

const createPointDescriptionTemplate = (description) => {
  if (description.length > 0) {
    return description.reduce((total, current) => total + current + ` `, `<p class="event__destination-description">`) + `</p>`;
  }
  return ``;
};

const createPointOffersTemplate = (defaultOffers, checkedOffers) => {
  if (checkedOffers.length > 0) {
    return defaultOffers.reduce((total, current) => total +
    `<div class="event__offer-selector">
       <input class="event__offer-checkbox  visually-hidden" id="event-offer-${current.id}" type="checkbox" name="event-offer-${current.id}" ${checkedOffers.includes(current) ? `checked` : ``}>
       <label class="event__offer-label" for="event-offer-${current.id}">
         <span class="event__offer-title">${current.name}</span>
         &plus;&euro;&nbsp;
         <span class="event__offer-price">${current.cost}</span>
       </label>
     </div>`,
    `<section class="event__section  event__section--offers">
         <h3 class="event__section-title  event__section-title--offers">Offers</h3>
         <div class="event__available-offers">`) + `</div></section>`;
  }
  return ``;
};

const createPointPhotosTemplate = (photos) => {
  if (photos.length > 0) {
    return photos.reduce((total, current) => total + `<img class="event__photo" src="${current}.jpg" alt="Event photo">`,
        `<div class="event__photos-container"><div class="event__photos-tape">`) + `</div></div>`;
  }
  return ``;
};

const createEditPointForm = (data) => {
  const {type, city, timeStart, timeEnd, price, offers} = data;
  const {description, photos} = data.destination;

  const citiesTemplate = createPointCitiesTemplate(citiesList);
  const dateTemplate = createPointDateTemplate(timeStart, timeEnd);
  const offersTemplate = createPointOffersTemplate(offersList, offers);
  const descriptionTemplate = createPointDescriptionTemplate(description);
  const photosTemplate = createPointPhotosTemplate(photos);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createPointTypesTemplate(type, pointTypes)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          ${citiesTemplate}
      </div>
        ${dateTemplate}
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${descriptionTemplate}
          ${photosTemplate}
        </section>
    </section>
  </form>
</li>`;
};

export default class EditPointForm extends SmartView {
  constructor(point) {
    super();
    this._data = EditPointForm.parsePointToData(point);
    this._timeStartPicker = null;
    this._timeEndPicker = null;
    this._editFormClickHandler = this._editFormClickHandler.bind(this);
    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._editFormTypeChangeHandler = this._editFormTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._timeStartChangeHandler = this._timeStartChangeHandler.bind(this);
    this._timeEndChangeHandler = this._timeEndChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._setInnerHandlers();
    this._setTimeStartPicker();
    this._setTimeEndPicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  removeElement() {
    super.removeElement();

    if (this._timeStartPicker) {
      this._timeStartPicker.destroy();
      this._timeStartPicker = null;
    }
    if (this._timeEndPicker) {
      this._timeEndPicker.destroy();
      this._timeEndPicker = null;
    }
  }
  reset(point) {
    this.updateData(EditPointForm.parsePointToData(point));
  }
  getTemplate() {
    return createEditPointForm(this._data);
  }
  restoreHandlers() {
    this._setInnerHandlers();
    this.setEditFormClickHandler(this._callback.click);
    this.setEditFormSubmitHandler(this._callback.editFormSubmit);
    this._setTimeStartPicker();
    this._setTimeEndPicker();
  }

  _setTimeStartPicker() {
    if (this._timeStartPicker) {
      this._timeStartPicker.destroy();
      this._timeStartPicker = null;
    }
    this._timeStartPicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/Y H:i`,
          defaultDate: dayjs(this._data.timeStart).toDate(),
          enableTime: true,
          onChange: this._timeStartChangeHandler
        }
    );
  }
  _setTimeEndPicker() {
    if (this._timeEndPicker) {
      this._timeEndPicker.destroy();
      this._timeEndPicker = null;
    }
    this._timeEndPicker = flatpickr(this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/Y H:i`,
          defaultDate: dayjs(this._data.timeEnd).toDate(),
          enableTime: true,
          minDate: new Date(),
          onChange: this._timeEndChangeHandler
        }
    );
  }
  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._editFormTypeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceInputHandler);
  }

  _editFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }
  _editFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.editFormSubmit(EditPointForm.parseDataToPoint(this._data));
  }
  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPointForm.parseDataToPoint(this._data));
  }
  _editFormTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }
  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value,
    }, true);
  }
  _timeStartChangeHandler([userDate]) {
    this.updateData({
      timeStart: dayjs(userDate).second(59).toDate(),
    }, true
    );
  }
  _timeEndChangeHandler([userDate]) {
    this.updateData({
      timeEnd: dayjs(userDate).second(59).toDate(),
    }, true
    );
  }
  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  setEditFormClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editFormClickHandler);
  }
  setEditFormSubmitHandler(callback) {
    this._callback.editFormSubmit = callback;
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._editFormSubmitHandler);
  }
  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }
  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }
}

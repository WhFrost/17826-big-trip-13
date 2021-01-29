import AddPointFormView from '../view/add-point.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {generatePoint} from '../mock/point.js';
import {UpdateType, UserAction} from '../const.js';
import {nanoid} from 'nanoid';

export default class AddForm {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._addPointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }
  init() {
    if (this._addPointFormComponent !== null) {
      return;
    }

    this._addPointFormComponent = new AddPointFormView(generatePoint());
    this._addPointFormComponent.setAddFormSubmitHandler(this._handleFormSubmit);
    this._addPointFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._addPointFormComponent, RenderPosition.AFTERBEGIN, this._pointListContainer);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._addPointFormComponent === null) {
      return;
    }
    remove(this._addPointFormComponent);
    this._addPointFormComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, point)
    );
    this.destroy();
  }
  _handleDeleteClick() {
    this.destroy();
  }
  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

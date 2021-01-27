import PointView from '../view/point.js';
import EditPointFormView from '../view/edit-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  LIST: `LIST`,
  EDITING: `EDITING`
};

export default class Points {
  constructor(pointsContainer, changeData, changeMode) {
    this._pointsContainer = pointsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointFormComponent = null;
    this._mode = Mode.LIST;

    this._setClickHandler = this._setClickHandler.bind(this);
    this._editFormEscHandler = this._editFormEscHandler.bind(this);
    this._setEditFormClickHandler = this._setEditFormClickHandler.bind(this);
    this._setEditFormSubmitHandler = this._setEditFormSubmitHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointFormComponent = this._editPointFormComponent;

    this._pointComponent = new PointView(point);
    this._editPointFormComponent = new EditPointFormView(point);

    this._pointComponent.setClickHandler(this._setClickHandler);
    this._editPointFormComponent.setEditFormClickHandler(this._setEditFormClickHandler);
    this._editPointFormComponent.setEditFormSubmitHandler(this._setEditFormSubmitHandler);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevEditPointFormComponent === null) {
      render(this._pointComponent, RenderPosition.AFTERBEGIN, this._pointsContainer);
      return;
    } else if (this._mode === Mode.LIST) {
      replace(this._pointComponent, prevPointComponent);
    } else if (this._mode === Mode.EDITING) {
      replace(this._editPointFormComponent, prevEditPointFormComponent);
    }
    remove(prevPointComponent);
    remove(prevEditPointFormComponent);
  }
  destroy() {
    remove(this._pointComponent);
    remove(this._editPointFormComponent);
  }
  resetView() {
    if (this._mode !== Mode.LIST) {
      this._replaceEditFormToPoint();
    }
  }
  _replacePointToEditForm() {
    replace(this._editPointFormComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._editFormEscHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }
  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._editPointFormComponent);
    document.removeEventListener(`keydown`, this._editFormEscHandler);
    this._mode = Mode.LIST;
  }
  _editFormEscHandler(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._editPointFormComponent.reset(this._point);
      this._replaceEditFormToPoint();
    }
  }
  _setClickHandler() {
    this._replacePointToEditForm();
  }

  _setEditFormClickHandler() {
    this._replaceEditFormToPoint();
  }
  _setEditFormSubmitHandler(point) {
    this._replaceEditFormToPoint();
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point);
  }
  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite})
    );
  }
}

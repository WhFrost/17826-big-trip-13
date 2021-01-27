import {RenderPosition, render, remove} from '../utils/render.js';
import {pointsSortDate, pointsSortDuration, pointsSortPrice} from '../utils/sort.js';
import TripInfoView from '../view/trip-info.js';
import HeaderInfoView from '../view/header-info.js';
import HeaderCostView from '../view/cost.js';
import TripControlsView from '../view/trip-controls.js';
import MenuView from '../view/menu.js';
import FiltersView from '../view/filters.js';
import AddPointButtonView from '../view/add-point-button.js';
import TripEventsView from '../view/trip-events.js';
import EventsSortView from '../view/events-sort.js';
import EventsListView from '../view/events-list.js';
import NoPointsView from '../view/no-points.js';
import AddPointFormView from '../view/add-point.js';
import {generatePoint} from '../mock/point.js';
import PointPresenter from './point.js';
import {SORT_TYPE, UpdateType, UserAction} from '../const.js';

export default class Trip {
  constructor(tripContainer, pointsContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripContainer = tripContainer;
    this._pointsContainer = pointsContainer;
    this._pointPresenter = {};
    this._currentSortType = SORT_TYPE.DAY;

    this._eventsSort = null;

    this._tripInfo = new TripInfoView();
    this._tripControls = new TripControlsView();
    this._menu = new MenuView();
    this._filters = new FiltersView();
    this._addPointButton = new AddPointButtonView();
    this._tripEvents = new TripEventsView();
    this._eventsList = new EventsListView();
    this._noPoints = new NoPointsView();

    this._setAddButtonClickHandler = this._setAddButtonClickHandler.bind(this);
    this._addFormEscHandler = this._addFormEscHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripInfo();
    this._renderTripControls();
    this._renderAddPointButton();
    this._renderTripEvents();
    this._renderAddPointForm();

    this._addPointButton.setAddButtonClickHandler(this._setAddButtonClickHandler);
  }
  _getPoints() {
    switch (this._currentSortType) {
      case SORT_TYPE.DAY:
        return this._pointsModel.getPoints().sort(pointsSortDate);
      case SORT_TYPE.TIME:
        return this._pointsModel.getPoints().sort(pointsSortDuration);
      case SORT_TYPE.PRICE:
        return this._pointsModel.getPoints().sort(pointsSortPrice);
    }
    return this._pointsModel.getPoints();
  }
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPointList();
        this._renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this._clearPointList({resetSortType: true});
        this._renderTripEvents();
        break;
    }
  }
  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearPointList();
    this._renderTripEvents();
  }
  _renderTripInfo() {
    render(this._tripInfo, RenderPosition.BEFOREEND, this._tripContainer);
    this._renderHeaderInfo();
    this._renderHeaderCost();
  }
  _renderHeaderInfo() {
    this._headerInfo = new HeaderInfoView(this._getPoints());
    render(this._headerInfo, RenderPosition.AFTERBEGIN, this._tripInfo);
  }
  _renderHeaderCost() {
    this._headerCost = new HeaderCostView(this._getPoints());
    render(this._headerCost, RenderPosition.BEFOREEND, this._tripInfo);
  }
  _renderTripControls() {
    render(this._tripControls, RenderPosition.BEFOREEND, this._tripContainer);
    this._renderMenu();
    this._renderFilters();
  }
  _renderMenu() {
    render(this._menu, RenderPosition.AFTERBEGIN, this._tripControls);
  }
  _renderFilters() {
    render(this._filters, RenderPosition.BEFOREEND, this._tripControls);
  }
  _renderAddPointButton() {
    render(this._addPointButton, RenderPosition.BEFOREEND, this._tripContainer);
  }

  _addFormEscHandler(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      remove(this._addPointForm);
      document.removeEventListener(`keydown`, this._addFormEscHandler);
    }
  }
  _setAddButtonClickHandler(points) {
    if (points.length === 0) {
      render(this._addPointForm, RenderPosition.AFTERBEGIN, this._tripEvents);
    }
    render(this._addPointForm, RenderPosition.AFTERBEGIN, this._eventsList);
    document.addEventListener(`keydown`, this._addFormEscHandler);
  }
  _renderTripEvents() {
    render(this._tripEvents, RenderPosition.AFTERBEGIN, this._pointsContainer);
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
    } else {
      this._renderEventsSort();
      this._renderEventsList();
      this._renderPoints();
    }
  }
  _renderEventsSort() {
    if (this._eventsSort !== null) {
      this._eventsSort = null;
    }
    this._eventsSort = new EventsSortView(this._currentSortType);
    this._eventsSort.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._eventsSort, RenderPosition.AFTERBEGIN, this._tripEvents);
  }
  _renderEventsList() {
    render(this._eventsList, RenderPosition.BEFOREEND, this._tripEvents);
  }
  _renderNoPoints() {
    render(this._noPoints, RenderPosition.AFTERBEGIN, this._tripEvents);
  }
  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsList, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }
  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point);
    });
  }
  _renderAddPointForm() {
    this._addPointForm = new AddPointFormView(generatePoint());
  }
  _clearPointList({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._eventsSort);
    remove(this._noPoints);

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DAY;
    }
  }
}

import {RenderPosition, render, remove} from '../utils/render.js';
import {pointsSortDate, pointsSortDuration, pointsSortPrice} from '../utils/sort.js';
import {updatedItem} from '../utils/common.js';
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
import {SORT_TYPE} from '../const.js';

export default class Trip {
  constructor(tripContainer, pointsContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripContainer = tripContainer;
    this._pointsContainer = pointsContainer;
    this._pointPresenter = {};
    this._currentSortType = SORT_TYPE.DAY;

    this._tripInfo = new TripInfoView();
    this._tripControls = new TripControlsView();
    this._menu = new MenuView();
    this._filters = new FiltersView();
    this._addPointButton = new AddPointButtonView();
    this._tripEvents = new TripEventsView();
    this._eventsList = new EventsListView();
    this._noPoints = new NoPointsView();
    this._eventsSort = new EventsSortView();

    this._setAddButtonClickHandler = this._setAddButtonClickHandler.bind(this);
    this._addFormEscHandler = this._addFormEscHandler.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points;
    this._renderTripInfo();
    this._renderTripControls();
    this._renderAddPointButton();
    this._renderTripEvents();
    this._renderAddPointForm();
    this._sortPoints();

    this._addPointButton.setAddButtonClickHandler(this._setAddButtonClickHandler);
  }
  _handlePointChange(updatedPoint) {
    this._points = updatedItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }
  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }
  _sortPoints(sortType) {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this._points.sort(pointsSortDate);
        break;
      case SORT_TYPE.TIME:
        this._points.sort(pointsSortDuration);
        break;
      case SORT_TYPE.PRICE:
        this._points.sort(pointsSortPrice);
        break;
    }
    this._currentSortType = sortType;
  }
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPoints();
  }
  _renderTripInfo() {
    render(this._tripInfo, RenderPosition.BEFOREEND, this._tripContainer);
    this._renderHeaderInfo();
    this._renderHeaderCost();
  }
  _renderHeaderInfo() {
    this._headerInfo = new HeaderInfoView(this._points);
    render(this._headerInfo, RenderPosition.AFTERBEGIN, this._tripInfo);
  }
  _renderHeaderCost() {
    this._headerCost = new HeaderCostView(this._points);
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
  _setAddButtonClickHandler() {
    if (this._points.length === 0) {
      render(this._addPointForm, RenderPosition.AFTERBEGIN, this._tripEvents);
    }
    render(this._addPointForm, RenderPosition.AFTERBEGIN, this._eventsList);
    document.addEventListener(`keydown`, this._addFormEscHandler);
  }
  _renderTripEvents() {
    render(this._tripEvents, RenderPosition.AFTERBEGIN, this._pointsContainer);
    if (this._points.length === 0) {
      this._renderNoPoints();
    } else {
      this._renderEventsSort();
      this._renderEventsList();
      this._renderPoints();
    }
  }
  _renderEventsSort() {
    render(this._eventsSort, RenderPosition.AFTERBEGIN, this._tripEvents);
    this._eventsSort.setSortTypeChangeHandler(this._handleSortTypeChange);
  }
  _renderEventsList() {
    render(this._eventsList, RenderPosition.BEFOREEND, this._tripEvents);
  }
  _renderNoPoints() {
    render(this._noPoints, RenderPosition.AFTERBEGIN, this._tripEvents);
  }
  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._eventsList, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }
  _renderPoints() {
    this._points.forEach((point) => {
      this._renderPoint(point);
    });
  }
  _renderAddPointForm() {
    this._addPointForm = new AddPointFormView(generatePoint());
  }
  _clearPointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }
}

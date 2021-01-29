import {RenderPosition, render, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {pointsSortDate, pointsSortDuration, pointsSortPrice} from '../utils/sort.js';
import TripEventsView from '../view/trip-events.js';
import EventsSortView from '../view/events-sort.js';
import EventsListView from '../view/events-list.js';
import NoPointsView from '../view/no-points.js';
import PointPresenter from './point.js';
import AddPointFormPresenter from './add-point.js';
import {SORT_TYPE, UpdateType, UserAction, FilterType} from '../const.js';

export default class Trip {
  constructor(pointsContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointsContainer = pointsContainer;
    this._pointPresenter = {};
    this._currentSortType = SORT_TYPE.DAY;

    this._eventsSort = null;

    this._tripEvents = new TripEventsView();
    this._eventsList = new EventsListView();
    this._noPoints = new NoPointsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._addPointFormPresenter = new AddPointFormPresenter(this._eventsList, this._handleViewAction);
  }

  init() {
    this._renderTripEvents();
  }

  addPoint() {
    this._currentSortType = SORT_TYPE.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    remove(this._noPoints);
    this._addPointFormPresenter.init();
  }
  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SORT_TYPE.DAY:
        return filteredPoints.sort(pointsSortDate);
      case SORT_TYPE.TIME:
        return filteredPoints.sort(pointsSortDuration);
      case SORT_TYPE.PRICE:
        return filteredPoints.sort(pointsSortPrice);
    }
    return filteredPoints;
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
    this._addPointFormPresenter.destroy();
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

  _clearPointList({resetSortType = false} = {}) {
    this._addPointFormPresenter.destroy();
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

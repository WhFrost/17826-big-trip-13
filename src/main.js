import {RenderPosition, render} from './utils/render.js';
import TripInfoView from './view/trip-info.js';
import HeaderInfoView from './view/header-info.js';
import HeaderCostView from './view/cost.js';
import TripControlsView from './view/trip-controls.js';
import MenuView from './view/menu.js';
import AddPointButtonView from './view/add-point-button.js';
import TripPresenter from './presenter/trip.js';
import {generatePoint} from './mock/point.js';
import PointsModel from './model/points.js';
import FiltersModel from './model/filters.js';
import FiltersPresenter from './presenter/filters.js';

const POINTS_COUNT = 5;
const points = new Array(POINTS_COUNT).fill().map(generatePoint);
const MainHeaderElement = document.querySelector(`.trip-main`);
const MainPointsElement = document.querySelector(`.page-main .page-body__container`);

const tripInfo = new TripInfoView();
render(tripInfo, RenderPosition.BEFOREEND, MainHeaderElement);
const headerInfo = new HeaderInfoView(points);
render(headerInfo, RenderPosition.AFTERBEGIN, tripInfo);
const headerCost = new HeaderCostView(points);
render(headerCost, RenderPosition.BEFOREEND, tripInfo);
const tripControls = new TripControlsView();
render(tripControls, RenderPosition.BEFOREEND, MainHeaderElement);
const menu = new MenuView();
render(menu, RenderPosition.AFTERBEGIN, tripControls);
const addPointButton = new AddPointButtonView();
render(addPointButton, RenderPosition.BEFOREEND, MainHeaderElement);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter(MainPointsElement, pointsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(tripControls, filtersModel, pointsModel);

filtersPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.addPoint();
});

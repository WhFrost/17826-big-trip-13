import TripPresenter from './presenter/trip.js';
import {generatePoint} from './mock/point.js';
import PointsModel from './model/points.js';

const POINTS_COUNT = 5;
const points = new Array(POINTS_COUNT).fill().map(generatePoint);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const MainHeaderElement = document.querySelector(`.trip-main`);
const MainPointsElement = document.querySelector(`.page-main .page-body__container`);

const TripMenu = new TripPresenter(MainHeaderElement, MainPointsElement, pointsModel);
TripMenu.init(points);

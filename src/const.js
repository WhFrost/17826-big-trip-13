import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {pointTypes, citiesList} from './mock/point.js';

const DEFAULT_POINT = {
  id: nanoid(),
  date: dayjs(),
  type: pointTypes[0],
  city: citiesList[0],
  timeStart: dayjs().format(`DD/MM/YY HH:mm`),
  timeEnd: dayjs().format(`DD/MM/YY HH:mm`),
  price: ``,
  offers: ``,
  destination: ``
};

const SORT_TYPE = {
  DAY: `sort-day`,
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
  OFFER: `sort-offer`
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export {
  DEFAULT_POINT,
  SORT_TYPE,
  UserAction,
  UpdateType
};

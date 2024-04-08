import { getRandomArrayElement } from '../utils/common.js';
import { POINT_TYPES } from '../const.js';

const points = [{
  basePrice: 1000,
  dateFrom: '2019-07-10T12:55:56.845Z',
  dateTo: '2019-07-10T13:35:56.845Z',
  destination: 0,
  isFavorite: true,
  offers: ['b4c3e4e6-9053-42ce-b747-e281314baa31',
    'b4c3e4e6-9053-42ce-b747-e281314baa33'],
  type: POINT_TYPES[1]
}, {
  basePrice: 1100,
  dateFrom: '2020-08-10T10:25:56.845Z',
  dateTo: '2020-08-10T15:55:56.845Z',
  destination: 1,
  isFavorite: false,
  offers: [],
  type: POINT_TYPES[0]
}, {
  basePrice: 1200,
  dateFrom: '2021-08-05T10:25:56.845Z',
  dateTo: '2021-08-08T15:55:56.845Z',
  destination: 2,
  isFavorite: false,
  offers: [],
  type: POINT_TYPES[2]
}, {
  basePrice: 1300,
  dateFrom: '2020-08-05T10:25:56.845Z',
  dateTo: '2021-08-08T15:55:56.845Z',
  destination: 3,
  isFavorite: true,
  offers: [],
  type: POINT_TYPES[3]
}];

function getRandomPoint() {
  return {...getRandomArrayElement(points),
    id: `${Math.random() * Math.random()}`};
}

function getPoints() {
  return points;
}

export { getPoints, getRandomPoint };

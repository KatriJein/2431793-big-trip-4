import { render, RenderPosition } from './framework/render.js';
import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { generateFilter } from './mock/filter.js';

const headerInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({ tripContainer, pointsModel, destinationsModel, offersModel });
const filters = generateFilter(pointsModel.points);

render(new TripInfoView(), headerInfoContainer, RenderPosition.AFTERBEGIN);
render(new FilterView({ filters }), filterContainer);

tripPresenter.init();

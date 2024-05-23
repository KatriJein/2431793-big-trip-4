import { render, RenderPosition } from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './api-services.js/points-api-service.js';
import DestinationsApiService from './api-services.js/destinations-api-service.js';
import OffersApiService from './api-services.js/offers-api-service.js';

const AUTHORIZATION = 'Basic faithinthefuture';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const headerInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

const destinationsModel = new DestinationModel({ destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION) });
const offersModel = new OffersModel({ offersApiService: new OffersApiService(END_POINT, AUTHORIZATION) });
const pointsModel = new PointsModel({ pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION) });
const filterModel = new FilterModel();

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

const tripPresenter = new TripPresenter({
  tripContainer,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
  newPointButtonComponent
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
  tripPresenter.rerender();
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

async function initModels() {
  await destinationsModel.init();
  await offersModel.init();
  await pointsModel.init();
  render(newPointButtonComponent, headerInfoContainer);
}

render(new TripInfoView(), headerInfoContainer, RenderPosition.AFTERBEGIN);


filterPresenter.init();
tripPresenter.init();
initModels();



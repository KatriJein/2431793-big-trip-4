import { RenderPosition, remove, render, replace } from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import { getInfofromPoints } from '../utils/trip-info';

export default class TripInfoPresenter {
  #tripInfoComponent = null;
  #container = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    const points = this.#pointsModel.points;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    this.#tripInfoComponent = new TripInfoView({ info: getInfofromPoints({ points, destinations, offers }) });

    if (!prevTripInfoComponent) {
      render(
        this.#tripInfoComponent,
        this.#container,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #handleModelChange = () => {
    this.init();
  };
}

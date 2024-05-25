import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(info) {
  const { destinationsString, datesString, total } = info;
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${destinationsString}</h1>

      <p class="trip-info__dates">${datesString}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>
  </section>`;
}

export default class TripInfoView extends AbstractView {
  #info = null;

  constructor({ info }) {
    super();
    this.#info = info;
  }

  get template() {
    return createTripInfoTemplate(this.#info);
  }
}

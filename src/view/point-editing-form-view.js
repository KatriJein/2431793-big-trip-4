import { createElement } from '../render.js';
import { POINT_TYPES, DESTINATIONS } from '../const.js';
import { getLastWord, upperFirstChar, humanizeDate } from '../utils.js';

const BLANK_POINT = {
  type: 'flight',
  dateFrom: humanizeDate(null, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
  dateTo: humanizeDate(null, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
  basePrice: 0,
  offers: [],
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
};

function createEventSelector() {
  function createEventItems() {
    return POINT_TYPES.map((item) => (`<div class="event__type-item">
    <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
    <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${upperFirstChar(item)}</label>
  </div>`)).join('');
  }

  return `<input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${createEventItems()}
    </fieldset>
  </div>`;
}

function createOffersSelector({ offers, offersOfThisType }) {
  function createOfferItem() {
    return offersOfThisType.map((item) => {
      const checkedClassname = offers.some((curValue) => (curValue.id === item.id)) ? 'checked' : '';
      const slug = getLastWord(item.title);
      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${slug}-1" type="checkbox" name="event-offer-${slug}" ${checkedClassname}>
      <label class="event__offer-label" for="event-offer-${slug}-1">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
    </div>`;
    }).join('');
  }

  return offersOfThisType ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${createOfferItem()}
  </div>
</section>` : '';
}

function createDestinationSection(destination) {
  const { description, pictures, name } = destination;

  function createPicturesSection() {
    return pictures ? `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((item) => (`<img class="event__photo" src="${item.src}" alt="${item.description}">`)).join('')}
    </div>
  </div>` : '';
  }

  return name ? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  ${createPicturesSection()}
</section>` : '';
}

function createDestinationList() {
  return `<datalist id="destination-list-1">
  ${DESTINATIONS.map((item) => (`<option value="${item}"></option>`)).join('')}
  </datalist>`;
}

function createEditPointTemplate({ point, offersOfThisType }) {
  const { type, dateFrom, dateTo, basePrice, destination, offers } = point;
  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      ${createEventSelector()}
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${upperFirstChar(type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      ${createDestinationList()}
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${createOffersSelector({ offers, offersOfThisType })}
    ${createDestinationSection(destination)}
  </section>
</form>`;
}

export default class PointEditingFormView {
  constructor({ point = BLANK_POINT, offersOfThisType } = {}) {
    this.point = point;
    this.offersOfThisType = offersOfThisType;
  }

  getTemplate() {
    return createEditPointTemplate({ point: this.point, offersOfThisType: this.offersOfThisType });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

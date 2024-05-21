import { upperFirstChar } from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters, currentFilterType) {
  return `<div class="trip-main__trip-controls  trip-controls">
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
    
      ${filters.map(({ type }) => (`<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${upperFirstChar(type)}</label>
    </div>`)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
</div>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}

import { render } from '../framework/render';
import SortView from '../view/sort-view';
import ListEventsView from '../view/list-events-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';
import { SortType } from '../const';
import { sortDay, sortTime, sortPrice } from '../utils/sort';
import { remove } from '../framework/render';


export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #pointsListComponent = new ListEventsView();
  #sortComponent = null;
  #noPointComponent = new EmptyListView();
  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;
  #sortedPoints = [];


  constructor({ tripContainer, pointsModel, destinationsModel, offersModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sortedPoints = [...this.#points.sort(sortDay)];

    if (!this.#points.length) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderList();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sortedPoints = updateItem(this.#sortedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch(sortType) {
      case SortType.TIME:
        this.#points.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPrice);
        break;
      default:
        this.#points = [...this.#sortedPoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#clearSort();
    this.#renderSort();
    this.#renderList();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEmptyList() {
    render(this.#noPointComponent, this.#tripContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType });
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderList() {
    render(this.#pointsListComponent, this.#tripContainer);

    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearSort() {
    remove(this.#sortComponent);
  }
}


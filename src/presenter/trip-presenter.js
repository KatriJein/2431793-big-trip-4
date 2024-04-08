import { render } from '../framework/render';
import SortView from '../view/sort-view';
import ListEventsView from '../view/list-events-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #points = [];
  #pointsListComponent = new ListEventsView();
  #sortComponent = new SortView();
  #noPointComponent = new EmptyListView();
  #pointPresenters = new Map();


  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    if (!this.#points.length) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderList();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEmptyList() {
    render(this.#noPointComponent, this.#tripContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderList() {
    render(this.#pointsListComponent, this.#tripContainer);

    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}


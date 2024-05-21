import { render } from '../framework/render';
import SortView from '../view/sort-view';
import ListEventsView from '../view/list-events-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
// import { updateItem } from '../utils/common';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortDay, sortTime, sortPrice } from '../utils/sort';
import { remove } from '../framework/render';
import { filter } from '../utils/filter';
import NewPointPresenter from './new-point-presenter';


export default class TripPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  // #points = [];
  #pointsListComponent = new ListEventsView();
  #sortComponent = null;
  #noPointComponent = null;
  #newPointButtonComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #creatingNewPoint = false;
  // #sortedPoints = [];


  constructor({ tripContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy, newPointButtonComponent }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointButtonComponent = newPointButtonComponent;

    this.#newPointPresenter = new NewPointPresenter({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: () => {
        this.#creatingNewPoint = false;
        onNewPointDestroy();}
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    // this.#points = [...this.#pointsModel.points];
    // this.#sortedPoints = [...this.#points.sort(sortDay)];

    this.#renderBoard();
  }

  rerender() {
    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    this.#currentSortType = SortType.DAY;
    this.#renderBoard();
  }

  #renderBoard() {
    if (!this.#creatingNewPoint) {
      if (!this.points.length) {
        this.#renderEmptyList();
        return;
      }
    }

    this.#renderSort();
    this.#renderList(this.points);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  createPoint() {
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      render(this.#pointsListComponent, this.#tripContainer);
    }
    this.#creatingNewPoint = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  // #handlePointChange = (updatedPoint) => {
  //   // this.#points = updateItem(this.#points, updatedPoint);
  //   // this.#sortedPoints = updateItem(this.#sortedPoints, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  // #sortPoints(sortType) {
  //   switch(sortType) {
  //     case SortType.TIME:
  //       this.#points.sort(sortTime);
  //       break;
  //     case SortType.PRICE:
  //       this.#points.sort(sortPrice);
  //       break;
  //     default:
  //       this.#points = [...this.#sortedPoints];
  //   }
  //   this.#currentSortType = sortType;
  // }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    // this.#sortPoints(sortType);
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEmptyList() {
    this.#noPointComponent = new EmptyListView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#tripContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderList(points) {
    render(this.#pointsListComponent, this.#tripContainer);

    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
    }

    return filteredPoints;
  }
}


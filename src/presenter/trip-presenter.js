import { render, RenderPosition, remove } from '../framework/render';
import SortView from '../view/sort-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortDay, sortTime, sortPrice } from '../utils/sort';
import { filter } from '../utils/filter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import ErrorView from '../view/error-view';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #pointsListComponent = null;
  #sortComponent = null;
  #noPointComponent = null;
  #newPointButtonComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #onNewPointDestroy = null;

  #creatingNewPoint = false;
  #isLoading = true;
  #isError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({ tripContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy, newPointButtonComponent }) {
    this.#tripContainer = tripContainer;
    this.#pointsListComponent = tripContainer.querySelector('.trip-events__list');
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointButtonComponent = newPointButtonComponent;
    this.#onNewPointDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      pointListContainer: this.#pointsListComponent,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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

  createPoint() {
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    this.#creatingNewPoint = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  init() {
    this.#renderBoard();
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #newPointDestroyHandler = ({ isCanceled }) => {
    this.#creatingNewPoint = false;
    this.#onNewPointDestroy();
    if (!this.points.length && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isError) {
      this.#renderError();
      return;
    }

    if (!this.#creatingNewPoint) {
      if (!this.points.length) {
        this.#renderEmptyList();
        return;
      }
    }
    this.#renderSort();
    this.#renderList(this.points);
  }

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
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderList(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripContainer);
  }

  #renderError() {
    render(this.#errorComponent, this.#tripContainer);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
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
      case UpdateType.INIT:
        if (data.isError) {
          this.#isError = true;
          this.#newPointButtonComponent.element.disabled = true;
        }
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#errorComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

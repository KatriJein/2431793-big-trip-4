import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, EditingType } from '../const.js';
import PointEditingFormView from '../view/point-editing-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  #offersModel = null;
  #destinationsModel = null;

  constructor({ pointListContainer, onDataChange, onDestroy, offersModel, destinationsModel }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  destroy({ isCanceled = true } = {}) {
    if (!this.#pointEditComponent) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDestroy({ isCanceled });
  }

  init() {
    if (this.#pointEditComponent) {
      return;
    }

    this.#pointEditComponent = new PointEditingFormView({
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      type: EditingType.NEW
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

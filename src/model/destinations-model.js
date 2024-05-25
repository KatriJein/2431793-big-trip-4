import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class DestinationModel extends Observable {
  #destinations = [];
  #destinationsApiService = null;

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((dest) => (dest.id === id));
  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
      this._notify(UpdateType.INIT, {isError : true });
    }
  }
}

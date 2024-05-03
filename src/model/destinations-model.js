import { getDestinations } from '../mock/destination';

export default class DestinationModel {
  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((dest) => (dest.id === id));
  }
}

import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  #offers = [];
  #offersApiService = null;

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.offers.find((offer) => (offer.type === type))?.offers;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = [];
    }
  }
}

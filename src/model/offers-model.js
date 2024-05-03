import { getAllOffers } from '../mock/offer';

export default class OffersModel {
  #offers = getAllOffers();

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.offers.find((offer) => (offer.type === type))?.offers;
  }
}

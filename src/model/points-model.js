import { getRandomPoint } from '../mock/point';

const POINTS_COUNT = 12;

export default class PointsModel {
  #points = null;

  constructor() {
    this.#points = Array.from({ length: POINTS_COUNT }, getRandomPoint);
  }

  get points() {
    return this.#points;
  }

  // #getMergedPoints(points) {
  //   return points.map((point) => {
  //     const offersByType = this.#offersModel.getOffersByType(point.type);
  //     return {...point,
  //       destination: this.#destinationModel.getDestinationById(point.destination),
  //       offers: point.offers.map((offerId) => (offersByType.find((offer) => (offer.id === offerId)))),
  //       offersByThisType: this.#offersModel.getOffersByType(point.type)};
  //   });
  // }
}

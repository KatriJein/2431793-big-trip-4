import dayjs from 'dayjs';
import { sortDay } from '../utils/sort';

function getInfofromPoints({ points, destinations, offers }) {
  if (!points || !destinations || !offers) {
    return {
      destinationsString: '',
      datesString: '',
      total: 0
    };
  }
  const sortedPoints = [...points.sort(sortDay)];
  const arrayOfDestinations = [];
  let sumOfTrip = 0;
  sortedPoints.forEach((point) => {
    const destination = destinations.find((dest) => dest.id === point.destination).name;
    arrayOfDestinations.push(destination);
    const offersOfCurrentType = offers.find((offer) => offer.type === point.type).offers;
    offersOfCurrentType.forEach((offer) => {
      if (point.offers.includes(offer.id)) {
        sumOfTrip += offer.price;
      }
    });
    sumOfTrip += point.basePrice;
  });

  return {
    destinationsString: createViewOfPath(arrayOfDestinations),
    datesString: createViewOfDates(sortedPoints[0]?.dateFrom, sortedPoints[sortedPoints.length - 1]?.dateTo),
    total: sumOfTrip
  };
}

function createViewOfPath(destinations) {
  let string = '';
  if (destinations.length < 4) {
    destinations.forEach((destination, index) => {
      if (index !== destinations.length - 1) {
        string += `${destination} &mdash; `;
      } else {
        string += `${destination}`;
      }
    });
  } else {
    string = `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`;
  }
  return string;
}

function createViewOfDates(dateA, dateB) {
  return dateA && dateB ? `${dayjs(dateA).format('D MMM').toUpperCase()}&nbsp;&mdash;&nbsp;${dayjs(dateB).format('D MMM').toUpperCase()}` : '';
}

export { getInfofromPoints };

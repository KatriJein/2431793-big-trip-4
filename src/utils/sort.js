import dayjs from 'dayjs';
import { getDurationNF } from './point';

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortDay(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortTime(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  const durationA = getDurationNF(pointA.dateFrom, pointA.dateTo);
  const durationB = getDurationNF(pointB.dateFrom, pointB.dateTo);

  if (weight !== null) {
    return weight;
  } else {
    if (durationA.asMilliseconds() > durationB.asMilliseconds()) {
      return -1;
    } else if (durationA.asMilliseconds() < durationB.asMilliseconds()) {
      return 1;
    } else {
      return 0;
    }
  }
}

function sortPrice(pointA, pointB) {
  const diff = pointA.basePrice - pointB.basePrice;
  if (diff > 0) {
    return -1;
  } else if (diff < 0) {
    return 1;
  } else {
    return 0;
  }
}

export {sortDay, sortTime, sortPrice};

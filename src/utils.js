import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const TimePeriods = {
  minInHour: 60,
  minInDay: 1440,
  minInYear: 525600
};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(min, max) {
  return Math.round((max - min) * Math.random() + min);
}

function humanizeDate(date, format) {
  return date ? dayjs(date).format(format) : dayjs().format(format);
}

function getDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (timeDiff >= TimePeriods.minInYear) {
    return dayjs.duration(timeDiff, 'minutes').format('YY[Y] DD[D] HH[H] mm[M]');
  } else if (timeDiff >= TimePeriods.minInDay) {
    return dayjs.duration(timeDiff, 'minutes').format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= TimePeriods.minInHour) {
    return dayjs.duration(timeDiff, 'minutes').format('HH[H] mm[M]');
  } else {
    return dayjs.duration(timeDiff, 'minutes').format('mm[M]');
  }
}

function getLastWord(string) {
  const words = string.split(' ');
  return words.at(-1);
}

function upperFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { getRandomArrayElement, getRandomInteger, getDuration, humanizeDate, getLastWord, upperFirstChar};

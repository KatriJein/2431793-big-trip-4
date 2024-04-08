const DESTINATIONS = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Saint Petersburg', 'Vienna'];
const POINT_TYPES = ['taxi', 'flight', 'bus', 'train', 'ship', 'drive', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { DESTINATIONS, POINT_TYPES, FilterType, SortType };

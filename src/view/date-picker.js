import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class DatePicker {
  #datePicker = null;

  constructor({
    element,
    defaultDate,
    minDate = null,
    maxDate = null,
    onClose
  }) {
    this.#datePicker = flatpickr(element, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
      defaultDate,
      minDate,
      maxDate,
      onClose,
    });
  }

  destroy = () => {
    this.#datePicker.destroy();
  };

  setMaxDate = (date) => {
    this.#datePicker.set('maxDate', date);
  };

  setMinDate = (date) => {
    this.#datePicker.set('minDate', date);
  };
}

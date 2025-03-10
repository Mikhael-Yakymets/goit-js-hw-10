import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  button: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
};

refs.button.addEventListener('click', onClick);
refs.button.disabled = true;
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topCenter',
      });
    }
    refs.button.disabled = false;
    userSelectedDate = selectedDates[0];
  },
};

flatpickr(refs.input, options);

function onClick() {
  refs.button.disabled = true;
  refs.input.disabled = true;

  const timerId = setInterval(() => {
    const diff = userSelectedDate - Date.now();

    //#region Stop Timer
    if (diff <= 0) {
      clearInterval(timerId);

      document.querySelector('[data-days]').textContent = '00';
      document.querySelector('[data-hours]').textContent = '00';
      document.querySelector('[data-minutes]').textContent = '00';
      document.querySelector('[data-seconds]').textContent = '00';

      iziToast.success({
        title: 'Timer Finished',
        message: 'Time is running out! We congratulate you!',
        position: 'topCenter',
      });

      refs.input.disabled = false;
      refs.button.disabled = false;
      return;
    }
    //#endregion Stop Timer

    const { days, hours, minutes, seconds } = convertMs(diff);

    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }, 1000);
}

//#region Leading Zero
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
//#endregion Leading Zero

//#region Convertation Time
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
//#endregion Convertation Time

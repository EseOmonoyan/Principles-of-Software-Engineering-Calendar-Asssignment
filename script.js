document.addEventListener('DOMContentLoaded', function () {
  const calendarBody = document.querySelector('#calendar tbody');
  const monthDisplayLabel = document.getElementById('currentMonth');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const eventModal = document.getElementById('eventModal');
  const closeModalButton = document.getElementById('closeModal');
  const saveEventButton = document.getElementById('saveEvent');
  const deleteEventButton = document.getElementById('deleteEvent');

  const eventTitleInput = document.getElementById('eventTitle');
  const eventDetailsInput = document.getElementById('eventDetails');
  const eventLocationInput = document.getElementById('eventLocation');
  const eventTimeInput = document.getElementById('eventTime');

  const confirmDeleteModal = document.getElementById('confirmDeleteModal');
  const confirmDeleteYes = document.getElementById('confirmDeleteYes');
  const confirmDeleteNo = document.getElementById('confirmDeleteNo');

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDateCell = null;

  function getStorageKey(date, month, year) {
    return `${year}-${month + 1}-${date}`;
  }

  function loadEvents() {
    const events = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('event-')) {
        const dateKey = key.replace('event-', '');
        events[dateKey] = JSON.parse(localStorage[key]);
      }
    }
    return events;
  }

  function saveEventToStorage(date, month, year, eventData) {
    const key = `event-${getStorageKey(date, month, year)}`;
    localStorage.setItem(key, JSON.stringify(eventData));
  }

  function deleteEventFromStorage(date, month, year) {
    const key = `event-${getStorageKey(date, month, year)}`;
    localStorage.removeItem(key);
  }

  function clearModalInputs() {
    eventTitleInput.value = '';
    eventDetailsInput.value = '';
    eventLocationInput.value = '';
    eventTimeInput.value = '';
  }

  function generateCalendar(month, year) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    monthDisplayLabel.textContent = `${monthNames[month]} ${year}`;
    calendarBody.innerHTML = '';
    const storedEvents = loadEvents();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td');
        if (i === 0 && j < firstDay) {
          cell.textContent = '';
        } else if (date > daysInMonth) {
          break;
        } else {
          cell.textContent = date;
          cell.dataset.date = date;
          cell.dataset.month = month;
          cell.dataset.year = year;

          // Add today's highlight
          if (
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
          ) {
            cell.classList.add('today');
          }

          // Restore and show event title
          const key = getStorageKey(date, month, year);
          if (storedEvents[key]) {
            const ev = storedEvents[key];
            const p = document.createElement('p');
            p.classList.add('event');
            p.textContent = ev.title;
            cell.appendChild(p);
            cell.classList.add('booked');
            cell.dataset.event = JSON.stringify(ev); // store full event data in cell
          }

          // Click to open modal
          cell.addEventListener('click', function () {
            selectedDateCell = this;
            eventModal.style.display = 'block';

            // Load event into modal
            const data = selectedDateCell.dataset.event;
            if (data) {
              const parsed = JSON.parse(data);
              eventTitleInput.value = parsed.title;
              eventDetailsInput.value = parsed.details;
              eventLocationInput.value = parsed.location;
              eventTimeInput.value = parsed.time;
              deleteEventButton.style.display = 'inline-block';
            } else {
              clearModalInputs();
              deleteEventButton.style.display = 'none';
            }
          });

          date++;
        }
        row.appendChild(cell);
      }
      calendarBody.appendChild(row);
      if (date > daysInMonth) break;
    }
  }

  prevBtn.addEventListener('click', () => {
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    generateCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener('click', () => {
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    generateCalendar(currentMonth, currentYear);
  });

  closeModalButton.addEventListener('click', () => {
    eventModal.style.display = 'none';
    clearModalInputs();
  });

  saveEventButton.addEventListener('click', () => {
    const title = eventTitleInput.value;
    const details = eventDetailsInput.value;
    const location = eventLocationInput.value;
    const time = eventTimeInput.value;

    if (title && details && location && time) {
      const eventDisplay = document.createElement('p');
      eventDisplay.textContent = title;
      eventDisplay.classList.add('event');

      const dateNumber = selectedDateCell.dataset.date;
      const month = parseInt(selectedDateCell.dataset.month);
      const year = parseInt(selectedDateCell.dataset.year);

      selectedDateCell.innerHTML = dateNumber;
      selectedDateCell.appendChild(eventDisplay);
      selectedDateCell.classList.add('booked');

      const eventData = { title, details, location, time };
      selectedDateCell.dataset.event = JSON.stringify(eventData);
      saveEventToStorage(dateNumber, month, year, eventData);

      eventModal.style.display = 'none';
      clearModalInputs();
    } else {
      alert("Please fill out all fields.");
    }
  });

  deleteEventButton.addEventListener('click', () => {
    confirmDeleteModal.style.display = 'block';
  });

  confirmDeleteYes.addEventListener('click', () => {
    if (selectedDateCell) {
      const dateNumber = selectedDateCell.dataset.date;
      const month = parseInt(selectedDateCell.dataset.month);
      const year = parseInt(selectedDateCell.dataset.year);
      selectedDateCell.innerHTML = dateNumber;
      selectedDateCell.classList.remove('booked');
      delete selectedDateCell.dataset.event;
      deleteEventFromStorage(dateNumber, month, year);
      eventModal.style.display = 'none';
      confirmDeleteModal.style.display = 'none';
      clearModalInputs();
    }
  });

  confirmDeleteNo.addEventListener('click', () => {
    confirmDeleteModal.style.display = 'none';
  });

  generateCalendar(currentMonth, currentYear);
});

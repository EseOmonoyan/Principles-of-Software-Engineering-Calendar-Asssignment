
document.addEventListener('DOMContentLoaded', function() {
  // Variables for interactable elements
  var calendarBody = document.querySelector('#calendar tbody');
  var monthDisplayLabel = document.getElementById('currentMonth');
  var previousMonthButton = document.getElementById('prevMonth');
  var nextMonthButton = document.getElementById('nextMonth');
  var eventModal = document.getElementById('eventModal');
  var closeModalButton = document.getElementById('closeModal');
  var saveEventButton = document.getElementById('saveEvent');
  var deleteEventButton = document.getElementById('deleteEvent');
  var eventText = document.getElementById('eventText');
  var eventReason = document.getElementById('eventReason');

  // current date tracker
  var today = new Date();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();
  var selectedDateCell = null; // to see which cell was clicked

  // calendar based on current date
  generateCalendar(currentMonth, currentYear);

  // specific calendar generator
  function generateCalendar(month, year) {
      var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      monthDisplayLabel.textContent = monthNames[month] + ' ' + year;
      calendarBody.innerHTML = ''; // Clear previous content

      var firstDay = new Date(year, month, 1).getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var date = 1;

      // calendar rows and cells (html generation)
      for (var i = 0; i < 6; i++) { // Up to 6 rows max for all weeks
          var row = document.createElement('tr');

          for (var j = 0; j < 7; j++) { // 7 columns (days)
              var cell = document.createElement('td');
              if (i === 0 && j < firstDay) {
                  cell.textContent = ''; // empty cells before the first day of the month
              } else if (date > daysInMonth) {
                  break; // terminate with no further dates to add
              } else {
                  cell.textContent = date;
                  cell.dataset.date = date;
                  cell.dataset.month = month;
                  cell.dataset.year = year;

                  // Add a click event listener to each date cell
                  cell.addEventListener('click', function() {
                      selectedDateCell = this;
                      eventModal.style.display = 'block';

                      deleteEventButton.style.display = selectedDateCell.querySelector('p') ? 'inline-block' : 'none'; //delete button if there is an event
                  });

                  date++;
              }
              row.appendChild(cell);
          }
          calendarBody.appendChild(row);

          if (date > daysInMonth) {
              break; // terminate row creation with all dates created
          }
      }
  }

  // Move to the previous month
  previousMonthButton.addEventListener('click', function() {
      if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
      } else {
          currentMonth--;
      }
      generateCalendar(currentMonth, currentYear);
  });

  // Move to the next month
  nextMonthButton.addEventListener('click', function() {
      if (currentMonth === 11) {
          currentMonth = 0;
          currentYear++;
      } else {
          currentMonth++;
      }
      generateCalendar(currentMonth, currentYear);
  });

  // Close the event modal
  closeModalButton.addEventListener('click', function() {
      eventModal.style.display = 'none';
      eventText.value = ''; // Clear inputs
      eventReason.value = '';
  });

  // Save the event
  saveEventButton.addEventListener('click', function() {
      var reason = eventReason.value;
      var details = eventText.value;
      if (reason && details) {
          var eventDisplay = document.createElement('p');
          eventDisplay.textContent = reason + ': ' + details;
          eventDisplay.classList.add('event');

          // Clear any existing events before adding a new one
          selectedDateCell.innerHTML = '';
          selectedDateCell.appendChild(eventDisplay);
          selectedDateCell.classList.add('booked'); //css link


          eventModal.style.display = 'none';
          eventText.value = '';
          eventReason.value = '';
      }
  });

  // Delete the event
  deleteEventButton.addEventListener('click', function() {
      if (selectedDateCell) {
          selectedDateCell.textContent = selectedDateCell.dataset.date; // Remove event but keep the date number
          eventModal.style.display = 'none';
          eventText.value = '';
          eventReason.value = '';
      }
  });
});

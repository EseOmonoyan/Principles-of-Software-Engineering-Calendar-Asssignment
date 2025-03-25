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
  
    // New references for the updated modal fields
    var eventTitleInput = document.getElementById('eventTitle');
    var eventDetailsInput = document.getElementById('eventDetails');
    var eventLocationInput = document.getElementById('eventLocation');
    var eventTimeInput = document.getElementById('eventTime');
  
    // Current date tracker
    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    var selectedDateCell = null; // Track which cell was clicked
  
    // Generate calendar based on current date
    generateCalendar(currentMonth, currentYear);
  
    // Calendar generator function
    function generateCalendar(month, year) {
      var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      monthDisplayLabel.textContent = monthNames[month] + ' ' + year;
      calendarBody.innerHTML = ''; // Clear previous content
  
      var firstDay = new Date(year, month, 1).getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var date = 1;
  
      // Create rows for calendar (up to 6 rows)
      for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');
  
        for (var j = 0; j < 7; j++) {
          var cell = document.createElement('td');
          if (i === 0 && j < firstDay) {
            // Empty cells before the first day of the month
            cell.textContent = '';
          } else if (date > daysInMonth) {
            // Stop if all dates have been added
            break;
          } else {
            cell.textContent = date; // Display the date number
            cell.dataset.date = date;
            cell.dataset.month = month;
            cell.dataset.year = year;
  
            // Add click event to open modal for the cell
            cell.addEventListener('click', function() {
              selectedDateCell = this;
              eventModal.style.display = 'block';
              // Show delete button if an event already exists in this cell
              deleteEventButton.style.display = selectedDateCell.querySelector('p') ? 'inline-block' : 'none';
            });
  
            date++;
          }
          row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if (date > daysInMonth) {
          break;
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
      clearModalInputs();
    });
  
    // Helper function to clear modal inputs
    function clearModalInputs() {
      eventTitleInput.value = '';
      eventDetailsInput.value = '';
      eventLocationInput.value = '';
      eventTimeInput.value = '';
    }
  
    // Save the event
    saveEventButton.addEventListener('click', function() {
      var title = eventTitleInput.value;
      var details = eventDetailsInput.value;
      var location = eventLocationInput.value;
      var time = eventTimeInput.value;
  
      // Validate all fields
      if (title && details && location && time) {
        var eventDisplay = document.createElement('p');
        // Format: Title: details @ time 📍 location
        eventDisplay.textContent = `${title}: ${details} @ ${time} 📍 ${location}`;
        eventDisplay.classList.add('event');
  
        // Clear any existing content before adding a new event
        var dateNumber = selectedDateCell.dataset.date;
        selectedDateCell.innerHTML = dateNumber;
        selectedDateCell.appendChild(eventDisplay);
        selectedDateCell.classList.add('booked'); // Highlight booked dates
  
        eventModal.style.display = 'none';
        clearModalInputs();
      } else {
        alert("Please fill out all fields before saving.");
      }
    });
  
    // Delete the event
    deleteEventButton.addEventListener('click', function() {
      if (selectedDateCell) {
        var dateNumber = selectedDateCell.dataset.date;
        // Remove event but keep the date number
        selectedDateCell.innerHTML = dateNumber;
        selectedDateCell.classList.remove('booked');
        eventModal.style.display = 'none';
        clearModalInputs();
      }
    });
  });
  
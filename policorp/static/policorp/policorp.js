document.addEventListener('DOMContentLoaded', () => {

  loadFilters();
  document.querySelector('#locationScheduleContainer').style.display = 'block';
  document.querySelector('#locationConfigurationContainer').style.display = 'none';
  document.querySelector('#location-schedule-link').addEventListener('click', () => handleLocationScheduleLinkClick());
  document.querySelector('#location-config-link').addEventListener('click', () => handleLocationConfigurationLinkClick());
  document.querySelector('#lookupBookingsButton').addEventListener('click', (event) => handleSearchClick(event));
  document.querySelector('#createSingleAvailabilityButton').addEventListener('click', () => handleCreateAvailabilityClick());
  document.querySelector('#configRepeatUntilCheck').addEventListener('click', (event) => handleRepeatUntilClick(event));


});

// ********************************
// *** EVENT HANDLERS Functions ***
// ********************************

// *** NAVBAR EVENTS ***

function handleLocationScheduleLinkClick() {
  document.querySelector('#locationScheduleContainer').style.display = 'block';
  document.querySelector('#locationConfigurationContainer').style.display = 'none';
}

function handleLocationConfigurationLinkClick() {

  clearNode(document.querySelector('#configLocationDropdownMenu'));
  populateLocations(document.querySelector('#configLocationDropdownMenu'), handleConfigLocationSelectionClick);
  clearNode(document.querySelector('#configTaskDropdownMenu'));
  populateTasks(document.querySelector('#configTaskDropdownMenu'));

  document.querySelector('#locationScheduleContainer').style.display = 'none';
  document.querySelector('#locationConfigurationContainer').style.display = 'block';
}

// *** SCHEDULE EVENTS ***

function handleLocationSelectionClick(event) {

  const dropdownLocationButton = document.querySelector('#dropdownLocationButton');
  dropdownLocationButton.innerHTML = event.currentTarget.innerHTML;
  dropdownLocationButton.dataset.locationid = event.currentTarget.dataset.locationid;

  const lookupBookingsButton = document.querySelector('#lookupBookingsButton');
  lookupBookingsButton.style.cursor = 'pointer';
  lookupBookingsButton.disabled = false;

}

function handleSearchClick(event) {
  dropdownLocationButton = document.querySelector('#dropdownLocationButton');

  const date = new Date($datepicker.value());

  const url = constructUrlLocationSchedule(dropdownLocationButton.dataset.locationid, date);

  fetch(url)
  .then(response => response.json())
  .then(data => {

      console.log(data);
      const list = document.querySelector('#locationSchedule');
      clearNode(list);
      const listHeading = document.createElement('h5');
      if (data.length === 0) {listHeading.innerHTML = 'No Bookings';}
      else { listHeading.innerHTML = 'Bookings';}
      list.append(listHeading);
      data.forEach( (bookingData)  => {
        element = createBooking(bookingData);
        list.append(element);
      });
      list.style.display = 'block';
  })
}

// *** CONFIGURATION EVENTS ***

function handleConfigLocationSelectionClick(event) {

  const dropdownConfigLocationButton = document.querySelector('#configLocationDropdownButton');
  dropdownConfigLocationButton.innerHTML = event.currentTarget.innerHTML;
  dropdownConfigLocationButton.dataset.locationid = event.currentTarget.dataset.locationid;

  evaluateCreateSingleAvailabilityState();
}

function handleConfigTaskSelectionClick(event) {

  const dropdownConfigTaskButton = document.querySelector('#configTaskDropdownButton');
  dropdownConfigTaskButton.innerHTML = event.currentTarget.innerHTML;
  dropdownConfigTaskButton.dataset.taskid = event.currentTarget.dataset.taskid;

  evaluateCreateSingleAvailabilityState();

}

function handleRepeatUntilClick(event) {
  const checkbox = event.currentTarget;
  const container = document.querySelector('#configUntilTimepickerContainer');
  if (checkbox.checked == true){
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}

function handleCreateAvailabilityClick() {

  // if user is not logged in, then redirect to login page
  if (username === "") {
    window.location.href = loginurl;
  } else {

    const locationid = document.querySelector('#configLocationDropdownButton').dataset.locationid;
    const taskid = document.querySelector('#configTaskDropdownButton').dataset.taskid;
    let when = new Date(`${$configDatepicker.value()}`);
    when.setHours($configTimepicker.value().substring(0, 2));
    when.setMinutes($configTimepicker.value().substring(3, 5));

    const repeatUntilCheck = document.querySelector('#configRepeatUntilCheck');
    let untilTime = null;
    if (repeatUntilCheck.checked == true){
      untilTime = $configUntilTimepicker.value();
      const configs = createAvailabilitiesJsonData(locationid, taskid, when, untilTime);

      const result = postAvailabilities(configs);
    } else {
      fetch(`/policorp/createavailabilitysingle/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        mode: 'same-origin',
        body: return JSON.stringify({
                        locationid: locationid,
                        taskid: taskid,
                        when: when.toISOString().replace("Z", "+00:00")
                        })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
              showMessage('Success', `You have successfully created an abailability configuration`);
            } else {
              showMessage('Error', `There was an error creating the abailability configuration`);
              console.error(data);
            }

            handleLocationScheduleLinkClick();
            });
        }
    }
}

// ***************************
// *** AUXILIARY Functions ***
// ***************************

function loadFilters() {

  populateLocations(document.querySelector('#locationDropdownMenu'), handleLocationSelectionClick);

  document.querySelector('#locationSelector').style.display = 'block';
  document.querySelector('#locationSchedule').style.display = 'none';

}

function populateLocations(dropDown, clickHandler) {
  fetch(`/policorp/mysupervisedlocations/`)
  .then(response => response.json())
  .then(data => {
      data.forEach( function(location) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.id = 'locationOption';
        option.dataset.locationid = location.id;
        option.innerHTML = location.name;
        option.addEventListener('click', (event) => clickHandler(event));

        dropDown.append(option);
      });
  })
}

function populateTasks(dropDown) {
  fetch(`/policorp/tasks/`)
  .then(response => response.json())
  .then(data => {
      data.forEach( function(task) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.id = 'taskOption';
        option.dataset.taskid = task.id;
        option.innerHTML = `${task.name} (${toFormattedDuration(task.duration)})`;
        option.addEventListener('click', (event) => handleConfigTaskSelectionClick(event));

        dropDown.append(option);
      });
  })
}

function constructUrlLocationSchedule(locationid, date) {
  return `/policorp/locationschedule/${locationid}/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
}

function createBooking(data) {
  // create booking container
  a = document.createElement('div');
  a.id = 'booking';
  a.dataset.bookingid = data.id;
  a.className = 'container p-3 my-3 border d-flex flex-row justify-content-between align-items-center';

  // create availability info container
  const aInfo = document.createElement('div');
  aInfo.id = 'bookingInfo';
  a.append(aInfo);

  // WHEN
  const whenContainer = document.createElement('div');
  whenContainer.innerHTML = toFormattedTime(new Date(Date.parse(data.availability.when)));
  aInfo.append(whenContainer);

  // WHAT
  const whatContainer = document.createElement('div');
  whatContainer.innerHTML = data.availability.what.name;
  aInfo.append(whatContainer);

  // WHO
  const whoContainer = document.createElement('div');
  whoContainer.innerHTML = data.username;
  aInfo.append(whoContainer);

  return a;
}

function clearNode(node) {
  var children = Array.from(node.children);
  if (children !== undefined) { children.forEach((child) => { child.remove(); }) };
  node.innerHTML = '';
}

function toFormattedTime(datetimeObj) {
  timeFrom = datetimeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  return (timeFrom);
}

function toFormattedDuration(duration) {
  if (duration < 60) {
    return `${duration} min`;
  } else {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes !== 0) { return `${hours} hs ${minutes} min`; }
    else { return `${hours} hs`; }
  }
}

function evaluateCreateSingleAvailabilityState() {
  const location = document.querySelector('#configLocationDropdownButton');
  const task = document.querySelector('#configTaskDropdownButton');
  const button = document.querySelector('#createSingleAvailabilityButton');

  if ((!isNaN(location.dataset.locationid)) && (!isNaN(task.dataset.taskid))) {
    button.disabled = false;
    button.style.cursor = 'pointer';
  }
}

function showMessage(title, message) {
  document.querySelector('#messageModalLabel').innerHTML = title;
  document.querySelector('#messageModalBody').innerHTML = message;
  $("#messageModal").modal('show');
}

function createAvailabilitiesJsonData(locationid, taskid, when, untilTime) {
  if (untilTime === null) {

  }
}

function postAvailabilities(data) {
}

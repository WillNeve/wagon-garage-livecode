// Declare wagon-garage api url using our custom garage slug of choice
const garage = 'turbo';
const url = `https://wagon-garage-api.herokuapp.com/${garage}/cars`;

// Select our input elements from DOM and save references to variables
const brandInput = document.querySelector('input[name="brand"]'); // we can select an input by its name attribute
const modelInput = document.querySelector('#model');
const plateInput = document.querySelector('#plate');
const ownerInput = document.querySelector('#owner');

// Select the list element (cards container) from DOM and save reference to variable
const list = document.querySelector('.cars-list');

// function that retrieves cars array from wagon api and adds a card to list for each result
const getCars = () => {
  fetch(url).then((resp) => resp.json()).then((data) => {
    // Set the list contents to empty to remove any existing cars before loading them again
    list.innerHTML = '';
    // we can console log the data object to familiarise ourselves with its structure
    console.log(data);
    // In this case, our data object itself is the array of cars
    const cars = data; // we make this more readable by declaring that
    // iterate through each car
    cars.forEach((car) => {
      // interpolate car specific data into respective place in our car card template (HTML markup)
      const carTemplate = `
        <div class="car">
          <div class="car-image">
            <img src="https://images.unsplash.com/photo-1624543367162-5a067d572c02?q=80&w=2264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          </div>
          <div class="car-info">
            <h4>${car.brand} ${car.model}</h4>
            <p><strong>Owner:</strong>${car.owner}</p>
            <p><strong>Plate:</strong>${car.plate}</p>
          </div>
          <!-- We add a custom data arribute holding the id of the car the button is assigned to -->
          <button type='button' data-id='${car.id}'><i class="fa-solid fa-x"></i></button>
        </div>`
      // add car card (HTML) into end of list contents
      list.insertAdjacentHTML('beforeend', carTemplate)
    })
  })

  // wait a small amount for the DOM to be updated with these new items, then:
  setTimeout(() => {
    // select all card destroy buttons
    const buttons = document.querySelectorAll("button.destroy"); // button element with class destroy
    // iterate through each button element and add a click event listener to process destruction of car
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        // select the button (which is the target/source of the event object)
        const button = event.target;
        // the carId can be found on the dataset, we added custom data attributes to each button in the above step in template
        const carId = button.dataset.id;
        // make a DELETE request to car specific api url/endpoint
        fetch(`https://wagon-garage-api.herokuapp.com/cars/${carId}`, {
          method: 'DELETE'
        }).then(resp => {
          if (resp.status === 200) {
            // if the DELETE request was succesful, refresh the cars list to show the change
            getCars();
          }
        });
      })
    })
  }, 100);
}

// select the car creation form
const form = document.querySelector('.car-form');
// add an submit event listener to the form to process car creation
form.addEventListener('submit', (event) => {
  event.preventDefault();
  // create a car object from the respective input field values
  const car = {
    brand: brandInput.value,
    "model": modelInput.value,
    "owner": ownerInput.value,
    "plate": plateInput.value,
  }
  // define our fetch options for a post request containing the new car in body
  const fetchOptions = {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(car)
  }
  // call fetch with our options and garage url to create a request to add our car to the garage (array)
  fetch(url, fetchOptions).then((resp) => {
    console.log(resp); // we expect to see a status value of 200 if the creation was succesfull
  })
})

// we explicitly call getCars() to populate the page on initial load
getCars();

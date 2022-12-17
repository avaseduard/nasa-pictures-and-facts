const loader = document.querySelector('.loading');
const resultsNavi = document.getElementById('results-navi');
const favoritesNavi = document.getElementById('favorites-navi');
const imagesContainer = document.querySelector('.images-container');
const addedPopUp = document.querySelector('.pop-up');
const count = 10;
const key = 'DEMO_KEY';
const url = `https://api.nasa.gov/planetary/apod?api_key=${key}&count=${count}`;

let results = [];
let favorites = {};

// Fetch API info from NASA
const fetchApiPictures = async function () {
  // Show loader
  loader.classList.remove('hidden');
  // Populating the result array and render them to the DOM
  try {
    const response = await fetch(url);
    results = await response.json();
    renderDOM('results');
    // Console log errors
  } catch (error) {
    console.log(error);
  }
};

// Scroll to top, decide which navigation to show and hide the loader
const hideLoader = function (page) {
  // Scroll to top of the page
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Decide which navigation to show and which to hide
  if (page === 'results') {
    resultsNavi.classList.remove('hidden');
    favoritesNavi.classList.add('hidden');
  } else {
    resultsNavi.classList.add('hidden');
    favoritesNavi.classList.remove('hidden');
  }
  // Remove the loader
  loader.classList.add('hidden');
};

// Create html elements of favorites or results
const createDOMElement = function (page) {
  // Detect what to display (from page argument), and turn into array (where neccesary)
  const currentArray = page === 'results' ? results : Object.values(favorites);
  // Loop through array, create the div and generate the html
  currentArray.forEach(result => {
    const card = document.createElement('div');
    const html = `
      <div class="card">
        <a href="${result.hdurl}" title="View full image" target="_blank">
          <img
            src="${result.url}"
            alt="NASA picture of the day"
            class="card-img-top"
            loading="lazy"
          />
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          ${
            page === 'favorites'
              ? `<p class="button add-favorite" onclick="removeFavorite(
            event, '${result.url}'
          )">Remove from favorites</p>`
              : `<p class="button add-favorite" onclick="addFavorite(
            event, '${result.url}'
          )">Add to favorites</p>`
          }
          <p class="card-text">${result.explanation}</p>
          <small class="text-muted">
            <strong>${result.date}</strong>
            <span>${
              result.copyright ? `Copyright © ${result.copyright}` : ''
            }</span>
          </small>
        </div>
      </div>
    `;
    // Set the inner html to the div
    card.innerHTML = html;
    // Append the div to the DOM element
    imagesContainer.appendChild(card);
  });
};

// Render the created html elements to the DOM or the ones form local storage
const renderDOM = function (page) {
  // Load items from local storage if they exist
  if (localStorage.getItem('favorites'))
    favorites = JSON.parse(localStorage.getItem('favorites'));
  // Clear the container
  imagesContainer.textContent = '';
  // Create the html element
  createDOMElement(page);
  // Hide loader, scroll to top and decide what to show (favorites or loaded)
  hideLoader(page);
};

// Add item to favorites when the button is clicked
const addFavorite = function (event, itemUrl) {
  event.preventDefault();
  // Loop through results array
  results.forEach(result => {
    // The url of the clicked item creates a new object in the favorites object
    if (result.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = result;
      // Show the added to favorites confirmation
      addedPopUp.hidden = false;
      // Remove the confirmation when timer runs out
      setTimeout(() => (addedPopUp.hidden = true), 2000);
      // Upload favorites to local storage
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  });
};

// Remove item from favorites
const removeFavorite = function (event, itemUrl) {
  event.preventDefault();
  // The url of the clicked item removes the coresponding object from the favorites object
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Update favorites to local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // Update the DOM with remaining elements
    renderDOM('favorites');
  }
};

// Initialization
fetchApiPictures();

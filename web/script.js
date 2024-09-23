const API_BASE_URL = 'http://localhost:3000/v1';
const COUNTRIES_ENDPOINT = `${API_BASE_URL}/countries`;
import { countries as countriesList } from './countries.js';

const addGlobalEventListener = (type, selector, callback) => {
  document.addEventListener(type, e => {
    if (e.target.matches(selector)) callback(e);
  });
};

const renderAvailableCountries = (countries) => {
  const selectCountriesDiv = document.getElementById('countryCode');
  selectCountriesDiv.innerHTML = countries
    .map(country => `<option data-countrycode=${country.countryCode}>${country.countryName}</option>`)
    .join('');
};

const renderCountries = async (countries) => {
  const countriesListDiv = document.getElementById('countries-container');
  countriesListDiv.innerHTML = countries
    .map(message => `
      <div class="grid-row">
        <div class="grid-cell">${message.country}</div>
        <div class="grid-cell">${message.places[0]['state']}</div>
        <div class="grid-cell">${message.places[0]['place name']}</div>
        <div class="grid-cell">${message['post code']}</div>
        <div class="grid-cell">
          <button type="button" class="btn-delete" data-countryid="${message.id}">Remove</button>
        </div>
      </div>      
    `)
    .join('');
};

const fetchCountries = async () => {
  console.log("fetchCountries called");
  try {
    const response = await fetch(COUNTRIES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const countriesData = await response.json();
    return countriesData;
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};

const saveCountryToAPI = async () => {
  const countrySelect = document.getElementById('countryCode');
  const countryCode = countrySelect.options[countrySelect.selectedIndex].getAttribute('data-countrycode');
  const zipcode = document.getElementById('zipcode').value;
  try {
    const response = await fetch(COUNTRIES_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryCode, zip: zipcode })
    });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    else {
    const countriesData = await fetchCountries();
    renderCountries(countriesData);
    }
  } catch (error) {
    console.error('Error saving country:', error);
  }
};

const deleteCountryFromAPI = async (countryId) => {
  try {
    const response = await fetch(`${COUNTRIES_ENDPOINT}/${countryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: countryId })
    });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    else {
    const countriesData = await fetchCountries();
    renderCountries(countriesData);
    }
  } catch (error) {
    console.error('Error deleting country:', error);
  }
};

const addEListeners = () => {
  addGlobalEventListener("click", ".btn-delete", e => deleteCountryFromAPI(e.target.dataset.countryid));
  addGlobalEventListener("click", '#btn-addCountry', () => saveCountryToAPI());
  addGlobalEventListener('change', 'select', () => { return; });  
}

const initializeApp = async () => {
  console.log("App has started");
  const countriesData = await fetchCountries();
  renderCountries(countriesData);
  renderAvailableCountries(countriesList);
  addEListeners();
};

initializeApp();
const API_BASE_URL = 'http://localhost:3000/v1';
const COUNTRIES_ENDPOINT = `${API_BASE_URL}/countries`;
import {countries} from './countries.js';

const fetchCountries = async() => {
  try {
    const response = await fetch(COUNTRIES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching messages:', error);
  }
}

const renderCountryOptions= (countries) => {
  const selectCountriesDiv = document.getElementById('countryCode');
  selectCountriesDiv.innerHTML = countries
  .map(country => `<option data-countrycode=${country.countryCode}>${country.countryName}</option>`)
  .join('');
  selectCountriesDiv.addEventListener("change", (event) => { 
    const selectedOption = event.target.options[event.target.selectedIndex];
    console.log(selectedOption.getAttribute('data-countrycode'));
  })
}

const getCountries = async () => {
  const countries = await fetchCountries();
  renderCountries(countries);
}

const renderCountries = (countries) => {
  const countriesListDiv = document.getElementById('countries-container');
  countriesListDiv.innerHTML = countries
  .map(message => `
    <div class="grid-row">
    <div class="grid-cell">${message.country}</div>
    <div class="grid-cell">${message.places[0]['state']}</div>
    <div class="grid-cell">${message.places[0]['place name']}</div>
    <div class="grid-cell">${message['post code']}</div>
    <div class="grid-cell">
      <button type="button" class="btn-delete" data-countryid="${message.id}" >Remove</button>
    </div>
    </div>      
  `)
  .join('');
  attachDeleteEventListeners();
}

function attachDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll('.btn-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => deleteCountryFromAPI(button.dataset.countryid));
  });
}

function attachAddCountryEventListeners() {
  const addButton = document.querySelectorAll('#btn-addCountry')[0];
  addButton.addEventListener('click', () => saveCountryToAPI());
}


const saveCountryToAPI = async() => {
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
    await getCountries(); 
  } catch (error) {
    console.error('Error saving country:', error);
  }
}

const deleteCountryFromAPI = async(countryId) => {
  try {
    const response = await fetch(`${COUNTRIES_ENDPOINT}/${countryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if(!response.ok) throw new Error(`API request failed with status ${response.status}`);
    else {
      getCountries();
    }
  }
  catch (error) {
    console.error('Error deleting country:', error);
  }
}

const initializeApp = () => {
  console.log("App has started");
  getCountries();
  renderCountryOptions(countries);
  attachAddCountryEventListeners();
}
initializeApp()
const API_BASE_URL = 'http://localhost:3000/v1';
const COUNTRIES_ENDPOINT = `${API_BASE_URL}/countries`;
const countries = [
  { countryName: "Andorra", countryCode: "AD" },
  { countryName: "Argentina", countryCode: "AR" },
  { countryName: "American Samoa", countryCode: "AS" },
  { countryName: "Austria", countryCode: "AT" },
  { countryName: "Australia", countryCode: "AU" },
  { countryName: "Bangladesh", countryCode: "BD" },
  { countryName: "Belgium", countryCode: "BE" },
  { countryName: "Bulgaria", countryCode: "BG" },
  { countryName: "Brazil", countryCode: "BR" },
  { countryName: "Canada", countryCode: "CA" },
  { countryName: "Switzerland", countryCode: "CH" },
  { countryName: "Czech Republic", countryCode: "CZ" },
  { countryName: "Germany", countryCode: "DE" },
  { countryName: "Denmark", countryCode: "DK" },
  { countryName: "Dominican Republic", countryCode: "DO" },
  { countryName: "Spain", countryCode: "ES" },
  { countryName: "Finland", countryCode: "FI" },
  { countryName: "Faroe Islands", countryCode: "FO" },
  { countryName: "France", countryCode: "FR" },
  { countryName: "Great Britain", countryCode: "GB" },
  { countryName: "French Guyana", countryCode: "GF" },
  { countryName: "Guernsey", countryCode: "GG" },
  { countryName: "Greenland", countryCode: "GL" },
  { countryName: "Guadeloupe", countryCode: "GP" },
  { countryName: "Guatemala", countryCode: "GT" },
  { countryName: "Guam", countryCode: "GU" },
  { countryName: "Guyana", countryCode: "GY" },
  { countryName: "Croatia", countryCode: "HR" },
  { countryName: "Hungary", countryCode: "HU" },
  { countryName: "Isle of Man", countryCode: "IM" },
  { countryName: "India", countryCode: "IN" },
  { countryName: "Iceland", countryCode: "IS" },
  { countryName: "Italy", countryCode: "IT" },
  { countryName: "Jersey", countryCode: "JE" },
  { countryName: "Japan", countryCode: "JP" },
  { countryName: "Liechtenstein", countryCode: "LI" },
  { countryName: "Sri Lanka", countryCode: "LK" },
  { countryName: "Lithuania", countryCode: "LT" },
  { countryName: "Luxembourg", countryCode: "LU" },
  { countryName: "Monaco", countryCode: "MC" },
  { countryName: "Moldavia", countryCode: "MD" },
  { countryName: "Marshall Islands", countryCode: "MH" },
  { countryName: "Macedonia", countryCode: "MK" },
  { countryName: "Northern Mariana Islands", countryCode: "MP" },
  { countryName: "Martinique", countryCode: "MQ" },
  { countryName: "Mexico", countryCode: "MX" },
  { countryName: "Malaysia", countryCode: "MY" },
  { countryName: "Holland", countryCode: "NL" },
  { countryName: "Norway", countryCode: "NO" },
  { countryName: "New Zealand", countryCode: "NZ" },
  { countryName: "Phillippines", countryCode: "PH" },
  { countryName: "Pakistan", countryCode: "PK" },
  { countryName: "Poland", countryCode: "PL" },
  { countryName: "Saint Pierre and Miquelon", countryCode: "PM" },
  { countryName: "Puerto Rico", countryCode: "PR" },
  { countryName: "Portugal", countryCode: "PT" },
  { countryName: "French Reunion", countryCode: "RE" },
  { countryName: "Russia", countryCode: "RU" },
  { countryName: "Sweden", countryCode: "SE" },
  { countryName: "Slovenia", countryCode: "SI" },
  { countryName: "Svalbard & Jan Mayen Islands", countryCode: "SJ" },
  { countryName: "Slovak Republic", countryCode: "SK" },
  { countryName: "San Marino", countryCode: "SM" },
  { countryName: "Thailand", countryCode: "TH" },
  { countryName: "Turkey", countryCode: "TR" },
  { countryName: "United States", countryCode: "US" },
  { countryName: "Vatican", countryCode: "VA" },
  { countryName: "Virgin Islands", countryCode: "VI" },
  { countryName: "Mayotte", countryCode: "YT" },
  { countryName: "South Africa", countryCode: "ZA" }
];

const fetchCountries = async() => {
  try {
    const response = await fetch('http://localhost:3000/v1/countries');
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    renderCountries(data);
  }
  catch (error) {
    console.error('Error fetching messages:', error);
  }
}

const renderCountriesOptions= (countries) => {
  const selectCountriesDiv = document.getElementById('countryCode');
  selectCountriesDiv.innerHTML = countries
  .map(country => `
        <option data-countrycode=${country.countryCode}>${country.countryName}</option>
      `)
    .join('');
  selectCountriesDiv.addEventListener("change", (event) => { 
    const selectedOption = event.target.options[event.target.selectedIndex];
    console.log(selectedOption.getAttribute('data-countrycode'));
  })
}

const onAPIUpdated = () => {
  console.log("API got updated!");
  fetchCountries();
}

const renderCountries = (messages) => {
  const countriesListDiv = document.getElementById('countriesContainer');
  countriesListDiv.innerHTML = messages
  .map(message => `
    <div class="grid-row">
    <div class="grid-cell">${message.country}</div>
    <div class="grid-cell">${message.places[0]['state']}</div>
    <div class="grid-cell">${message.places[0]['place name']}</div>
    <div class="grid-cell">${message['post code']}</div>
    <div class="grid-cell">
      <button type="button" class="btn-delete" data-countryid="${message.id}" >Delete</button>
    </div>
    </div>      
  `)
  .join('');
  const deleteBtns =  document.getElementsByClassName('btn-delete');
  Object.values(deleteBtns).forEach(button => {
    button.addEventListener('click', async()=> { deleteCountryFromAPI(button.dataset.countryid) })
  })
}

const saveCountryToAPI = async() => {
  const countrySelect = document.getElementById('countryCode');
  const countryCode = countrySelect.options[countrySelect.selectedIndex].getAttribute('data-countrycode');
  const zipcode = document.getElementById('zipcode').value;
  try {
    const response = await fetch(APIUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "country":  countryCode, "zip": zipcode })
    });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    else {
      onAPIUpdated();
    }
  } catch (error) {
    console.error('Error saving country:', error);
  }
}

const deleteCountryFromAPI = async(countyid) => {
  try {
    const response = await fetch(`http://localhost:3000/v1/countries/${countyid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if(!response.ok) throw new Error(`API request failed with status ${response.status}`);
    else {
      onAPIUpdated();
    }
  }
  catch (error) {
    console.error('Error deleting country:', error);
  }
}

const onLoad = () => {
  console.log("App has started");
  fetchCountries();
  renderCountriesOptions(countries);
}
onLoad()
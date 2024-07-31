const getMessagesBtn = document.getElementById('getMessagesBtn');
const messagesDiv = document.getElementById('messages');
const addMessagesBtn = document.getElementById('addMessageBtn');
const zippopotamBtn = document.getElementById('zippopotamBtn');
let newCountry = {};
const APIUrl = 'http://localhost:3000/v1/countries';

const getCountryDetails = async(country, zipcode) => {
  try {
    const response  = await fetch(`http://api.zippopotam.us/${country}/${zipcode}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const countryDetails = await response.json();
    return countryDetails;
  }
  catch (error) {
    console.error('Error fetching zippo:', error);
  }
}

const displayMessages = (messages) => {
  messagesDiv.innerHTML = messages
    .map(message => `<p>${message.id}: Country: ${message.country} Zip Code: ${message.postCode}</p>`)
    .join('');
}

const fetchMessages = async() => {
  try {
    const response = await fetch('http://localhost:3000/v1/countries');
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    displayMessages(data);
  }
  catch (error) {
    console.error('Error fetching messages:', error);
  }
}

const saveCountryToAPI = async(countryDetails) => {
  try {
    const response = await fetch(APIUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({countryDetails})
    });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

getMessagesBtn.addEventListener('click', fetchMessages);

zippopotamBtn.addEventListener('click', async() => {
  const countryCode = document.getElementById('country').value;
  const zipcode = document.getElementById('zipcode').value;
  const countryDetails = await getCountryDetails(countryCode, zipcode);
  console.log("countryDetails", countryDetails);
  saveCountryToAPI(countryDetails);
})

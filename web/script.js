const getMessagesBtn = document.getElementById('getMessagesBtn');
const messagesDiv = document.getElementById('messages');
const addMessagesBtn = document.getElementById('addMessageBtn');
var APIUrl = 'http://localhost:3000/messages';


async function saveMessageToAPI(apiUrl, data) {
    console.log('data to save:', data);
    const response = await fetch(apiUrl, {
      method: 'POST', // Set request method to POST
      headers: { 'Content-Type': 'application/json' }, // Set content type header
      body: JSON.stringify({data}), // Convert data to JSON string for the body
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const responseBody = await response.json();
    console.log('Message added:', responseBody);
}
getMessagesBtn.addEventListener('click', async () => {
    const response = await fetch(APIUrl); // Replace with your API URL
    const data = await response.json();
    let messageList = '';
    data.forEach(message => {
      messageList += `<p>ID: ${message.id}, Content: ${message.content}</p>`;
    });
    messagesDiv.innerHTML = messageList;
    console.log(messageList);
});
addMessagesBtn.addEventListener('click', async () => {
    const messageText = document.getElementById('inputMessage').value;
    console.log('new message:', messageText)
    saveMessageToAPI(APIUrl, messageText)
      .then(() => console.log('Message sent successfully!'))
      .catch(error => console.error('Error:', error));
});
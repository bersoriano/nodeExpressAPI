const getMessagesBtn = document.getElementById('getMessagesBtn');
const messagesDiv = document.getElementById('messages');
const addMessagesBtn = document.getElementById('addMessageBtn');
var APIUrl = 'http://localhost:3000/api/messages';

const displayMessages = (messages) => {
  messagesDiv.innerHTML = messages
    .map(message => `<p>${message.id}: Content: ${message.content}</p>`)
    .join('');
}

const fetchMessages = async() => {
  try {
    const response = await fetch(APIUrl);
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

const saveMessageToAPI = async(message) => {
  try {
    const response = await fetch(APIUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

getMessagesBtn.addEventListener('click', fetchMessages);

addMessagesBtn.addEventListener('click', async () => {
    const messageText = document.getElementById('inputMessage').value;
    if (messageText) {
      saveMessageToAPI(messageText).then(() => {
        inputMessage.value = ''; // Clear input field after adding the message
      });
    } else {
      console.error('Message content is empty');
    }
});
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app: Application = express(); // Explicitly type app as Application
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(function(err:any, req:any, res:any, next:any) {
  console.log(err);
});
app.use(cors({
  origin: 'http://localhost:8000' // Allow requests from your frontend origin
}));
app.use(bodyParser.json()); // Parse JSON data in request body
// Interface for Message data
interface Message {
  id: number;
  content: string;
}

// Sample data (replace with database connection if needed)
let messages: Message[] = [
  { id: 1, content: 'Hello from message 1' },
  { id: 2, content: 'This is message number 2' },
];

// GET /messages endpoint (type annotations for request and response)
app.get('/messages', (req: Request, res: Response) => {
  res.json(messages);
});

// Example POST /messages endpoint (type annotation for request body)
app.post('/messages', (req: Request<{}, Message>, res: Response) => {
  const newMessage = { 
    id: Math.max(...messages.map(msg => msg.id)) + 1, 
    content: req.body.data 
  };
  console.log("adding new message:", newMessage);
  messages.push(newMessage); // Add to sample data (replace with database)
  console.log("messages:", messages);
  res.json({ message: 'Message added successfully' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
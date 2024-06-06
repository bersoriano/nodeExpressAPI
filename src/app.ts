import express, {Application} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import messageRoutes from './messageRoutes';
console.log("Starting a new API");
const app: Application = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json()); // Parse JSON data in request body
app.use(express.json());
app.use(function(err:any, req:any, res:any, next:any) {console.log(err);});
app.use(cors({origin: 'http://localhost:8000'}));
app.listen(port, () => {console.log(`Server listening on port ${port}`);});

app.use('/api/messages', messageRoutes);
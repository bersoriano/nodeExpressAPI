import express, {Application, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import countryRoutes from './countryRoutes';
const app: Application = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    next();
});
app.use(cors());
app.listen(port, () => {console.log(`Server listening on port ${port}`);});
app.use('/v1/', countryRoutes);
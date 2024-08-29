import express, {Application} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ZipoppotamAdapter } from './ZipoppotamAdapter';
import { createCountryService} from './countryService';
import { createCountryRouter } from './countryRoutes';
import { countries } from './messageModel';

const app: Application = express();
const port = process.env.PORT || 3000;

const setupMiddleware = (app:express.Application):void => {
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(cors());
}
const setupRoutes = (app:express.Application):void => {
    const zipoppotamAdapter = new ZipoppotamAdapter();
    const initialCountries =  countries;
    const countryService = createCountryService(zipoppotamAdapter, initialCountries);
    const countryRouter = createCountryRouter(countryService);
    app.use('/v1/', countryRouter);
}
const startServer = (app:express.Application, port:number | string):void => {
    app.listen(port, () => {console.log(`Server listening on port ${port}`);});
}
setupMiddleware(app);
setupRoutes(app);
startServer(app, port);
import { Router, Request, Response, NextFunction } from 'express';
import { CountryService } from './countryService';
import { BadRequestError } from './errorHandler';

const countryRoutes = Router();

export const createCountryRouter = (countryService: CountryService):Router => {
  const router = Router();

  const getLocationData = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const { country, zipcode } = req.params;
      const locationData = await countryService.getLocationData(country, zipcode);
      res.json(locationData);
    } catch (error) {
      next(error);
    }
  }

  const getAllCountries = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const allCountries = await countryService.getAllCountries();
      res.json(allCountries);
    } catch (error) {
      next(error);
    }
  }

  const addLocation = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const {country, zip} = req.body;
      if (!country || !zip) {
        res.status(400).json({error: 'Country and zipcode are required'});
      }
      const newLocation = await countryService.addLocation(country, zip);
      res.json(newLocation);
      res.status(201);
    }
    catch (error) {
      next(error);
    }
  }

  const deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError('Invalid ID provided.');
      }
      const deletedLocation = await countryService.deleteLocation(id);
      res.json(deletedLocation);
    } catch (error) {
      next(error);
    }
  };

  router.get('/:country/:zip', getLocationData);
  router.get('/countries', getAllCountries);
  router.post('/countries', addLocation);
  router.delete('/countries/:id', deleteLocation);

  return router;
}

export default countryRoutes;
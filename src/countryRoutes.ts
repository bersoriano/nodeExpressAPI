import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Location, countries } from './messageModel';
const countryRoutes = Router();

countryRoutes.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

countryRoutes.get('/:country/:zip', async (req: Request, res: Response, next) => {
  const { country, zip } = req.params;
  const data = req.body;
  const url = `https://api.zippopotam.us/${country}/${zip}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Zippopotam.us' });
  }
});

countryRoutes.get('/countries/', async (req: Request, res: Response, next) => {
  try {
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Zippopotam.us' });
  }
});

countryRoutes.post('/countries/', async (req: Request, res: Response, next) => {
  console.log('post req>>>', req);
  const { country, zip } = req.body;
  if (!country || !zip) {
    return res.status(400).json({ error: 'Country and zip are required.' });
  }
  const url = `https://api.zippopotam.us/${country}/${zip}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    const newLocation: Location = {
      id: countries.length + 1,
      'post code': data['post code'],
      country: data.country,
      'country abbreviation': data['country abbreviation'],
      places: data.places.map((place: any) => ({
        'place name': place['place name'],
        longitude: place['longitude'],
        state: place['state'],
        stateAbbreviation: place['state abbreviation'],
        latitude: place['latitude']
      }))
    };
    countries.push(newLocation);
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Zippopotam.us' });
  }
});

countryRoutes.delete('/countries/:id', async (req: Request, res: Response, next) => {
  const userIndex = countries.findIndex(l => l.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    const deletedUser = countries.splice(userIndex, 1);
    res.json(deletedUser);
  }
  else {
    res.status(404).json({ error: 'User not found' });
  }
});

countryRoutes.get('/countries', (req: Request, res: Response) => {
  res.json(countries);
});

export default countryRoutes;
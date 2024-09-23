import { Location } from './messageModel';
import { ZipoppotamAdapter } from './ZipoppotamAdapter';
import { HttpError, NotFoundError, BadRequestError } from './errorHandler';

type GetLocationData = (country: string, zipcode: string) => Promise<Location>;
type GetAllCountries = () => Promise<readonly Location[]>;
type AddLocation = (country: string, zipcode: string) => Promise<Location>;
type DeleteLocation = (id: number) => Promise<Location>;

export type CountryService = {
    getLocationData: GetLocationData;
    getAllCountries: GetAllCountries;
    addLocation: AddLocation;
    deleteLocation: DeleteLocation;
}

export const createCountryService = (
    zippopotamAdapter: ZipoppotamAdapter, 
    initialLocations: readonly Location[]) => {
    let countries: readonly Location[] = initialLocations;
    const getLocationData: GetLocationData = (country, zipcode) => zippopotamAdapter.getLocation(country, zipcode);
    const getAllCountries:GetAllCountries = async () => countries;
    const addLocation: AddLocation = async (country, zipcode) => {
        try {
            const locationData = await zippopotamAdapter.getLocation(country, zipcode);
            if (!locationData) {
                throw new Error('No data received from Zippopotam service');
            }
            const newLocation = {
                ...locationData,
                id: Math.max(0, ...countries.map(c => c.id)) + 1,
            }
            countries = [...countries, newLocation];
            return newLocation;
        } catch (error) {
            if (error instanceof HttpError || error instanceof NotFoundError || error instanceof BadRequestError) {
                throw error;
            }
            throw new HttpError(500, 'Failed to add location due to an unexpected error');
        }
    }
    const deleteLocation: DeleteLocation = async (id) => {
        const locationIndex = countries.findIndex(country => country.id === id);
        if (locationIndex === -1) {
            throw new NotFoundError(`Location with id ${id} not found`);
        }
        const deletedLocation = countries[locationIndex];
        countries = [
            ...countries.slice(0, locationIndex),
            ...countries.slice(locationIndex + 1)
        ];
        return deletedLocation;
    }
    return {
        getLocationData,
        getAllCountries,
        addLocation,
        deleteLocation
    }
}
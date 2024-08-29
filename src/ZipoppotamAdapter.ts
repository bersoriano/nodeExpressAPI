import axios, { AxiosError } from 'axios';
import { Location, Place } from './messageModel';
import { HttpError, NotFoundError, BadRequestError } from './errorHandler';

export class ZipoppotamAdapter {
    private baseUrl = 'https://api.zippopotam.us/';

    async getLocation(country: string, zipcode: string) {
        const url = `${this.baseUrl}/${country}/${zipcode}`;
        try {
            const { data } = await axios.get<Location>(url);
            return this.transformData(data);
        } catch (error) {
            this.handleError(error);
        }       
    }

    private transformData(data: Location): Location {
        return {
            id: 0,
            'post code': data['post code'],
            country: data.country,
            'country abbreviation': data['country abbreviation'],
            places: data.places.map(this.transformPlace),
        }
    }

    private transformPlace(place: Location['places'][0]): Place {
        return {
            'place name': place['place name'],
            longitude: place.longitude,
            state: place.state,
            stateAbbreviation: place.stateAbbreviation,
            latitude: place.latitude
        }
    }

    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                switch (axiosError.response.status) {
                    case 404:
                        throw new NotFoundError('Location not found');
                    case 400:
                        throw new BadRequestError('Invalid country or zip code');
                    default:
                        throw new HttpError(axiosError.response.status, 'Error fetching data from Zippopotam.us');
                }
            }
        }
        throw new HttpError(500, 'Unexpected error occurred while fetching location data');
    }
}
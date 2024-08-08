export type Country = {
  id: number;
  name: string,
  zipcode: number;
}

export type Location = {
  id: number;
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

export type Place = {
  'place name': string;
  longitude: string;
  state: string;
  stateAbbreviation: string;
  latitude: string;
}

export let countries: Location[] = [
  {
    id: 1,
    'post code': "90210",
    country: "United States",
    'country abbreviation': "US",
    places: [
      {
        'place name': "Beverly Hills",
        longitude: "-118.4065",
        state: "California",
        stateAbbreviation: "CA",
        latitude: "34.0901"
      }
    ]
  }
];
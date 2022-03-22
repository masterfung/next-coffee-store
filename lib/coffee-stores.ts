// Unsplash Init
import { createApi } from 'unsplash-js';

// on your node server
export const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const fetchCoffeePhotos = async () => {
  const imagesResponse = await unsplashApi.search.getPhotos({
    query: 'coffee store',
    perPage: 40,
    orientation: 'landscape',
  });
  const unsplashResponse = imagesResponse.response.results;
  return unsplashResponse.map(res => res.urls['small']);
  
}

export const fetchCoffeeData = async (ll = "37.778313124910575%2C-122.41536406939167", query = "coffee", limit=6) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
    }
  };

  const photos = await fetchCoffeePhotos();

  const response = await fetch(`https://api.foursquare.com/v3/places/nearby?ll=${ll}&query=${query}&limit=${limit}`, options)
  const data = await response.json();
  return data?.results?.map((venue, idx) => { 
    const neighbourhood = venue.location.neighborhood;
    return {
      id: venue.fsq_id,
      address: venue.location.address || "",
      name: venue.name,
      neighbourhood: (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) || venue.location.cross_street || "",
      imgUrl: photos[idx],
    };
  }) || [];
}
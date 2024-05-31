import { BASE_URL } from '../utils/index';

export async function GetViewportTutors(viewport) {
  const URL =
    BASE_URL +
    'tours?lat_bottom_right=' +
    viewport.southwest.lat +
    '&lon_bottom_right=' +
    viewport.northeast.lng +
    '&lat_top_left=' +
    viewport.northeast.lat +
    '&lon_top_left=' +
    viewport.southwest.lng;
  const response = await fetch(URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

/**
 * @format
 */

// import 'react-native';
// import React from 'react';
// import App from '../src/App.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native-gesture-handler', () => {});

const fetch = require('node-fetch');

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

async function GetViewportTutors(viewport) {
  const URL =
    'https://staging.tourmega.com/api/v2/' +
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

it('check if tours api is working correct', async () => {
  const viewport = {
    southwest: {
      lat: 37.0768407426,
      lng: -122.7395329002,
    },
    northeast: {
      lat: 37.599575657399996,
      lng: -121.03312429980001,
    },
  };
  const response = await GetViewportTutors(viewport);
  expect(response.data.length).toBeGreaterThanOrEqual(0);
});

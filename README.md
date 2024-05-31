# TourMega Test Project

### This project includes GOOGLE API_KEY. Don't share it with others

I registered a user on https://staging.tourmega.com/

  Then I can get auth token from /api/v2/login by using my credential
    
Next, By using that token, I also got the data from /api/v2/cities

     "data": [
        {
            "id": 1,
            "name": "Dhaka",
            "country_id": 19,
            "slug": "dhaka"
        },
        {
            "id": 2,
            "name": "Phnom Penh",
            "country_id": 115,
            "slug": "phnom-penh"
        },
        {
            "id": 3,
            "name": "Beijing",
            "country_id": 46,
            "slug": "beijing"
        },
        ...........
      ]

The other apis are similar
If you want to integrate other apis, it would be no problem for me :)

------------------------------------------------------------------------------------

I integrated JEST for unit test

On the app, when call your tours api, it needs parameters
Then, when you click the place on the location screen, it will get data like below

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

I sent parameters like below
    
    lat_bottom_right: viewport.southwest.lat,
    lon_bottom_right: viewport.northeast.lng,
    lat_top_left: viewport.northeast.lat,
    lon_top_left: viewport.southwest.lng,

If the retrieved data length is greater than 0, it means that API is working well

## About

This map gives clues to the likely locations of decorations in the game Pikmin Bloom. Data displayed on this map is from Open Street Map, and may not fully reflect what is displayed in the game.

This application is not affiliated with Nintendo or Niantic Lab. The decoration category icons come from the game. This application is developed and maintained by [pixelpirate](https://pixelpirate.fr).

## How does it works?

To understand how this application works, you need to understand how the game determines the location of the decorations.

### How the game's map works

Once in a while (approximately once a year for a rough estimate, but it's very irregular), the game collects information about the features of the landscape, roads, and buildings.
As the player moves around the environment, the game loads the map, along with information about what's around them.
For example, if the player is near a restaurant, the game will display the **restaurant** icon.

### Game data sources

Now, how does the game determine that there is a restaurant in this location? It seems that the game uses at least two sources of data:

- Open Street Map (OSM): For map backgrounds and the majority of geolocated data.
- Foursquare: For some geolocated data.

### How this map works

This map relies exclusively on data available on OSM, the Foursquare data is therefore missing. In our example, restaurants appear to be associated with the OSM `amenity=restaurant` tag.
When the **restaurant** deco is selected, the application asks OSM to give it the objects that contain the [`amenity=restaurant`](https://wiki.openstreetmap.org/wiki/Key:amenity) tag and to display them on the map.
OSM does not have a function for directly retrieving objects for a particular tag. This application uses the Overpass-Turbo tool to retrieve this data.

### Tips

This application is designed to be pinned to your phone screen! To do this
- On Android: Open your browser on your Android phone -> Go to the address of this application -> Press the icon with three dots at the top right of the screen and select "Add to home screen".
- On iOS: Open Safari on your iPhone -> Go to the address of this application -> Press the share icon at the bottom of the screen and select "Add to home screen".

These steps may sligthly vary from one phone to another.

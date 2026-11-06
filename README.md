# Pikmin Map

## Introduction

This map provides clues to the likely locations of decorations in the game Pikmin Bloom. Data displayed on this map is sourced from OSM and may not fully reflect what is displayed in the game.

Live version : [pikmin-map.pixelpirate.fr](https://pikmin-map.pixelpirate.fr)

## Contributions

You can contribute to the application, submit corrections or improvements by creating a pull request. For example:

- Adding or deleting tags to the categories
- Adding tags when new geolocated Pikmin decorations are added to the game
- Adding new content and translations

If you're not familiar with coding, leave a message in the Issues or Discussions section; we welcome any help you can offer!

## Development

This project is developed with [Angular v17](https://v17.angular.io/docs).

### Prerequisites

Make sure you have the following installed:
1. **Node.js & npm:** Download it [from here](https://nodejs.org/)
2. **Angular CLI:** Install it with:
   ```sh
   npm install -g @angular/cli
   ```

### Getting started

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/pikmin-map.git
   cd pikmin-map
   ```
2. Install project dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm start
   ```
4. Open `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

Note: Game assets are not included in this repository. See [icons README](https://github.com/pixlpirate/pikmin-map/blob/main/src/assets/icons/README.md)

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Post-build scripts are located in the `./scripts` folder.

### Where the data comes from

The map asks a self-hosted mirror first: [pikmin-map-data](https://github.com/pixlpirate/pikmin-map-data),
a SQLite copy of the OSM data this map queries. Only when the mirror cannot answer
(the area is not covered, or it is down or too slow) is the query sent to the public
Overpass instance at overpass-api.de, so that instance is kept for what the mirror
does not have rather than used for every pan of the map. The mirror's data is refreshed
by hand about every six months, or when the game updates its map, so it can be a little
behind OSM; overpass-api.de is live.

The About page has a "Data source" picker with just those two, pixelpirate.fr (the default)
and overpass-api.de, and remembers the choice once it has been made. Picking
overpass-api.de sends every query there.

Nothing needs setting up to run the app: `npm start` uses the deployed mirror, which
allows `http://localhost:4200`. To try your own `pikmin-map-data` checkout, set
`mirrorInstance` in `src/environments/environment.development.ts` to `/api/overpass.php`,
copy `proxy.conf.example.json` to `proxy.conf.json`, point its `pathRewrite` at the
checkout, and run `ng serve --proxy-config proxy.conf.json`.

## License

This project is distributed under the GNU GPLv3 license. You can redistribute and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation. More information is available in the attached license file.

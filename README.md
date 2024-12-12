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
   ng serve
   ```
4. Open `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

Note: Game assets are not included in this repository. See [icons README](https://github.com/pixlpirate/pikmin-map/blob/main/src/assets/icons/README.md)

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Post-build scripts are located in the `./scripts` folder.

## License

This project is distributed under the GNU GPLv3 license. You can redistribute and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation. More information is available in the attached license file.

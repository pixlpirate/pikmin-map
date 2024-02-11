## Sobre

Este mapa da pistas sobre las ubicaciones probables de las decoraciones en el juego Pikmin Bloom. Los datos mostrados en este mapa pueden no reflejar completamente lo que se muestra en el juego.

Esta aplicación no está afiliada a Nintendo ni a Niantic Lab. Los iconos de la categoría de decoración provienen del juego. Esta aplicación está desarrollada y mantenida por [pixelpirate](https://pixelpirate.fr).

## ¿Cómo funciona?

Para entender cómo funciona esta aplicación, debes comprender cómo determina el juego la ubicación de las decoraciones.

### Cómo funciona el mapa del juego

De vez en cuando (aproximadamente una vez al año como una estimación aproximada, pero es muy irregular), el juego recopila información sobre las características del paisaje, las carreteras y los edificios.
A medida que el jugador se mueve por el entorno, el juego carga el mapa, junto con información sobre lo que hay a su alrededor.
Por ejemplo, si el jugador está cerca de un restaurante, el juego mostrará el icono **restaurante**.

### Fuentes de datos del juego

¿Cómo determina el juego que hay un restaurante en ese lugar? Parece que el juego utiliza al menos dos fuentes de datos:

- Open Street Map (OSM): Para fondos de mapa y la mayoría de datos geolocalizados.
- Foursquare: Para algunos datos geolocalizados.

### Funcionamiento de esta tarjeta

Este mapa se basa exclusivamente en los datos disponibles en OSM, por lo que faltan los datos de Foursquare. En nuestro ejemplo, los restaurantes aparecen asociados a la etiqueta OSM `amenity=restaurant`.
Cuando se selecciona el deco **restaurante**, la aplicación pide a OSM que le proporcione los objetos que contienen la etiqueta [`amenity=restaurant`](https://wiki.openstreetmap.org/wiki/Key:amenity) y que los muestre en el mapa.
OSM no tiene una función para recuperar directamente objetos para una etiqueta en particular. Esta aplicación utiliza la herramienta Overpass-Turbo para recuperar estos datos.

### Consejos

Esta aplicación está diseñada para ser fijada a la pantalla de tu teléfono. Para ello
- En Android: Abra su navegador en su teléfono Android 🠖 Vaya a la dirección de esta aplicación 🠖 Pulse el icono con tres puntos en la parte superior derecha de la pantalla y seleccione "Añadir a la pantalla de inicio".
- En iOS: Abra Safari en su iPhone 🠖 Vaya a la dirección de esta aplicación 🠖 Pulse el icono de compartir en la parte inferior de la pantalla y seleccione "Añadir a la pantalla de inicio".

Estos pasos pueden variar ligeramente de un teléfono a otro.
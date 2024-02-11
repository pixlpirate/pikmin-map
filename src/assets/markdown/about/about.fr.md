## À propos

Cette carte donne des indices sur les emplacements probables des décorations du jeu Pikmin Bloom. Les données affichées sur cette carte proviennent d'Open Street Map, il est possible qu'elle ne reflètent pas entièrement ce qui est affiché dans le jeu.

Cette application n'est pas affiliée à Nintendo ou Niantic Lab. Les icônes de la catégorie de décoration proviennent du jeu. Cette application est développée et maintenue par [pixelpirate](https://pixelpirate.fr).

## Comment ça marche&nbsp;?

Pour comprendre comment cette application fonctionne, il faut comprendre comment le jeu détermine l’emplacement des décos.

### Fonctionnement de la carte du jeu

Une fois de temps en temps (approximativement une fois par an, pour donner un ordre de grandeur, mais c’est très irrégulier), le jeu récolte des informations sur les caractéristiques du paysage, des routes et des bâtiments.
Lorsque le joueur se déplace dans l’environnement, le jeu charge la carte, ainsi que les informations associées à ce qui se trouve autour de lui.
Par exemple, si le joueur se trouve proche d’un restaurant, le jeu affichera l’icône **restaurant**.

### Sources des données du jeu

Maintenant, comment est-ce que le jeu détermine qu’il y a un restaurant à cet emplacement&nbsp;? Il semble que le jeu utilise au moins deux sources de données&nbsp;:

- Open Street Map (OSM)&nbsp;: Pour les fonds de carte et la majorité des données géolocalisées.
- Foursquare&nbsp;: Pour certaines données géolocalisées.

### Fonctionnement de cette carte

Cette carte se base exclusivement sur les données disponibles sur OSM, les données de Foursquare sont par conséquent manquantes. Dans notre exemple, les restaurants semblent associés au tag OSM `amenity=restaurant`.
Lorsque l’on sélectionne le déco **restaurant**, l’application demande à OSM de lui donner les objets qui contiennent le tag [`amenity=restaurant`](https://wiki.openstreetmap.org/wiki/Key:amenity) et de les afficher sur la carte.
OSM ne dispose pas d’une fonction permettant de récupérer directement des objets pour un tag en particulier. Cette application utilise l’outil Overpass-Turbo pour récupérer ces données.

### Astuces

Cette application est conçue pour pouvoir être épinglée à l'écran de votre téléphone&nbsp;! Pour cela&nbsp;:
- Sur Android&nbsp;: Ouvrez votre navigateur sur votre téléphone Android 🠖 Rendez vous à l'adresse de cette application 🠖 Appuyez sur l'icône avec trois points en haut à droite de l'écran et sélectionnez "Ajouter à l'écran d'accueil"
- Sur iOS&nbsp;: Ouvrez Safari sur votre iPhone 🠖 Rendez vous à l'adresse de cette application 🠖 Appuyez sur l'icône de partage en bas de l'écran et sélectionnez "Ajouter à l'écran d'accueil"

Ces manipulations peuvent sensiblement varier d'un téléphone à l'autre.


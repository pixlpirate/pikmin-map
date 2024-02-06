## Sobre

Este mapa dá pistas sobre as localizações prováveis das decorações no jogo Pikmin Bloom. Os dados apresentados neste mapa podem não refletir totalmente o que é apresentado no jogo.

Esta aplicação não é afiliada à Nintendo ou à Niantic Lab. Os ícones das categorias de decoração e a ilustração da flor vermelha são provenientes do jogo. Esta aplicação é desenvolvida e mantida por [pixelpirate] (https://pixelpirate.fr).

## Como funciona?

Para compreenderes o funcionamento desta aplicação, tens de compreender como o jogo determina a localização das decorações.

### Como funciona o mapa do jogo

De vez em quando (aproximadamente uma vez por ano para dar uma ideia geral, mas é muito irregular), o jogo coleta informações sobre as características da paisagem, das estradas e dos edifícios.
À medida que o jogador se desloca pelo ambiente, o jogo carrega o mapa, juntamente com informações sobre o que está à sua volta.
Por exemplo, se o jogador estiver perto de um restaurante, o jogo mostra o ícone **restaurante**.

### Fontes de dados do jogo

Agora, como é que o jogo determina que existe um restaurante neste local? Parece que o jogo utiliza pelo menos duas fontes de dados:

- Open Street Map (OSM): Para fundos de mapas e a maioria dos dados geolocalizados.
- Foursquare: Para alguns dados geolocalizados.

### Funcionamento deste cartão

Este mapa baseia-se exclusivamente nos dados disponíveis no OSM, pelo que faltam os dados do Foursquare. No nosso exemplo, os restaurantes parecem estar associados à etiqueta OSM `amenity=restaurant`.
Quando o deco **restaurante** é selecionado, a aplicação pede ao OSM que lhe dê os objectos que contêm a etiqueta [`amenity=restaurant`] (https://wiki.openstreetmap.org/wiki/Key:amenity) e que os apresente no mapa.
O OSM não tem uma função para obter diretamente objectos para uma determinada etiqueta. Esta aplicação utiliza a ferramenta Overpass-Turbo para obter estes dados.

### Dicas

Esta aplicação foi concebida para ser fixada no ecrã do seu telemóvel! Para o fazer
- No Android: Abra o browser no seu telemóvel Android -> Vá para o endereço desta aplicação -> Prima o ícone com três pontos no canto superior direito do ecrã e seleccione "Adicionar ao ecrã inicial".
- No iOS: Abra o Safari no seu iPhone -> Vá para o endereço desta aplicação -> Prima o ícone de partilha na parte inferior do ecrã e seleccione "Adicionar ao ecrã inicial".

Estes passos podem variar ligeiramente de um telemóvel para outro.
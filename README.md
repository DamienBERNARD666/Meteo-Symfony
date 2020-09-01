# Meteo-Symfony

### Objectifs

Le but de cet exercice est de récupérer les données météo via l'API https://openweathermap.org et de l'afficher dans une page web.

L'objectif principal de cet exercice est d'évaluer la capacité à utiliser le PHP, JS, HTML, CSS. 

### Informations utiles

La technologie utilisée est `symfony 4.3.2`

L'api utilisé pour récupérer la météo est `Open Weather`.

L'api utilisé pour la gestion de la carte/autocomplet est `HERE`.

La fonction `dump` de symfony permet d'afficher des données lorsqu'on est en mode debug.

### Installation du projet

Installer composer: https://getcomposer.org/
Clonner le repo git sur votre PC
Lancer la commande `composer install`
Se créer un compte sur le site `https://openweathermap.org/`, obtenir une clef d'API gratuite.
Se créer un compte sur le site `https://developer.here.com/`, pour également obtenir une clé API.
Renseigner la clef dans la variable d'environnement `WEATHER_API_KEY` (suivre les instructions fournies dans le fichier `.env`)
Renseigner la deuxiéme clé dans le fichier src/assets/script.js à la ligne 55.
Lancer la commande `php bin/console server:run` pour lancer un serveur web qui écoute sur l'adresse `http://127.0.0.1:8000`
La page qui affichera la météo est disponible à l'url `http://127.0.0.1:8000`

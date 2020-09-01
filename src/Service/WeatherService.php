<?php

namespace App\Service;

use Symfony\Component\HttpClient\HttpClient;

class WeatherService
{
    private $client;
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->client = HttpClient::create();
        $this->apiKey = $apiKey;
    }

    /**
     * @return array
     */
    public function getWeather($id)
    {
        try {
            // Tente la communication avec l'API OpenWeatherMap
            $response = $this->client->request('GET', 'https://api.openweathermap.org/data/2.5/weather?id=' . $id . '&appid=' . $this->apiKey);
        } catch (\Exception $e) {
            //Gére les cas d'erreur
            return ['error' => 'L\'API OpenWeatherMap n\'est pas disponible pour le moment.'];
        }
        //Récupére la réponse du serveur
        $content = json_decode($response->getContent());

        //Retourne les élements nécessaires à l'affichage
        return [
            'temperature' => $content->main->temp - 273, 15, // en celsius
            'temperature_min' => $content->main->temp_min - 273.15,
            'temperature_max' => $content->main->temp_max - 273.15,
            'precipitations' => $content->clouds->all,
            'humidite' => $content->main->humidity,
            'vent' => $content->wind->speed * pow(10, -3) * 3600, // en km
            'pression' => $content->main->pressure,
            'nom' => $content->name
        ];
    }

    /**
     * @return array
     */
    public function getWeatherByCoordinates($lat, $lon)
    {
        try {
            //Tente la communication avec l'API OpenWeatherMap
            $response = $this->client->request('GET', 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lon . '&appid=' . $this->apiKey);

            //Récupére la réponse du serveur
            $content = json_decode($response->getContent());
            //Récupére seulement l'id de la ville et la renvoie
            return $content->id;
        } catch (\Exception $e) {

            //Gestion des erreurs
            return $e;
        }
    }
}

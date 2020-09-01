<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use App\Service\WeatherService;
use Exception;

class WeatherController extends AbstractController
{
    private $weatherService;

    public function __construct(WeatherService $weather)
    {
        $this->weatherService = $weather;
    }

  
    /**
     * @Route("/{id}", name="weather", defaults={"id"="2972315"}) // Définis la route initiale avec comme paramètre l'ID de la ville concernée, par défaut Toulouse
     * @Method({"GET", "POST"})
     */
    public function index($id)
    {
        $weather = $this->weatherService->getWeather($id);
        // Gestion du cas d'erreur
        if($weather instanceof Exception) {
            return $this->render('weather/error.html.twig', array(
                'exception' => $weather
            ));
        } else {
            return $this->render('weather/index.html.twig', array(
                'weather' => $weather
            ));
        }
    }

 /**
     * @Route("/{lat}/{lon}", name="coord_weather")
     * // Définis la route avec comme paramètre la latiitude et la longitude afin d'obtenir l'ID de la ville concerné et de retourner à la page intiale avec ce paramètre.
     */
    public function getByCoordinates($lat, $lon)
    {
        $weatherId = $this->weatherService->getWeatherByCoordinates($lat, $lon);
        if($weatherId instanceof Exception){
            return $this->render('weather/error.html.twig', array(
                'exception' => $weatherId
            ));
        }else{
            return $this->redirectToRoute('weather', array(
                'id' => $weatherId
            ));
        }
    }
}


var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json',
    ajaxRequest = new XMLHttpRequest(),
    query = '';

/**
*
* @param {Object} textBox the textBox DOM object linked to this event
* @param {Object} event the DOM event which fired this listener
*/
function autoCompleteListener(textBox, event) {

    if (query != textBox.value) {
        if (textBox.value.length >= 1) {
            var params = '?' +
                'query=' + encodeURIComponent(textBox.value) +   
                '&beginHighlight=' + encodeURIComponent('<mark>') +
                '&endHighlight=' + encodeURIComponent('</mark>') +
                '&maxresults=5' + 
                '&apikey=' + APIKEY;
            ajaxRequest.open('GET', AUTOCOMPLETION_URL + params);
            ajaxRequest.send();
        }
    }
    query = textBox.value;
}

function onAutoCompleteSuccess() {
    clearOldSuggestions();
    addSuggestionsToPanel(this.response);  // In this context, 'this' means the XMLHttpRequest itself.
    addSuggestionsToMap(this.response);
}

/**
 * Gestion d'erreur
 */
function onAutoCompleteFailed() {
    alert('Ooops!');
}

/**
 * Ajoute la gestion d'évenement à la requête
 */
ajaxRequest.addEventListener("load", onAutoCompleteSuccess);
ajaxRequest.addEventListener("error", onAutoCompleteFailed);
ajaxRequest.responseType = "json";


/**
 * Récupere l'endroit où placer la carte et l'input de recherche
 */
var mapContainer = document.getElementById('map'),
    suggestionsContainer = document.getElementById('panel');

var APIKEY = 'TiocCu7O3opVfclMB2JBiWlOiYO_ARXN5HiQMJiuRCM';

var platform = new H.service.Platform({
    apikey: APIKEY,
    useCIT: false,
    useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();
var geocoder = platform.getGeocodingService();
var group = new H.map.Group();

group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getGeometry());
    openBubble(
        evt.target.getGeometry(), evt.target.getData());
}, false);


/**
 * Initilisation de la carte
 */
var map = new H.Map(mapContainer,
    defaultLayers.vector.normal.map, {
    center: { lat: 43.6043, lng: 1.4437 },
    zoom: 5
});

map.addObject(group);


var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);
var bubble;

/**
* Function to Open/Close an infobubble on the map.
* @param  {H.geo.Point} position     The location on the map.
* @param  {String} text              The contents of the infobubble.
* Ajout des infobulles avec buton de redirection vers la ville concernée
*/
function openBubble(position, text) {
    if (!bubble) {
        var latlog = (new String(position)).replace(/[()]/g, '');
        var latlog2 = latlog.slice(6);
        var latlogarray = latlog2.split(/[ ,]+/);
        var lat = new Number(latlogarray[0]);
        var long = new Number(latlogarray[1]);
        bubble = new H.ui.InfoBubble(
            position,
            { content: '<small>' + text + '</small>' + '<button type="button" onclick="reloadPage(' + lat + ', ' + long + ')" class="btn btn-light"> Voir la météo <i class="far fa-paper-plane"></i></button>' });
        ui.addBubble(bubble);
    } else {
        bubble.setPosition(position);
        bubble.setContent('<small>' + text + '</small>' + '<button type="button" onclick="reloadPage(' + lat + ', ' + long + ')" class="btn btn-light">Voir la météo <i class="far fa-paper-plane"></i></button>');
        bubble.open();
    }
}
function reloadPage(lat, long) {
    window.location.replace('/' + long + '/' + lat);
}


/**
*
* @param {Object} response
*/
function addSuggestionsToMap(response) {
    /**
     * @param  {Object} result          A JSONP object representing the  location(s) found.
     */
    var onGeocodeSuccess = function (result) {
        var marker,
            locations = result.Response.View[0].Result,
            i;

        // Add a marker for each location found
        for (i = 0; i < locations.length; i++) {
            marker = new H.map.Marker({
                lat: locations[i].Location.DisplayPosition.Latitude,
                lng: locations[i].Location.DisplayPosition.Longitude
            });
            marker.setData(locations[i].Location.Address.Label);
            group.addObject(marker);
        }

        var alertContainer = document.getElementById('searchTown');
        alertContainer.innerHTML = '<div  class="alert alert-danger pt-3 text-center"> Sélectionner la ville qui correspond à votre recherche </div>';

        map.getViewModel().setLookAtData({
            bounds: group.getBoundingBox()
        });
        if (group.getObjects().length < 2) {
            map.setZoom(15);
        }
    },
        /**
         * This function will be called if a communication error occurs during the JSON-P request
         * @param  {Object} error  The error message received.
         */
        onGeocodeError = function (error) {
            alert('Ooops!');
        },
        /**
         * @param {string} locationId    The id assigned to a given location
         */
        geocodeByLocationId = function (locationId) {
            geocodingParameters = {
                locationId: locationId
            };

            geocoder.geocode(
                geocodingParameters,
                onGeocodeSuccess,
                onGeocodeError
            );
        }

    response.suggestions.forEach(function (item, index, array) {
        geocodeByLocationId(item.locationId);
    });
}

function clearOldSuggestions() {
    group.removeAll();
    if (bubble) {
        bubble.close();
    }
}

/**
* @param {Object} response
*/
function addSuggestionsToPanel(response) {
    var suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = JSON.stringify(response, null, ' ');
}

var content = ' <label  class="btn btn-light" for="auto-complete">Rechercher votre ville <i class="fas fa-home"></i></label> <input class="form-control form-control-lg" type="text" id="auto-complete" onkeyup="return autoCompleteListener(this, event);">';
suggestionsContainer.innerHTML = content;   
$(document).ready(function(){
    // RESET THE FILTER
    var filters = "";

    //GET BREWERIES FILE
    $.post('JSON/breweries.json', function(data1, status1) {
        $.post('JSON/beers.json', function(data2, status2) {
            getAdd(data1, data2);
            getBeers(data1, data2);
        });
    });

    function getAdd(breweries, beers) {
        // for(var i=0; i<(Object.keys(breweries.breweries).length); i++ {
        //
        // }
    }

    function getBeers(breweries, beers) {
    }
})//END PAGE LOAD

var map;
//INITIALIZE THE MAP
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        mapTypeId: 'terrain',
        maxZoom: 15,
        minZoom: 5
    });

    getUserCenter(filters, map);

    //ADD ALL THE BREWERIES TO THE MAP
    $.post('JSON/geocode.json', function(data, status) {
        for(var i=0; i<(Object.keys(data.breweries_geocode).length); i++) {
            var lat = data.breweries_geocode[i].latitude;
            var long = data.breweries_geocode[i].longitude;

            var latlng = new google.maps.LatLng(lat,long);

            var marker = new google.maps.Marker({
                map: map,
                position: latlng
            });
        }
    });

    /**************************FUNCTIONS***********************/
    function getUserCenter(filter, map) {
        //IF FILTER ISN'T NULL, ASSIGN CENTER TO THE LOCATION
        if(filter != null) {
            var obj = JSON.parse(filter);
            var geo = new google.maps.Geocoder();
            geo.geocode({
                address: obj.filters.city + " " + obj.filters.country
            }, function (resultArr, status) {
                var latlng = resultArr[0].geometry.location
                return map.setCenter(latlng);
            })
        } else {
            return map.setCenter(new google.maps.LatLng(39.007504, -94.5786));
        }
    }
/**************************FUNCTIONS***********************/

}//END INITIALIZE MAP
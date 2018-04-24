$(document).ready(function(){


    // GET BEERS FILE
    // $.post('beers_array.php', function(data, status) {
    //     console.log(data);
    // });



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

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(39.007504, -94.5786),
        mapTypeId: 'terrain',
        maxZoom: 15,
        minZoom: 5
    });

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

    var geo = new google.maps.Geocoder();
    geo.geocode({address: "Illinois"}, function(results, status){
        if(status == "OK") {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });//END GEOCODE


}//END INITIALIZE MAP

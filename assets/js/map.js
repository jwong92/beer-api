$(document).ready(function(){


})//END PAGE LOAD


// GOOGLE MAP
var filters;
var map;
var marker;
var latlngArr = [];

//INITIALIZE THE MAP
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 15,
        minZoom: 5
    });

    if(filters) {
        getUserCenter(map, filters);
    } else {
        getUserCenter(map);
    }

    //ADD ALL THE BREWERIES TO THE MAP
    $.post('JSON/geocode.json', function(data, status) {
        for(var i=0; i<(Object.keys(data.breweries_geocode).length); i++) {
            var lati = data.breweries_geocode[i].latitude;
            var long = data.breweries_geocode[i].longitude;
           var latlng = new google.maps.LatLng(lati, long);
            placeMarker(map, latlng, marker);

            //PUSH ALL THE GEOCODES TO THE LATLNGARR
            latlngArr.push(latlng);
        }

        //ADD LISTENER TO MAP. WHEN IDLE, DETERMINE THE VISIBLE MARKERS
        google.maps.event.addListener(map, 'idle', function () {
            showVisibleMarkers(map, latlngArr, data);
        });
    });



    /**************************FUNCTIONS***********************/
    function getUserCenter(map, filter = "") {
        //IF FILTER ISN'T NULL, ASSIGN CENTER TO THE LOCATION
        if(filter != "") {
            var obj = JSON.parse(filter);
            var geo = new google.maps.Geocoder();
            geo.geocode({
                address: obj.filters.city + " " + obj.filters.country
            }, function (resultArr, status) {
                var poslatlang = resultArr[0].geometry.location
                return map.setCenter(poslatlang);
            })
        } else {
            return map.setCenter(new google.maps.LatLng(39.007504, -94.5786));
        }
    }

    //PLACE MARKER, RETURN CLICKED MARKER LATLNG
    function placeMarker(map, latlng, marker) {
        marker = new google.maps.Marker({
            map: map,
            position: latlng
        });
        //IF USER CLICKS A MARKER
        marker.addListener("click", function() {
            //GET THE LATLNG AND CONVERT
            var selLatLng = marker.getPosition();
            var selLat = selLatLng.lat();
            var selLng = selLatLng.lng();

            //OPEN BOTH GEOCODE AND BREWERY JSON
            $.post('JSON/geocode.json', function(geodata, geostatus) {
                $.post('JSON/breweries.json', function(brewdata, brewstatus) {
                    if(geostatus == brewstatus) {
                        //FOREACH GEOCODE, IF THE LAT AND LANG EQUAL THE ONE SELECTED
                        geodata.breweries_geocode.forEach(geocode => {
                            //CREATE A NEW LATLNG OBJECT BASED ON THE GEODATA TO COMPARE WITH SELECTED
                            var convertedGeoDataLatLng = new google.maps.LatLng(geocode.latitude, geocode.longitude);
                            //IF GET BREW ID OF LOCATION SELECTED
                            if (JSON.stringify(convertedGeoDataLatLng) == JSON.stringify(selLatLng)) {
                                var brewId = geocode.brewery_id;
                                brewdata.breweries.forEach(brew => {
                                    if (brewId == brew.id) {
                                        //RUN THE FUNCTION TO ADD A WINDOW
                                        var infowindow = new google.maps.InfoWindow();
                                            infowindow.setContent(createContentString(brew))
                                            infowindow.open(map, marker);
                                            map.addListener("click", function(){
                                                infowindow.close();
                                        })
                                    }
                                })//END BREWERIES JSON FOREACH
                            }//END IF GEOCODE == SELECTED GEOCODE
                        })//END GEOCODE JSON FOREACH
                    }//END ON SUCCESS OF POST
                });//END POST BREWRIES
            });//END POST GEOCODE
        })//END ADD LISTENER TO MARKER
    }//END PLACE MARKER

    //CREATES THE WINDOW STRING - ACCEPTS ONE OBJECT PARAM
    function createContentString(brewObj) {
        var name = brewObj.name;
        var escCharName = name.replace('\\', "");
        //BELOW CAN BE NULL
        var address = brewObj.address1;
        var escCharAdd = address.replace('\\', "");

        var city = brewObj.city;
        var escCharCity = city.replace('\\', "");

        var stateProv = brewObj.state;
        var escCharStateProv = city.replace('\\', "");

        var phone = brewObj.phone;        
        var website = brewObj.website;

        var cityState = city + ", " + stateProv;
        if(website != "") {
            var webLink = "<a href='"+website+"' target='_blank'>Website</a>";
            return "<div id='infowindow'><h3>" + escCharName + "</h3><p>" + escCharAdd +"</p><p>"+cityState+"</p><p>"+phone+"</p><p>"+webLink+"</p></div>";
        }

        return "<div id='infowindow'><h3>" + escCharName + "</h3><p>" + escCharAdd +"</p><p>"+cityState+"</p><p>"+phone+"</p></div>";
    }

    function showVisibleMarkers(map, latlngArr, geoData) {
        var bounds = map.getBounds();
        var latlngInBounds = [];

        //FOREACH OF THE LAT/LNG VALUES
        latlngArr.forEach(ltlg => {
            //IF THE BOUNDS CONTAIN THESE GEOCODES
            if (bounds.contains(ltlg)) {
                latlngInBounds.push(ltlg);
                //GET THE BREWERY ID FOR THESE GEOCODES
                geoData.breweries_geocode.forEach(geo => {
                    var boundedLtLg = new google.maps.LatLng(geo.latitude, geo.longitude);
                    if (JSON.stringify(ltlg) == JSON.stringify(boundedLtLg)) {
                        var brew_id = geo.brewery_id;
                        //GET THE BEER INFORMATION
                        $.post('JSON/beers.json', function(beerData, beerSuccess){
                            $.post('JSON/getBeerDetails.json', function(bDetailData, bDetailSuccess){
                                beerData.beers.forEach(beer => {
                                    bDetailData.
                                })
                            })
                        })
                    }
                })
            }
        })

        return bounds;
    }

    function createList() {

    }

    //GET THE COORDINATES OF ALL THE MARKERS WITHIN THE BOUNDS OF THE MAP

    //FROM THE COORDINATES, GET ALL THE BREWERIES VIA BREWERY ID
    //FROM THE BREWERY ID, GET THE BEER INFORMATION FOR EACH BREWERY
}
//END INITIALIZE MAP
/**************************FUNCTIONS***********************/




/* 
NOTES

MAP CLASS
map.getbounds -> RETURNS LatLngBounds
map.getProjection -> RETURNS PROJECTION(class)
PROJECTION (class) has two methods 1. fromLatLngToPoint(latlng[, point]) -> RETURNS point

var bounds = map.getBounds();

//FOR EACH OF THE MARKERS, CHECK IF THE BOUNDS CONTAIN THE LATLNG
for(var i=0; i<(Object.keys(data.breweries_geocode).length); i++ {

}


    function getGeocodeJson() {
        $.post('JSON/geocode.json', function (data, status) {
            return data;
        })
    }

    function getBrewJson() {
        $.post('JSON/breweries.json', function (data, status) {
            return data;
        })
    }

    function getBeerJson() {
        $.post('JSON/beers.json', function (data, status) {
            return data;
        })
    }


    allGeoJson = getGeocodeJson();
    allBrewJson = getBrewJson();
    allBeerJson = getBeerJson();




    //SEPARATELY CREATE A SEARCH FUNCTION TO LOOK FOR A SPECIFIC BEER TO SHOW UP ON THE MAP.
*/
$(document).ready(function(){
})//END PAGE LOAD


// GOOGLE MAP
var filters;
var map;
var marker;
var latlngArr = [];
var geoData;

//INITIALIZE THE MAP
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 15,
        minZoom: 5
        // gestureHandling: "none" 
    });

    if(filters) {
        getUserCenter(map, filters);
    } else {
        getUserCenter(map);
    }

    addBreweries(map, marker, latlngArr);


    map.addListener('idle', function () {
        //ADD LISTENER TO MAP. WHEN IDLE, DETERMINE THE VISIBLE MARKERS
        $.post('JSON/geocode.json', function(data, status) {
            showVisibleMarkers(map, latlngArr, data);
        })
    });

}//END INITIALIZE MAP
/**************************FUNCTIONS***********************/

//ADD ALL THE BREWERIES TO THE MAP
function addBreweries(map, marker, latlngArr) {
    $.post('JSON/geocode.json', function (data, status) {
        for (var i = 0; i < (Object.keys(data.breweries_geocode).length); i++) {
            var lati = data.breweries_geocode[i].latitude;
            var long = data.breweries_geocode[i].longitude;
            var latlng = new google.maps.LatLng(lati, long);
            placeMarker(map, latlng, marker);

            //PUSH ALL THE GEOCODES TO THE LATLNGARR
            latlngArr.push(latlng);
        }
        // showVisibleMarkers(map, latlngArr, data);
    });
}

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
        var cardArr = [];
        var count = 0;

        // FOREACH OF THE LAT/LNG VALUES
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
                        $.post('JSON/beers.json', function(beerData, beerSuccess) {
                            $.post('JSON/breweries.json', function(brewData, brewSuccess) {
                                brewData.breweries.forEach(brew => {
                                    if (brew_id == brew.id) {
                                        beerData.beers.forEach(beer => {
                                            if (brew_id == beer.brewery_id) {
                                                var card = createList(brew.name, brew.address1, beer.name, beer.abv, beer.ibu, beer.descript);
                                                count++;
                                                cardArr.push(card);
                                            }
                                        })
                                    }
                                })
                            })//END BREWERIES POST
                            if (count == cardArr.length) {
                                var cardStr = "";
                                for (var i = 0; i < cardArr.length; i++) {
                                    cardStr += cardArr[i];
                                }
                                $("#accordion").html(cardStr);
                            }
                        })
                    }
                })
            }
        })
    }//END showVisibleMarkers()

    var count = 0;
    function createList(brewName, brewAdd, name, abv, ibu, descrip) {
        count++;
        var card = "";

        card = "<div class='card'><div class='card-header' id='heading" + count + "'><h5 class='mb-0'><button class='btn btn-link collapsed' data-toggle='collapse' data-target='#collapse" + count + "' aria-expanded='false' aria-controls='collapse" + count + "'>" + brewName + "</button></h5></div><div id='collapse" + count + "' class='collapse' aria-labelledby='heading" + count + "' data-parent='#accordion'><div class='card-body'>" +
                "<p class='brewAdd'> Address: " + brewAdd + "</p>" +
                "<p class='beerName'> Beer Name: " + name + "</p>" +
                "<p class='beerAbv'> Alcohol By Volume: " + abv + "</p>" +
                "<p class='beerIbu'> International Bitterness Unit: " + ibu + "</p>" +
                "<p class='beerDescr'> Description: " + descrip + "</p>" +
                "</div></div></div>"
        return card;
    }

    //GET THE COORDINATES OF ALL THE MARKERS WITHIN THE BOUNDS OF THE MAP

    //FROM THE COORDINATES, GET ALL THE BREWERIES VIA BREWERY ID
    //FROM THE BREWERY ID, GET THE BEER INFORMATION FOR EACH BREWERY
// }//END INITIALIZE MAP
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
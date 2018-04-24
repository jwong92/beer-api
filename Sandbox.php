<?php 
$baseUrl = 'https://api.punkapi.com/v2/';


function getBeerByName($beerName, $baseurl) {
    $reqUrl = $baseurl . 'beers?';
    $header =  array (
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded'
        );
    //FOR THE QUERY STRING TO BE GENERATED - THIS IS USER DEPENDENT, SO WILL BE UPDATED BASED ON USER
    $params = array (
        'beer_name' => $beerName,
    );

    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $reqUrl);
    curl_setopt()


} //END GET BEER BY NAME



?>
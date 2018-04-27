<?php

$baseUrl = 'https://api.punkapi.com/v2/';

function getBeerByName($baseurl) {
    $reqUrl = $baseurl . 'beers?per_page=80';
    $header =  array (
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded'
        );

    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $reqUrl);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 5);

    // $result = json_decode(curl_exec($curl));
    $result = curl_exec($curl);
    curl_close($curl);

    //RETURN A JSON STRING BASED ON BEER NAME
    return $result;
} //END GET BEER BY NAME

echo getBeerByName($baseUrl);

?>
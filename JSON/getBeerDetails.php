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

    $query = $reqUrl . http_build_query($params);

    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $query);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 5);

    // $result = json_decode(curl_exec($curl));
    $result = curl_exec($curl);
    curl_close($curl);

    //RETURN A JSON STRING BASED ON BEER NAME
    return $result;
} //END GET BEER BY NAME

?>
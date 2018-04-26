<?php 
$baseUrl = 'https://api.punkapi.com/v2/';
$abvGT;
$abvLT;
$ibuGT;
$ibuLT;
$ebcGT;
$ebcLT;
$beerName;
$yeast;
$hops;
$malt;
$food;

function searchParams($abvGT, $abvLT, $ibuGT, $ibuLT, $ebcGT, $ebcLT, $beerName, $yeast, $hops, $malt, $food) {
    $params = [
        'abv_gt' => $abvGT,
        'abv_lt' => $abvLT,
        'ibu_gt' => $ibuGT,
        'ibu_lt' => $ibuLT,
        'ebc_gt' => $ebcGT,
        'ebc_lt' => $ebcLT,
        'beer_name' => $beerName,
        'yeast' => $yeast,
        'hops' => $hops,
        'malt' => $malt,
        'food' => $food
    ];

    return $params;
}

$params = searchParams("", "", "", "", "", "", "Belgian", "", "", "", "");

function getBeerByName($baseurl, $params) {
    $reqUrl = $baseurl . 'beers?';
    $header =  array (
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded'
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

echo getBeerByName($baseUrl, $params);
?>
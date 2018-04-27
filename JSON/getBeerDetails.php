<?php 
$baseUrl = 'https://api.punkapi.com/v2/';
$abvGT = "10";
$abvLT = "";
$ibuGT = "";
$ibuLT = "";
$beerName = "";
$yeast = "";
$hops = "";
$malt = "";
$food = "";
$params['parameters'] = array();

if($abvGT) {
    $params['abv_gt'] = $abvGT;
}
if($abvLT) {
    $params['abv_lt'] = $abvLT;
}
if($ibuGT) {
    $params['abv_lt'] = $ibuGT;
}
if($ibuLT) {
    $params['abv_lt'] = $ibuLT;
}
if($beerName) {
    $params['abv_lt'] = $beerName;
}
if($yeast) {
    $params['abv_lt'] = $yeast;
}
if($hops) {
    $params['abv_lt'] = $hops;
}
if($malt) {
    $params['abv_lt'] = $malt;
}
if($food) {
    $params['abv_lt'] = $food;
}

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
<?php 
$BASE_URL = "http://lcboapi.com/";
$LCBO_CONFIG = array(
    'access_key' => "MDphNzNiZWNkOC0zYzU5LTExZTgtOTFiYi1lMzdkZGU2Y2MwYzQ6UnhBMXlPaUl3dXVWUmtnb0t1QVlqVXhWbGNSWEgydzYzWjRv"
);

function requestAuth($baseurl, $key) {
    $reqUrl = $baseurl . 'products';

    $header = array (
        "Authorization: Token token=".$key['access_key'].""
    );

        var_dump($header[0]);


    $curl = curl_init();

    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    var_dump($curl);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 5);

    $result = curl_exec($curl);
    var_dump($result);

    curl_close($curl);

    return $result;
}

echo requestAuth($BASE_URL, $LCBO_CONFIG);



?>
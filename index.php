<?php
session_start();
require_once 'apiKey.php';
require_once 'pages/process.php';

/************************************FUNCTIONS*************************************/

//JSON FILE OF ALL CITIES IN THE WORLD
$worldwide = json_decode(file_get_contents('JSON/world-cities_json.json'));

//GET ALL CANADIAN CITIES
function getCanadianCities($jsonofcities) {
    foreach($jsonofcities as $countries) {
        if($countries->country == "Canada") {
            $canadian[] = $countries->name;
        }
    }
    return $canadian;

}
//GET ALL AMERICAN CITIES
function getAmericanCities($jsonofcities) {
    foreach($jsonofcities as $countries) {
        if($countries->country == "United States") {
            $american[] = $countries->name;
        }
    }
    return $american;
}
/***********************************************************************************/

$can = getCanadianCities($worldwide);
$usa = getAmericanCities($worldwide);
 ?>

<html lang="en">
<head>
    <script
    src="http://code.jquery.com/jquery-3.3.1.min.js"
    integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
    crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="assets/js/map.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/style.css" />
    <link href="https://fonts.googleapis.com/css?family=Noto+Sans|Roboto" rel="stylesheet">  
</head>
<body>

<!-- MAIN LOGO -->
<header>
    <div class=" text-center mr-ml-container">
        <div id="main-img-container">
            <img src="images/Logo.png" alt="main header oh beer" id="logo"/>
        </div>
        <div class="main-para-container">
            <p>Your go to application to find detailed information on breweries, beers, and locations. Just select a city of your choice, and all breweries along with their beer information will be provided to you. Should you wish, there are more filters that will help you to find a beer more suitable for your tastes. </p>
        </div>
    </div>
</header>

<main>
<!-- MAKE SURE USERS ONLY CHOOSE ONE PLACE -->
<?php echo $message = (!empty($_SESSION['error']['duplicate']) ? $_SESSION['error']['duplicate'] : "") ?>
<!-- DROPDOWN LIST OF ALL MAJOR CITIES -->
<form method="post" action="">
    <div class="form-group">
        <label for="canadianCitiesDropDown">Select a Canadian City</label>
        <select class="form-control" id="canadianCitiesDropDown" name="canadianCities">
            <option value="0">--Canadian Cities--</option>
            <?php if (!empty($can)) : ?>
            <?php foreach ($can as $c) : ?>
                <option value="<?= $c ?>"><?= $c ?></option>
            <?php endforeach ?>
            <?php endif ?>
        </select>
    </div>

    <div class="form-group">
        <label for="americanCitiesDropdown">Select an American City</label>
        <select class="form-control" id="americanCitiesDropdown" name="americanCities">
            <option value="0">--American Cities--</option>
            <?php if (!empty($usa)) : ?>
            <?php foreach ($usa as $u) : ?>
                <option value="<?= $u ?>"><?= $u ?></option>
            <?php endforeach ?>
            <?php endif ?>
        </select>
    </div>
    <input type="submit" value="Fetch my beers" class="btn btn-light" name="getCities"/>
</form>



 <!-- CREATE A JAVASCRIPT VARIABLE THAT WILL HOLD THE JSON FILTER CREATED -->
<?php if(isset($allFilters)) : ?>
    <div id="filterBox" style="display: none">
        <?= $allFilters ?>
    </div>
    <script>
        filters = document.querySelector("#filterBox").textContent;
    </script>
<?php endif ?>



</main>









<!-- GOOGLE MAP -->
    <div id="map" style='width: 100%; height: 500px; background:grey;'></div>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=<?= $key ?>&callback=initMap"
    type="text/javascript"></script>
<!-- END GOOGLE MAP -->

    <div id="sandbox"></div>

</body>
</html>
<?php unset($_SESSION['error']['duplicate']); ?>
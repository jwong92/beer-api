<?php
require_once 'apiKey.php';




 ?>

<html lang="en">
<head>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="map.js"></script>
</head>
<body>
    <div id="map" style='width: 100%; height: 500px; background:grey;'></div>



    <script async defer src="https://maps.googleapis.com/maps/api/js?key=<?= $key ?>&callback=initMap"
    type="text/javascript"></script>

    <div id="sandbox"></div>

</body>
</html>

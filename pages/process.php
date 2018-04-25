<?php
if(isset($_POST['getCities'])) {
    // INCLUDE THE GETBEERDETAILS THAT WILL ADD TO THE JSON
$canada = validatePost("canadianCities");
$unitedstates = validatePost("americanCities");

//ASSIGN CITIES TO ARRAY
$cities = [
    "Canada" => $canada, 
    "United States" => $unitedstates
];

//IF THE USER ONLY SELECTS ONE CITY
if(onlyOneSet($cities)) {
    $city = onlyOneSet($cities);

    //ADD TO THE ARRAY OF FILTERS
    $filters['filters'] = $city;
    $allFilters = json_encode($filters);
} else {
    createSessionError("duplicate", "Please select only one city.");
}

}//END SUBMIT BUTTON

/************************************FUNCTIONS*************************************/

// VALIDATION AND ASSIGNMENT OF VALUES
function validatePost($formName) {
    $value = $_POST[$formName];
    if(isset($value) && $value != "0") {
        return $value;
    }
    return false;
}

//ASSIGN THE CITY TO THE PROPER VARIABLE
function onlyOneSet($cities) {
    $count = 0;
    //CHECK THAT ONLY ONE CITY IS SELECTED
    foreach($cities as $key => $value) {
        if($value == false) {
            $count--;
        } else if($value == true) {
            $count++;
            $city['city'] = $value;
            $city['country'] = $key;
        }
    }
    //IF THERE IS ONLY ONE CITY SELECTED, RETURN THE VALUE
    if($count == 0) {
        return $city;
    }
    return false;
}

//FUNCTION TO CREATE SESSION ERRORS
function createSessionError($key, $val) {
    $e = array();
    $e[$key] = $val;
    $_SESSION['error'] = $e;
}

?>
// Put your zillow.com API key here

var username = "swapnilnarwade";
var request = new XMLHttpRequest();


//initMap() which initiates map to a location

function initMap(){  
    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 32.75, lng: -97.13},
        zoom: 17
    });
            
    var mkr = new google.maps.Marker({map: map});
    var gc = new google.maps.Geocoder;
    var iw = new google.maps.InfoWindow;
            
    google.maps.event.addListener(map, 'click', function(event) {
        reversegeocode(gc, map, iw, mkr, event.latLng);
    });              
}

// Reserse Geocoding 
function reversegeocode(gc, map, iw, mkr, LatLng) {
  //get the latitude and longitude from the mouse click and get the address.
    gc.geocode({'location': LatLng},function(result,status){
        if(status== 'OK'){
            if(result[0]){
                map.setZoom(17);
                mkr.setPosition(LatLng);
                var addr= result[0].formatted_address;
                //call geoname api asynchronously with latitude and longitude
                var Lat = LatLng.lat();
                var Lng = LatLng.lng();
                sendRequest(Lat,Lng,addr,iw);
                iw.open(map,mkr);
            }
            else{
                window.alert("No results found.");
            }
        }
        else{
            window.alert("Failed:"+ status);
        }
    });
   
  
}// end of geocodeLatLng()

function intialize(){
    initMap();
}

function Clear(){
    document.getElementById("output").innerHTML= " ";
}

function displayResult (iw,addr) {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        //console.log(xml);
        var temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
        var windSpeed = xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
        var clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
        value = "<p> Address: "+ addr+"<br>Temperature: "+ temperature+" °C<br>Wind Speed: "+ windSpeed+" mph<br>Clouds: "+ clouds+"</p>";
        iw.setContent(value);
        document.getElementById("output").innerHTML += value;
    }
}

function sendRequest (Lat, Lng, addr, iw) {
    request.onreadystatechange = function(){
        displayResult(iw, addr);
    };
    request.open("GET"," http://api.geonames.org/findNearByWeatherXML?lat="+Lat+"&lng="+Lng+"&username="+username);
    //request.withCredentials = "true";
    request.send(null);
}

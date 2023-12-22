let map;
let directionsService;
let directionsRenderer;
let locations; // to store locations fetched from the server

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    const center = { lat: 18.826145842590584, lng: -70.19367972630295 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: center,
    });
    const marker = new google.maps.Marker({
        position: center,
        map: map,
      });
    directionsRenderer.setMap(map);

    let selectBox = document.getElementById('locations-dropdown');
    selectBox.addEventListener('change', () => {
        const selectedLocationId = selectBox.value;
        const selectedLocation = locations.find(loc => loc.id == selectedLocationId);
        if (selectedLocation) {
            calculateAndDisplayRoute(selectedLocation);
            fetchWaterReliability(selectedLocationId);
            fetchAverageReview(selectedLocationId);
            fetchReviews(selectedLocationId);
        }
    });

    fetch('http://localhost:8000/api/locations/')
        .then(response => response.json())
        .then(data => {
            locations = data; // store the locations
            const destinationArray = locations.map(location => new google.maps.LatLng(location.latitude, location.longitude));

            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [center],
                    destinations: destinationArray,
                    travelMode: 'DRIVING',
                },
                (response, status) => {
                    if (status === 'OK') {
                        const distances = response.rows[0].elements;
                        // Attach distance information to each location
                        locations.forEach((location, index) => {
                            if (distances[index].status === 'OK') {
                                location.distanceText = distances[index].distance.text;
                                location.distanceValue = distances[index].distance.value;
                            } else {
                                location.distanceText = "N/A";
                                location.distanceValue = Number.MAX_VALUE;
                            }
                        });
                        // Sort locations by distance value in ascending order
                        locations.sort((a, b) => a.distanceValue - b.distanceValue);
                        // Populate dropdown with sorted locations
                        locations.forEach((location) => {
                            let option = document.createElement('option');
                            option.text = `${location.name} - ${location.distanceText}`;
                            option.value = location.id;
                            selectBox.add(option);
                        });
                    } else {
                        console.error('Distance Matrix request failed due to ', status);
                    }
                }
            );
        })
        .catch(error => console.error('Error fetching location data:', error));
}

function calculateAndDisplayRoute(location) {
    const origin = { lat: 18.826145842590584, lng: -70.19367972630295 }; // Starting point
    const destinationLatLng = { lat: location.latitude, lng: location.longitude }; // Selected destination from dropdown

    const request = {
        origin: origin,
        destination: destinationLatLng,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destinationLatLng],
            travelMode: 'DRIVING',
        },
        (response, status) => {
            if (status === 'OK') {
                const results = response.rows[0].elements;
                const element = results[0];
                const distance = element.distance.text;
                const duration = element.duration.text;

                const distanceContainer = document.getElementById('distance');
                distanceContainer.textContent = `${distance} || Duration: ${duration}`;
            } else {
                alert('Error was: ' + status);
            }
        }
    );
}

function fetchWaterReliability(locationId) {
    fetch(`http://localhost:8000/api/water-reliability/location/${locationId}/`)
        .then(response => response.json())
        .then(data => {
            const waterReliabilityContainer = document.getElementById('water-reliability');
            waterReliabilityContainer.textContent = `${data.reliability}%`;
        })
        .catch(error => console.error('Error fetching water reliability data:', error));
}

function fetchAverageReview(locationId) {
    fetch(`http://localhost:8000/api/locations/${locationId}/average-rating/`)
        .then(response => response.json())
        .then(data => {
            if ('average_rating' in data) {
                const avgReviewContainer = document.getElementById('avg-review');
                avgReviewContainer.textContent = `${data.average_rating}`;
            } else {
                console.error('No average rating found:', data.message);
            }
        })
        .catch(error => console.error('Error fetching average rating data:', error));
}

function fetchReviews(locationId) {
    fetch(`http://localhost:8000/api/locations/${locationId}/reviews/`)
        .then(response => response.json())
        .then(data => {
            const reviewsList = document.getElementById('reviews-list');
            // Clear current reviews
            reviewsList.innerHTML = '';
            // Populate list with reviews
            data.forEach(review => {
                let li = document.createElement('li');
                li.textContent = `${review.rating}/5 - ${review.content}`;
                reviewsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

function toggleMenu() {
    var menu = document.getElementById("nav-menu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}


document.addEventListener("DOMContentLoaded", function() {

    var modal = document.getElementById("reviewModal");

    var btn = document.getElementById("submit-review-button");

    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    var form = document.getElementById("reviewForm");

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        var selectBox = document.getElementById('locations-dropdown');
        var selectedLocationId = selectBox.value;

        var ratingInput = document.getElementById("rating");
        var contentInput = document.getElementById("content");

        // Prepare data to send
        var data = {
            location: selectedLocationId,
            rating: parseFloat(ratingInput.value),
            content: contentInput.value,
        };

        // Sends data to backend
        fetch('http://localhost:8000/api/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            modal.style.display = "none";
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    form.addEventListener('submit', handleFormSubmit);
});

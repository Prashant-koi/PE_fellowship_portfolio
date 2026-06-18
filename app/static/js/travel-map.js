var travelMaps = {};
var DEFAULT_MAP_CENTER = [20, 0];
var DEFAULT_MAP_ZOOM = 2;

function initTravelMaps() {
    document.querySelectorAll(".travel-map").forEach(function (container) {
        var panel = container.closest(".tab-panel");
        if (panel && !panel.classList.contains("active")) {
            return;
        }
        initTravelMapIfNeeded(container);
    });
}

function initTravelMapIfNeeded(container) {
    if (!container.dataset.initialized && typeof L !== "undefined") {
        initTravelMap(container);
        container.dataset.initialized = "true";
        setTimeout(function () {
            var memberId = container.dataset.memberId;
            resizeTravelMap(memberId);
        }, 100);
    }
}

function initTravelMap(container) {
    if (typeof L === "undefined") {
        return;
    }

    var markerIconUrl = container.dataset.markerIcon || "/static/img/marker-pin.svg";
    var travelMarkerIcon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -48],
    });

    var memberId = container.dataset.memberId;
    var storageKey = "travel-places-" + memberId;
    var listEl = document.getElementById("travel-map-list-" + memberId);
    var serverPlaces = [];
    try {
        serverPlaces = JSON.parse(container.dataset.places || "[]");
    } catch (error) {
        console.error("Could not read saved places for member", memberId, error);
    }
    var saved = localStorage.getItem(storageKey);
    var places = saved ? JSON.parse(saved) : serverPlaces.slice();
    var markers = [];

    var map = L.map(container).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(map);

    function persist() {
        localStorage.setItem(storageKey, JSON.stringify(places));
    }

    function resetMapView() {
        map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
    }

    function updateList() {
        if (!listEl) {
            return;
        }

        listEl.innerHTML = "";

        if (!places.length) {
            listEl.innerHTML =
                "<li class='travel-map-empty'>No places marked yet. Click the map to add one.</li>";
            return;
        }

        places.forEach(function (place) {
            var item = document.createElement("li");
            item.textContent = place.name || "Visited location";
            item.title = place.lat.toFixed(4) + ", " + place.lng.toFixed(4);

            var removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "travel-map-remove";
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", function () {
                var idx = places.findIndex(function (p) {
                    return p.lat === place.lat && p.lng === place.lng && p.name === place.name;
                });
                if (idx !== -1) {
                    places.splice(idx, 1);
                    persist();
                    renderMarkers();
                }
            });

            item.appendChild(removeBtn);
            listEl.appendChild(item);
        });
    }

    function renderMarkers() {
        markers.forEach(function (marker) {
            map.removeLayer(marker);
        });
        markers = [];

        places.forEach(function (place) {
            var marker = L.marker([place.lat, place.lng], { icon: travelMarkerIcon }).addTo(map);
            marker.bindPopup(place.name || "Visited");

            marker.on("click", function () {
                var idx = places.findIndex(function (p) {
                    return p.lat === place.lat && p.lng === place.lng && p.name === place.name;
                });
                if (idx !== -1) {
                    places.splice(idx, 1);
                    persist();
                    renderMarkers();
                }
            });

            markers.push(marker);
        });

        updateList();
    }

    map.on("click", function (event) {
        places.push({
            lat: event.latlng.lat,
            lng: event.latlng.lng,
            name: "Place " + (places.length + 1),
        });
        persist();
        renderMarkers();
    });

    renderMarkers();
    resetMapView();
    travelMaps[memberId] = map;
}

function resizeTravelMap(memberId) {
    var map = travelMaps[memberId];
    if (!map) {
        return;
    }

    map.invalidateSize();
    map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
}

window.initTravelMaps = initTravelMaps;
window.initTravelMapIfNeeded = initTravelMapIfNeeded;

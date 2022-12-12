const myMap = {
	coordinates: [],
	menuOption: [],
	map: {},
	markers: {},

	buildMap(){
		this.map = L.map('map', {
			center: this.coordinates,
			zoom: 11,
		});
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map).bindPopup('<p><b>Your Location</b></p>').openPopup()
	},
	addMarkers(){
		for (var i =0; i < this.menuOption.length; i++){
			this.markers = L.markers([this.menuOption[i].lat, this.menuOption[i].long])
			.bindPopup('<p>${this.menuOption[i].name}</p>')
			.addTo(this.map)
		}
	}
}

async function getCoords(){
	const pos = await new Promise ((resolve, reject)=>{
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

function processMenuOption(data) {
	let menuOption = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return menuOption
}
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

document.getElementById('menu-submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('menu-option').value
	let data = await getFoursquare(business)
	myMap.menuOption = processMenuOption(data)
	myMap.addMarkers()
})

// function onLocationFound(e) {
//     var radius = e.accuracy;

//     L.marker(e.latlng).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circle(e.latlng, radius).addTo(map);
// }

// map.on('locationfound', onLocationFound);

// function onLocationError(e) {
//     alert(e.message);
// }

// map.on('locationerror', onLocationError);
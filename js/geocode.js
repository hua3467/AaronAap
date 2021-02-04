const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiYWF5YW5nIiwiYSI6ImNrY3RxeXp5OTBqdHEycXFscnV0czY4ajQifQ.jtVkyvY29tGsCZSQlELYDA`;

    fetch(url)
    .then( response => response.json())
    .then(data => {
            callback(undefined, {
                latitude: data.features[0].center[1],
                longtitude: data.features[0].center[0],
                location: data.features[0].place_name
            });
    });

}

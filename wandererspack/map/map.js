const btnArch = document.querySelector("#btnArch");
const btnLandArch = document.querySelector("#btnLandArch");
const btnArt = document.querySelector("#btnArt");
const tabBtns = document.querySelectorAll(".btn-tab a");
const listTitle = document.querySelector("#listTitle");
const btnToggle = document.querySelector("#btnToggle");
const pplContainer = document.querySelector("aside");
const backpack = document.querySelector(".backpack");
const coverBgDark = document.querySelector(".cover-bg-dark");
const btnAdd = document.querySelector("#btnAdd");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get("from")) {
  console.log(urlParams);
  if (navigator.userAgent.match(/Chrome|AppleWebKit/)) {
    window.location.href = "#maplocation";
    window.location.href = "#maplocation"; /* these take twice */
  } else {
    window.location.hash = "maplocation";
  }

}


// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWF5YW5nIiwiYSI6ImNrY3RxeXp5OTBqdHEycXFscnV0czY4ajQifQ.jtVkyvY29tGsCZSQlELYDA";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/aayang/ckfhnnlks0b7v19l7oxweshja",
  center: [-96.779, 46.878],
  zoom: 3.5,
});


// map.addControl(new mapboxgl.FullscreenControl());


let zoomToBounds = function (data) {
  console.log(data);
  let pointCollection = [
    [-96.790494, 46.875552]
  ];
  for (let i = 0; i < data.features.length; i++) {
    const newFeature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [-96.790494, 46.875552],
          data.features[i].geometry.coordinates,
        ],
      },
    };
    pointCollection.push(data.features[i].geometry.coordinates);
    lineLayer.features.push(newFeature);
    projectGeoData.features.push(data.features[i]);
  }

  if (data.features.length > 1) {
    var bounds = pointCollection.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(pointCollection[0], pointCollection[0]));

    map.fitBounds(bounds, {
      padding: {
        top: 100,
        right: 80,
        bottom: 120,
        left: 300,
      },
    });
  }
}

const popupContent = function (properties) {

  return `<h5>${properties.fname}</h5>
          <p class="line-narrow"><span class="icon-lead"><i class="fas fa-map-marker-alt"></i></span>${properties.userCity},${properties.userState}, ${properties.userCountry}</p>
          <p class="line-narrow"><span class="icon-lead"><i class="fas fa-building"></i></span>I'm here to see ${properties.form_what} with ${properties.form_who}</p>
          <div class="about-user">
            <img src=${properties.image}/>
            <p>${properties.form_story}</p>
            <p><b>What are in my backpack: </b></p>
            <ul>
              <li>${properties["item-1"]}</li>
              <li>${properties["item-2"]}</li>
              <li>${properties["item-3"]}</li>
              <li>${properties["item-4"]}</li>
              <li>${properties["item-5"]}</li>
            </ul>
          </div>`;
}

let addMarker = function (markerData) {
  console.log(markerData);
  let markerElement = document.querySelector("#RH_marker");
  if (markerElement) {
    markerElement.remove();
  }

  let feature = markerData.features[0].properties;
  let peopleCoord = markerData.features[0].geometry.coordinates;

  var popupUser = new mapboxgl.Popup().setHTML(
    popupContent(feature)
  );

  var el = document.createElement("div");
  el.id = "RH_marker";
  el.style = `background-image: url(${feature.image})`;

  // create the marker for User
  var marker = new mapboxgl.Marker(el)
    .setLngLat(peopleCoord)
    .setOffset([0, -40])
    .setPopup(popupUser)
    .addTo(map);
};

let addUserMarker = function (data) {

  const ele = document.createElement("div");
  ele.className = "userMarker";
  ele.style = `background-image: url(${data.properties.image})`;
  ele.addEventListener("click", e => {
    backpack.classList.remove("hide");
    coverBgDark.classList.remove("hide");
    btnAdd.classList.add("hide");
    document.querySelector("header h1").innerHTML = `${data.properties.fname}'s Backpack`;
    backpack.innerHTML = `<div class="btnClose"><i class="fas fa-times-circle"></i> Close</div>
                          <div class="pack-body">
                          <img src="${data.properties.image}">
                          <p><b>Location: </b>${data.properties.userCity},${data.properties.userState}, ${data.properties.userCountry}</p>
                          <p><b>Story: </b> ${data.properties.form_story}<p>
                          <p><b>Packed Items: </b>${data.properties["item-1"]}, ${data.properties["item-2"]}, ${data.properties["item-3"]}, ${data.properties["item-4"]}, ${data.properties["item-5"]}</p>
                          <p><b>Who are your bringing? </b>${data.properties.form_who}</p>
                          <p><b>What are you going to see? </b>${data.properties.form_what}</p></div>`;

    document.querySelector(".btnClose").addEventListener("click", e => {
      btnAdd.classList.remove("hide");
      backpack.classList.add("hide");
      coverBgDark.classList.add("hide");
      document.querySelector("header h1").innerHTML = "FIND YOUR PACK";
    });
    
  });

  new mapboxgl.Marker(ele)
    .setLngLat(data.geometry.coordinates)
    .setOffset([0, -40])
    .addTo(map);
};

let removeAllUserMarker = function () {

  const markers = document.querySelectorAll(".userMarker");
  const rh_marker = document.querySelector("#RH_marker");

  if (rh_marker) {
    rh_marker.remove();
  }
  markers.forEach((marker) => {
    marker.remove();
  });
};


let loadPeopleList = function (peopleData, projects) {

  lineLayer = {
    type: "FeatureCollection",
    features: [],
  };

  let pointCollection = [
    [-96.790494, 46.875552]
  ];

  const peopleList = document.querySelector(".list ul");
  peopleList.innerHTML = "";

  peopleData.forEach((data) => {
    const property = data.features[0].properties;
    let listItem = document.createElement("li");
    listItem.className = "ppl-card";
    listItem.innerHTML = `
                    <div class="ppl-card-cover" style="background: url(${property["image"]}) rgba(0,0,0,0.15); background-size: cover;background-repeat: no-repeat;background-position: center;"></div>
                    <div class="ppl-card-title">
                        <p class="ppl-name" id="${property.uid}">${property.fname}</p>
                        <div class="title-link">
                            <p class="ppl-title">${property.title}</p>
                            <a href="${parseURL(property.website)}" target="_blank">Website</a>
                        </div> 
                    </div>
                    `;
    peopleList.append(listItem);

    const newFeature = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [-96.790494, 46.875552],
          data.features[0].geometry.coordinates
        ]
      }
    }

    pointCollection.push(data.features[0].geometry.coordinates);
    lineLayer.features.push(newFeature);
    // projectGeoData.features.push(data.features[i])

  });

  if (peopleData.length > 1) {
    var bounds = pointCollection.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(pointCollection[0], pointCollection[0]));

    map.fitBounds(bounds, {
      padding: {
        top: 100,
        right: 80,
        bottom: 120,
        left: 80
      },
    });
  }

  removeAllLayers();

  // map.addSource('lines', {
  //   'type': 'geojson',
  //   'data': lineLayer
  // });

  // map.addLayer({
  //   'id': 'net-lines',
  //   'type': 'line',
  //   'source': 'lines',
  //   'layout': {
  //     'line-join': 'round',
  //     'line-cap': 'round'
  //   },
  //   'paint': {
  //     'line-color': '#FFCC00',
  //     'line-width': 1,
  //     'line-opacity': 0.3,
  //     'line-dasharray': [1, 2]
  //   }
  // });

};


let unselectCards = function (cards = []) {
  cards.forEach((card) => {
    card.classList.remove("ppl-card-active");
  });
};

let removeAllLayers = function () {
  if (map.getLayer("net-lines")) {
    map.removeLayer("net-lines");
  }
  if (map.getSource("lines")) {
    map.removeSource("lines");
  }

  if (map.getLayer("people-end-points")) {
    map.removeLayer("people-end-points");
  }
  if (map.getSource("people-data")) {
    map.removeSource("people-data");
  }

};

let addPeopleProjects = function (data) {
  projectGeoData = {
    type: "FeatureCollection",
    features: [],
  };


  let pointCollection = [
    [-96.790494, 46.875552]
  ];


  for (let i = 0; i < data.features.length; i++) {

    pointCollection.push(data.features[i].geometry.coordinates);
    projectGeoData.features.push(data.features[i])

  }


  if (data.features.length > 1) {

    var bounds = pointCollection.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(pointCollection[0], pointCollection[0]));

    map.fitBounds(bounds, {
      padding: {
        top: 100,
        right: 80,
        bottom: 120,
        left: 300
      },
    });

  }

  removeAllLayers();



  map.addSource('people-data', {
    'type': 'geojson',
    'data': projectGeoData
  });

  map.addLayer({
    'id': 'people-end-points',
    'type': 'circle',
    'source': 'people-data',
    'paint': {
      'circle-radius': 4,
      'circle-color': '#FFCC00',
      'circle-opacity': 0.4,
      'circle-stroke-color': '#FFCC00',
      'circle-stroke-width': 2,
    },
    'filter': ['==', '$type', 'Point']
  });
};

let clickName = function (geoData, projects, people) {

  const pplNames = document.querySelectorAll(".ppl-name");
  const pplCards = document.querySelectorAll(".ppl-card");

  pplNames.forEach((name, i) => {

    name.addEventListener("click", (e) => {

        unselectCards(pplCards);
        pplCards[i].classList.add("ppl-card-active");

        removeAllUserMarker();
        removeAllLayers();

        const selectedPepole = people.filter((p) => p.features[0].properties.uid === name.id);

        addMarker(selectedPepole[0]);
        addPeopleProjects(geoData);

        map.flyTo({
          center: selectedPepole[0].features[0].geometry.coordinates,
          zoom: 7,
          bearing: 0,
          speed: 1, // make the flying slow
          curve: 1, // change the speed at which it zooms out
          easing: function (t) {
            return t;
          },
          // this animation is considered essential with respect to prefers-reduced-motion
          essential: true,
        });

      },
      false
    );

  });

}




map.on("load", function () {

  db.ref("wanderer")
    .once("value")
    .then((snapshot) => {
      const peopleData = Object.values(snapshot.val());

      const projects = {
        features: [],
        type: "FeatureCollection",
      };

      console.log(peopleData);

      const people = [];

      peopleData.forEach((data) => {
        let newFeature = {
          features: [{
            geometry: {
              coordinates: [data.longtitude, data.latitude],
              type: "Point",
            },
            properties: data,
            type: "Feature",
          }, ],
          type: "FeatureCollection",
        };

        addUserMarker(newFeature.features[0]);
        people.push(newFeature);
      });


      let geoData = {
        type: "FeatureCollection",
        features: [],
      };


      tabBtns.forEach((btn, i) => {

        btn.addEventListener("click", (e) => {
          e.preventDefault();

          tabBtns.forEach((tab) => {
            tab.classList.remove("active");
          });

          btn.classList.add("active");

          removeAllUserMarker();

          const selectedPeople = people.filter(
            (person) => person.features[0].properties.major === btn.dataset.major
          );

          // Add all projects
          geoData.features = projects.features.filter(
            (project) => project.properties.major === btn.dataset.major
          );

          selectedPeople.forEach(people => {
            console.log(people);
            addUserMarker(people.features[0]);
          });

          //addPeopleProjects(geoData);
          loadPeopleList(selectedPeople, geoData);
          clickName(geoData, projects, people);
        });

      });

      listTitle.addEventListener("click", (e) => {
        tabBtns.forEach((tab) => {
          tab.classList.remove("active");
        });

        loadPeopleList(people, geoData);

        people.forEach(person => {
          addUserMarker(person.features[0]);
        });

        clickName(geoData, projects, people);

      });

      //addPeopleProjects(projects);
      // Add contents on map load
      loadPeopleList(people, geoData);
      clickName(geoData, projects, people);

    }); // end firebase reference

}); // end map on-load event



map.on("click", "people-end-points", function (e) {
  if (document.querySelector(".splide")) {
    document.querySelector(".splide").remove();
  }

  var features = map.queryRenderedFeatures(e.point, {
    layers: ["people-end-points"],
  });

  var feature = e.features[0];

  let popup_HTML = function (featureObj) {
    let container = `<div class="splide"><div class="splide__track"><ul class="splide__list">`;

    featureObj.forEach((feature) => {
      let projectLink = feature.properties.website ?
        `<a href="${parseURL(
                  feature.properties.website
                )}" target="_blank">${feature.properties.name}</a>` :
        `${feature.properties.name}`;

      let image = feature.properties.image ?
        `<img src="${feature.properties.image}">` :
        `<img src="http://map.ndsusodaa.com/sodaapeople/images/img_placeholder.png">`;

      // TODO create a HTML slider to be added into popup.
      container += `<li class="splide__slide">
                    <div class="slide-header">
                        <div class="slide-header-title">
                            <h4>${feature.properties.name}</h4>
                            <p> ${projectLink}, ${feature.properties.year} | ${feature.properties.city}, ${feature.properties.state}</p>
                        </div>
                    </div>
                    <div class="slide-body">
                    ${image}
                    <p>${feature.properties.description}</p>
                    
                    </div>
                    </li>`;
    });

    container += `</ul></div></div>`;
    return container;
  };

  var popup = new mapboxgl.Popup({
      offset: [0, 0],
    })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(popup_HTML(features))
    .addTo(map);

  new Splide(".splide", {
    width: "100%",
    type: "loop",
    gap: "12px",
    arrows: false,
  }).mount();
});



let flag = false;

btnToggle.addEventListener("click", (e) => {
  if (!flag) {
    pplContainer.style = "left: -230px";
    btnToggle.children[0].className = "fas fa-chevron-right";
    flag = true;
  } else {
    pplContainer.style = "left: 10px";
    btnToggle.children[0].className = "fas fa-chevron-left";
    flag = false;
  }
});
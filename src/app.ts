import axios from "axios";

const form = document.querySelector("form")!;
const input = document.getElementById("address")! as HTMLInputElement;

const API_KEY = "AIzaSyAq0tyGE-Us4oMWw32OkUa37r6ubeihsc0";

type Geomytry = {
  results: { geometry: { location: { lat: number; lng: number } } }[],
  status: 'OK' | 'ZERO_RESULTS'
};

const handleSubmitButton = (event: Event) => {
  event.preventDefault();
  const address = input.value;
  axios
    .get<Geomytry>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
    )
    .then(async(resolve) => {
      console.log(resolve);
      if (resolve.data.status !== 'OK') {
        throw new Error('could not load map')
      }
      const coordinates = resolve.data.results[0].geometry.location;

      // Request needed libraries.
      //@ts-ignore
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // The map, centered at Uluru
      const map = new Map(document.getElementById("map") as HTMLElement, {
        zoom: 4,
        center: coordinates,
        mapId: 'DEMO_MAP_ID',
      });

      // The marker, positioned at Uluru
      new AdvancedMarkerElement({
        map: map,
        position: coordinates,
        title: "Uluru",
      });
    })
    .catch((errors) => {
      alert(errors.message);
    });
};

form.addEventListener("submit", handleSubmitButton);

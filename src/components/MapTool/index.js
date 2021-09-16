import React, { useEffect, useState, useRef } from "react";
import { useStyles } from "./styles";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./map.css";
import { addFeature } from "../../store/actions/addFeatureAction";
import Button from "@material-ui/core/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const MapTool = ({ dispatch, features, mapViewport, bounds }) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoidW5pdDAxIiwiYSI6ImNrZzB5Zmc4bzAzc2Uyem4xYTB6dmJnZWEifQ.HpNgy6VauOoxCBnK_2klpQ";

  const mapContainerRef = useRef(null);

  const [show, setShow] = useState(false);

  const handleShow = (e) => {
    e.preventDefault();
    setShow(!show);
  };

  useEffect(() => {
    let center = [mapViewport.lng, mapViewport.lat];
    let initZoom = 4;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center:
        features.length > 0
          ? JSON.parse(localStorage.getItem("polyCenter")).geometry.coordinates
          : [mapViewport.lng, mapViewport.lat],
      zoom: features.length > 0 ? 18 : 4,
      maxBounds: bounds,
      attributionControl: false,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    var Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
      },
    });

    map.addControl(Draw, "top-right");
    map.addControl(geocoder, "top-left");

    const updateArea = (e) => {
      let data = Draw.getAll();

      if (data.features.length > 0) {
        if (e.type === "draw.create") {
          let area = turf.area(data.features[data.features.length - 1]);

          let roundArea = area.toFixed(2);
          let newFeature = {
            ...data.features[data.features.length - 1],
            properties: {
              area: roundArea,
              label: "New Selection",
              selected: false,
            },
          };

          //use created feature to generate a polygon to find the center
          let newPoly = turf.polygon([newFeature.geometry.coordinates[0]]);

          //find center
          let myCenter = turf.centroid(newPoly);
          localStorage.setItem("polyCenter", JSON.stringify(myCenter));
          // NEW MAP CENTER FROM POLYGON STORED ON LOCAL STORAGE
          center = JSON.parse(localStorage.getItem("polyCenter")).geometry
            .coordinates;
          //NEW INITIAL ZOOM ON RE RENDER
          initZoom = 12;
          dispatch(addFeature(newFeature));
        }
      }
    };

    map.on("draw.create", updateArea);
    map.on("draw.delete", updateArea);
    map.on("draw.update", updateArea);

    //VARIABLE TO STORE THE FEATURES
    var geojson = {
      type: "FeatureCollection",
      features: [...features],
    };

    map.on("load", function () {
      if (features.length > 0) {
        geojson.features.forEach((feature, index) => {
          // DEFINE BOUNDING BOX FOR EACH FEATURE
          var bbox = turf.bbox(feature);

          //ADD EACH FEATURE TO THE MAP
          map.addSource(`jsonFile${index}`, {
            type: "geojson",
            data: feature,
          });
          map.addLayer({
            id: `jsonFile${index}`,
            type: "fill",
            source: `jsonFile${index}`,
            layout: {},

            paint: {
              "fill-color": "#303F9F",
              "fill-opacity": 0.5,
            },
          });

          // FIT MAP TO SELECTION
          document
            .getElementById(`fit-${index}`)
            .addEventListener("click", function () {
              map.fitBounds(bbox, { padding: 20 });
            });

          // SELECT/DESELECT ON CLICK
          map.on("click", `jsonFile${index}`, function (e) {
            feature.properties.selected = !feature.properties.selected;
            map.setPaintProperty(
              `jsonFile${index}`,
              "fill-color",
              feature.properties.selected ? "#FD9812" : "#303F9F"
            );
          });
        });
      }
    });

    return () => map.remove();
  }, [dispatch, features, bounds, mapViewport.lng, mapViewport.lat]);

  const classes = useStyles();
  return (
    <>
      <div
        className="map-container"
        style={{ height: "100%" }}
        ref={mapContainerRef}
      ></div>
      {features.length > 0 ? (
        <div
          className="zoom-box"
          style={
            features.length <= 3 && !show
              ? { height: "auto" }
              : features.length > 3 && show
              ? { height: "200px" }
              : null
          }
        >
          <Button color="primary" onClick={handleShow}>
            Zoom on selection {show ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
          {features.map((feature, index) => {
            return (
              <Button
                variant="contained"
                color="primary"
                id={`fit-${index}`}
                key={index}
                className={classes.zoom}
                style={show ? { display: "block" } : { display: "none" }}
              >
                {feature.properties.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default MapTool;

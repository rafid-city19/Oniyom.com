import { useState } from "react";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


// ===============================
// Location Marker
// ===============================

function LocationMarker({
  position,
  setPosition,
}) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      setPosition({
        lat,
        lng,
      });
    },
  });

  if (!position) {
    return null;
  }

  return (
    <Marker
      position={[
        position.lat,
        position.lng,
      ]}
    />
  );
}


// ===============================
// Map Controller
// ===============================

function MapController({ position }) {
  const map = useMap();

  if (position) {
    map.setView(
      [position.lat, position.lng],
      15,
      {
        animate: true,
      }
    );
  }

  return null;
}


// ===============================
// Location Picker
// ===============================

function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const defaultPosition = {
    lat: 23.8103,
    lng: 90.4125,
  };

  const [position, setPosition] = useState(
    latitude && longitude
      ? {
          lat: Number(latitude),
          lng: Number(longitude),
        }
      : defaultPosition
  );

  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");


  // ===============================
  // Handle map location change
  // ===============================

  const handleLocationChange = (
    newPosition
  ) => {
    setPosition(newPosition);

    onLocationChange({
      latitude: newPosition.lat,
      longitude: newPosition.lng,
    });
  };


  // ===============================
  // Get current location
  // ===============================

  const getCurrentLocation = () => {
    setLocationError("");
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setLocationError(
        "আপনার ব্রাউজারে Location সুবিধা নেই"
      );

      setLoadingLocation(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };

        handleLocationChange(newPosition);

        setLoadingLocation(false);
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        if (error.code === 1) {
          setLocationError(
            "Location permission দেওয়া হয়নি"
          );
        } else if (error.code === 2) {
          setLocationError(
            "আপনার অবস্থান খুঁজে পাওয়া যাচ্ছে না"
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location খুঁজতে বেশি সময় লাগছে"
          );
        } else {
          setLocationError(
            "বর্তমান অবস্থান পাওয়া যায়নি"
          );
        }

        setLoadingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">

      {/* Map */}

      <MapContainer
        center={[
          position.lat,
          position.lng,
        ]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-[400px] w-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={handleLocationChange}
        />

        <MapController
          position={position}
        />

      </MapContainer>


      {/* Current Location Button */}

      <div className="bg-zinc-950 p-4">

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loadingLocation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B7FF00] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingLocation
            ? "অবস্থান খোঁজা হচ্ছে..."
            : "📍 আমার বর্তমান অবস্থান ব্যবহার করুন"}
        </button>


        {locationError && (
          <p className="mt-3 text-sm text-red-400">
            {locationError}
          </p>
        )}

      </div>


      {/* Coordinates */}

      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 bg-zinc-950 p-4">

        <div>
          <p className="text-xs text-zinc-600">
            Latitude
          </p>

          <p className="mt-1 text-sm text-zinc-300">
            {position.lat.toFixed(6)}
          </p>
        </div>


        <div>
          <p className="text-xs text-zinc-600">
            Longitude
          </p>

          <p className="mt-1 text-sm text-zinc-300">
            {position.lng.toFixed(6)}
          </p>
        </div>

      </div>


      {/* Help text */}

      <div className="border-t border-zinc-800 bg-zinc-950 px-4 pb-4">

        <p className="text-xs text-zinc-600">
          📍 ম্যাপে ক্লিক করে অবস্থান নির্বাচন করুন অথবা
          আপনার বর্তমান অবস্থান ব্যবহার করুন।
        </p>

      </div>

    </div>
  );
}

export default LocationPicker;
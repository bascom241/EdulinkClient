// components/classroom/MapPicker.tsx
import { useEffect, useState } from "react";
import { MapContainer as Map, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type Props = {
  address: string;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
};

const MapPicker = ({ address, onLocationSelect }: Props) => {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [searchAddress, setSearchAddress] = useState(address);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (addressToGeocode: string) => {
    if (!addressToGeocode) return;
    
    setIsGeocoding(true);
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressToGeocode
        )}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        onLocationSelect({ lat, lng: lon });
      } else {
        alert("Address not found. Please try a different address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error finding address. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Auto-geocode when address prop changes
  useEffect(() => {
    if (address && address !== searchAddress) {
      setSearchAddress(address);
      geocodeAddress(address);
    }
  }, [address]);

  // Component to handle map clicks
  const LocationMarker = () => {
    useMapEvents({
      click(e: any) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
        
        // Reverse geocode to get address from coordinates
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });
    
    return position ? <Marker position={position} /> : null;
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        // You can update the address input field if needed via a callback
        console.log("Address found:", data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleSearch = () => {
    if (searchAddress) {
      geocodeAddress(searchAddress);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          onLocationSelect({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to get your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for a location..."
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isGeocoding}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          {isGeocoding ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          📍 My Location
        </button>
      </div>
      
      <div className="h-96 w-full rounded-xl overflow-hidden border border-gray-200 z-0">
        <Map
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </Map>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        💡 Tip: Click anywhere on the map to set exact coordinates, or search for an address
      </div>
    </div>
  );
};

export default MapPicker;
import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import API from "../../../api/axios"; // ✅
import "leaflet/dist/leaflet.css";

import Navbar from "../../../components/Navbar/Navbar";
import FilterPanel from "../../../components/FilterPanel/FilterPanel";
import MapCard from "../../../components/MapCard/MapCard";
import HouseModal from "../../../components/HouseModal/HouseModal";

import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const BlueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ChangeView = ({ center }) => {
  const map = useMap();
  if (center) map.flyTo(center, 15, { animate: true, duration: 1.2 });
  return null;
};

const MapClickHandler = ({ closeCard }) => {
  useMapEvents({ click: () => closeCard() });
  return null;
};

const HomePage = () => {
  const [allHouses, setAllHouses] = useState([]);
  const [displayedHouses, setDisplayedHouses] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const centerPosition = [42.4619, 59.6166];
  const nukusBounds = [
    [42.3, 59.4],
    [42.6, 59.85],
  ];

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await API.get("/houses"); // ✅
        setAllHouses(res.data);
        setDisplayedHouses(res.data);
      } catch (err) {
        console.error("Server menen baylanıs joq:", err);
      }
    };
    fetchHouses();
  }, []);

  const handleFilter = useCallback(
    (filters) => {
      if (!allHouses.length) return;
      let temp = [...allHouses];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        temp = temp.filter(
          (h) =>
            h.title.toLowerCase().includes(q) ||
            h.address.toLowerCase().includes(q),
        );
      }

      if (filters.rooms !== "all") {
        if (filters.rooms === "4+")
          temp = temp.filter((h) => Number(h.rooms) >= 4);
        else temp = temp.filter((h) => h.rooms == filters.rooms);
      }

      if (filters.minPrice)
        temp = temp.filter((h) => Number(h.price) >= Number(filters.minPrice));
      if (filters.maxPrice)
        temp = temp.filter((h) => Number(h.price) <= Number(filters.maxPrice));

      setDisplayedHouses(temp);
    },
    [allHouses],
  );

  const onMarkerClick = (house) => setActiveCard(house);

  const onOpenDetails = (house) => {
    setActiveCard(null);
    setSelectedHouse(house);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50">
      <Navbar />

      <div className="relative z-[1000]">
        <FilterPanel onFilter={handleFilter} />
      </div>

      <div className="absolute inset-0 z-0">
        <MapContainer
          center={centerPosition}
          zoom={13}
          minZoom={12}
          maxZoom={18}
          scrollWheelZoom={true}
          maxBounds={nukusBounds}
          maxBoundsViscosity={1.0}
          zoomControl={false}
          className="h-full w-full outline-none"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />

          <MapClickHandler closeCard={() => setActiveCard(null)} />

          {activeCard && (
            <ChangeView center={[activeCard.lat, activeCard.lng]} />
          )}

          {displayedHouses.map(
            (house) =>
              house.lat &&
              house.lng && (
                <Marker
                  key={house.id}
                  position={[house.lat, house.lng]}
                  icon={house.isAvailable ? BlueIcon : RedIcon}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      onMarkerClick(house);
                    },
                  }}
                />
              ),
          )}
        </MapContainer>
      </div>

      {activeCard && (
        <MapCard
          house={activeCard}
          onClose={() => setActiveCard(null)}
          onDetails={onOpenDetails}
        />
      )}

      {selectedHouse && (
        <HouseModal
          house={selectedHouse}
          onClose={() => setSelectedHouse(null)}
        />
      )}
    </div>
  );
};

export default HomePage;

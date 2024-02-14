"use client";

import React from "react";
import { Marker, GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const GOOGLE_MAPS_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string;

if (!GOOGLE_MAPS_API_KEY || !GOOGLE_MAPS_ID) {
  throw new Error("Missing API key or map id.");
}

const position = { lat: 12.683927491778288, lng: 101.2714474409568 };

const containerStyle = {
  width: "100%",
  height: "100%",
  "border-radius": "8px",
};

function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    id: GOOGLE_MAPS_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <div className="relative flex-1 self-stretch grow rounded-sm border-1 border-opacity-25 border-primaryT-darker">
      <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={18}>
        <Marker position={position} />
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(MapContainer);

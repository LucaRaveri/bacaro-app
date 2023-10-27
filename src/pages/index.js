import Map from "@components/Map";
import { createClient } from "@supabase/supabase-js";
import styles from "@styles/Home.module.scss";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_CENTER = [45.43848630936127, 12.330210049576655];

// const customIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

export default function Home() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function fetchMarkerData() {
      try {
        const { data, error } = await supabase.from("Bacari").select("*");
        if (error) {
          console.error("Errore durante la query:", error);
        } else {
          const mappedMarkers = data.map((record) => ({
            lng: parseFloat(record.longitude),
            lat: parseFloat(record.latitude),
            name: record.name,
            description: record.description,
            imageUrl: record.image,
          }));
          setMarkers(mappedMarkers); // Imposta lo stato dei marcatori
        }

      } catch (error) {
        console.error("Errore generale:", error);
      }
    }

    fetchMarkerData(); // Chiama la funzione per ottenere i dati quando il componente si monta
  }, []);

  return (
    <Map
      className={styles.homeMap}
      width="800"
      height="400"
      center={DEFAULT_CENTER}
      zoom={14}
    >
      {({ TileLayer, Marker, Popup }) => (
        <>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lng, marker.lat]}>
              <Popup style={{ maxWidth: "300px" }}>
                <div>
                  <h2>{marker.name}</h2>
                  <p>{marker.description}</p>
                </div>
                <img
                  src={marker.imageUrl}
                  alt="Descrizione dell'immagine"
                  style={{ width: "100%", height: "auto" }}
                />
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </Map>
  );
}

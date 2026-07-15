import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const reports = [
  { id: 1, title: 'Garbage pile near park', status: 'Pending', position: [19.228, 72.856] },
  { id: 2, title: 'Drainage blockage', status: 'In Progress', position: [19.231, 72.858] },
  { id: 3, title: 'Broken street light', status: 'Cleaned', position: [19.226, 72.853] },
];

const iconColors = {
  Pending: 'red',
  'In Progress': 'orange',
  Cleaned: 'green',
};

const createIcon = (color) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:9999px;border:2px solid white"></div>`,
  });

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Live map of civic reports</h1>
        <p className="mt-2 text-slate-600">Reports appear as markers with color-coded status.</p>

        <div className="mt-6 h-[480px] overflow-hidden rounded-2xl">
          <MapContainer center={[19.228, 72.856]} zoom={13} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => (
              <Marker key={report.id} position={report.position} icon={createIcon(iconColors[report.status])}>
                <Popup>
                  <strong>{report.title}</strong>
                  <br />
                  Status: {report.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { readReports } from '../lib/reportData';

const iconColors = {
  Pending: '#f59e0b',
  Acknowledged: '#8b5cf6',
  'In Progress': '#3b82f6',
  Delayed: '#ef4444',
  Resolved: '#10b981',
};

const createIcon = (color) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:9999px;border:3px solid white;box-shadow:0 2px 10px rgba(15,23,42,0.2)"></div>`,
  });

export default function MapPage() {
  const reports = readReports();

  const mapCenter = useMemo(() => {
    const firstReport = reports[0];
    if (firstReport && firstReport.latitude && firstReport.longitude) {
      return [Number(firstReport.latitude), Number(firstReport.longitude)];
    }
    return [19.228, 72.856];
  }, [reports]);

  const totals = {
    Pending: reports.filter((report) => report.status === 'Pending').length,
    Acknowledged: reports.filter((report) => report.status === 'Acknowledged').length,
    'In Progress': reports.filter((report) => report.status === 'In Progress').length,
    Delayed: reports.filter((report) => report.status === 'Delayed').length,
    Resolved: reports.filter((report) => report.status === 'Resolved').length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Live map of civic reports</h1>
        <p className="mt-2 text-slate-600">Reports appear as markers with color-coded status.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {Object.entries(totals).map(([status, count]) => (
            <div key={status} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{status}</p>
              <p className="mt-2 text-3xl font-semibold" style={{ color: iconColors[status] }}>
                {count}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 h-[480px] overflow-hidden rounded-2xl">
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => {
              if (!report.latitude || !report.longitude) return null;

              return (
                <Marker
                  key={report.id}
                  position={[Number(report.latitude), Number(report.longitude)]}
                  icon={createIcon(iconColors[report.status])}
                >
                  <Popup>
                    <strong>{report.title}</strong>
                    <br />
                    {report.category}
                    <br />
                    Status: {report.status}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

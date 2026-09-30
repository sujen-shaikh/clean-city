import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { addReport } from '../lib/reportData';

const issueTypes = ['Garbage', 'Drainage', 'Pothole', 'Street Light', 'Water Leakage'];

const defaultLocation = [19.228, 72.856];

const emptyForm = {
  title: '',
  description: '',
  category: 'Garbage',
  latitude: '',
  longitude: '',
};

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onSelect([lat, lng]);
    },
  });

  return null;
}

export default function Report() {
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [markerPosition, setMarkerPosition] = useState(defaultLocation);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const syncLocation = (lat, lng) => {
    setMarkerPosition([lat, lng]);
    setForm((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        syncLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        alert('Unable to access location. Please allow location access.');
      }
    );
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.latitude || !form.longitude) {
      alert('Please complete the title, description, and current GPS location before submitting.');
      return;
    }

    addReport({
      ...form,
      image: imagePreview,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    });

    alert('Report submitted successfully.');
    setForm(emptyForm);
    setImagePreview('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Report a civic issue</h1>
        <p className="mt-2 text-slate-600">Capture a photo, attach your location, and submit the issue in seconds.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                placeholder="Garbage pile near the park"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                placeholder="Describe the problem"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Issue Type</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              >
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
              <p className="font-medium text-slate-700">Attach a photo</p>
              <p className="mt-2 text-sm">Upload a photo so teams can verify the issue before dispatching support.</p>

              <label className="mt-4 inline-flex cursor-pointer rounded-full bg-emerald-600 px-5 py-2.5 text-white">
                Choose image
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>

              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mt-4 h-40 w-full rounded-2xl object-cover" />
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <div className="flex gap-3">
                <input
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  placeholder="Latitude"
                />
                <input
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  placeholder="Longitude"
                />
              </div>

              <div className="mt-4 h-56 overflow-hidden rounded-2xl border border-slate-200">
                <MapContainer center={markerPosition} zoom={14} scrollWheelZoom className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onSelect={(coords) => syncLocation(coords[0], coords[1])} />
                  <Marker position={markerPosition}>
                    <Popup>Selected issue location</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <button type="button" onClick={handleLocation} className="mt-3 rounded-full bg-slate-900 px-5 py-2.5 text-white">
                Use My Current Location
              </button>
            </div>

            <button type="submit" className="w-full rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

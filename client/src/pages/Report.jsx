import { useState } from 'react';

const issueTypes = ['Garbage', 'Drainage', 'Pothole', 'Street Light', 'Water Leakage'];

export default function Report() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Garbage',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        alert('Unable to access location. Please allow location access.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Report submitted successfully!');
        setForm({ title: '', description: '', category: 'Garbage', latitude: '', longitude: '' });
      } else {
        alert('Unable to submit report.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    }
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
              <p className="font-medium text-slate-700">Camera Capture</p>
              <p className="mt-2 text-sm">Photo upload is ready for integration with Cloudinary or Firebase storage.</p>
              <button type="button" className="mt-4 rounded-full bg-emerald-600 px-5 py-2.5 text-white">
                Open Camera
              </button>
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
              <button type="button" onClick={handleLocation} className="mt-3 rounded-full bg-slate-900 px-5 py-2.5 text-white">
                Use Current GPS
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

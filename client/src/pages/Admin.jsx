import { useEffect, useMemo, useState } from 'react';
import { readReports } from '../lib/reportData';

const ADMIN_PASSWORD = 'cleanadmin2026';
const ADMIN_AUTH_KEY = 'cleancity-admin-auth';

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-emerald-100 text-emerald-800',
};

function downloadCsv(reports) {
  const headers = ['id', 'title', 'category', 'description', 'status', 'latitude', 'longitude', 'createdAt'];
  const rows = reports.map((report) => [
    report.id,
    `"${(report.title || '').replace(/"/g, '""')}"`,
    `"${(report.category || '').replace(/"/g, '""')}"`,
    `"${(report.description || '').replace(/"/g, '""')}"`,
    report.status,
    report.latitude,
    report.longitude,
    report.createdAt,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'clean-city-admin-report-sheet.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    setIsAuthorized(saved);
  }, []);

  const reports = useMemo(() => readReports(), []);

  const summary = {
    total: reports.length,
    pending: reports.filter((item) => item.status === 'Pending').length,
    inProgress: reports.filter((item) => item.status === 'In Progress').length,
    resolved: reports.filter((item) => item.status === 'Resolved').length,
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthorized(true);
      setPassword('');
      return;
    }

    alert('Incorrect admin password.');
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthorized(false);
    setPassword('');
  };

  if (!isAuthorized) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Restricted</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Admin access</h1>
          <p className="mt-2 text-slate-600">This panel is only available to city administrators.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Enter dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Admin only</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">City report workbook</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => downloadCsv(reports)}
            className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Download Excel CSV
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.total}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{summary.pending}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">In progress</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{summary.inProgress}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{summary.resolved}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{report.title}</td>
                  <td className="px-4 py-3 text-slate-600">{report.category}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[report.status]}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {report.latitude}, {report.longitude}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

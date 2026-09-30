import { useMemo, useState } from 'react';
import { readReports, reportStatuses, updateReportStatus } from '../lib/reportData';

const statusOrder = ['All', 'Pending', 'Acknowledged', 'In Progress', 'Delayed', 'Resolved'];

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  Acknowledged: 'bg-violet-100 text-violet-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Delayed: 'bg-rose-100 text-rose-800',
  Resolved: 'bg-emerald-100 text-emerald-800',
};

export default function Dashboard() {
  const [reports, setReports] = useState(() => readReports());
  const [filter, setFilter] = useState('All');

  const filteredReports = useMemo(() => {
    if (filter === 'All') return reports;
    return reports.filter((report) => report.status === filter);
  }, [filter, reports]);

  const totalReports = reports.length;
  const pending = reports.filter((report) => report.status === 'Pending').length;
  const acknowledged = reports.filter((report) => report.status === 'Acknowledged').length;
  const inProgress = reports.filter((report) => report.status === 'In Progress').length;
  const delayed = reports.filter((report) => report.status === 'Delayed').length;
  const resolved = reports.filter((report) => report.status === 'Resolved').length;

  const handleStatusChange = (id, nextStatus) => {
    const updated = updateReportStatus(id, nextStatus);
    setReports(updated);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Operations center</p>
          <h1 className="mt-2 text-3xl font-semibold">City response dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOrder.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:text-emerald-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total reports</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalReports}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{pending}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Acknowledged</p>
          <p className="mt-2 text-3xl font-semibold text-violet-600">{acknowledged}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">In progress</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{inProgress}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Delayed</p>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{delayed}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{resolved}</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-semibold text-slate-900">{report.title}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[report.status]}`}>
                    {report.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{report.category} • {new Date(report.createdAt).toLocaleDateString()}</p>
                <p className="mt-3 max-w-3xl text-slate-600">{report.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={report.status}
                  onChange={(event) => handleStatusChange(report.id, event.target.value)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
                  aria-label={`Update status for ${report.title}`}
                >
                  {reportStatuses.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

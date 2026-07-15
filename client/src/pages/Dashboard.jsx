const reports = [
  { title: 'Garbage pile near school', status: 'Pending' },
  { title: 'Drainage blockage on main road', status: 'In Progress' },
  { title: 'Broken lamp post', status: 'Cleaned' },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Your dashboard</h1>
          <p className="mt-2 text-slate-600">Track the issues you submitted and their progress.</p>

          <div className="mt-6 space-y-3">
            {reports.map((report) => (
              <div key={report.title} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{report.title}</p>
                  <p className="text-sm text-slate-500">Submitted today</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{report.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">Rewards</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Reward points</p>
              <p className="text-3xl font-semibold text-emerald-700">320</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Badge</p>
              <p className="text-xl font-semibold text-slate-800">Silver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

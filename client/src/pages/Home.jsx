import { Link } from 'react-router-dom';
import { readReports } from '../lib/reportData';

const steps = [
  'Capture a photo instantly',
  'Auto-detect the location',
  'Track every response in real time',
];

const highlights = [
  { title: 'Quick response', text: 'Convert reports into verified action items within minutes.' },
  { title: 'Better visibility', text: 'See issues by category, urgency, and current status.' },
  { title: 'Accountable service', text: 'Keep citizens and field teams aligned on every update.' },
];

export default function Home() {
  const reports = readReports();
  const pending = reports.filter((item) => item.status === 'Pending').length;
  const inProgress = reports.filter((item) => item.status === 'In Progress').length;
  const resolved = reports.filter((item) => item.status === 'Resolved').length;

  const stats = [
    { label: 'Reports submitted', value: reports.length.toString() },
    { label: 'Pending', value: pending.toString() },
    { label: 'Resolved', value: resolved.toString() },
    { label: 'In progress', value: inProgress.toString() },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-cyan-600 p-8 text-white shadow-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">Smart civic reporting</p>
          <h1 className="text-4xl font-bold sm:text-5xl">See it. Snap it. Resolve it.</h1>
          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            Empower residents to report litter, broken infrastructure, and safety issues with geotagged photos and transparent status tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/report" className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50">
              Report Now
            </Link>
            <Link to="/map" className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              View Live Map
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Live city snapshot</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {stats.map((item) => (
              <div key={item.label} className="rounded-xl bg-white/15 p-4">
                <p className="text-3xl font-semibold">{item.value}</p>
                <p className="text-sm text-emerald-50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
                  {index + 1}
                </div>
                <p className="font-medium text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">Why CleanCity matters</h2>
          <p className="mt-4 text-slate-600">
            Community-driven reporting helps city teams act faster on clogged drains, damaged roads, unsafe lighting, and overflowing waste.
          </p>
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
            92% of residents say faster issue visibility leads to cleaner neighborhoods.
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((highlight) => (
          <article key={highlight.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Impact
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{highlight.title}</h3>
            <p className="mt-3 text-slate-600">{highlight.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

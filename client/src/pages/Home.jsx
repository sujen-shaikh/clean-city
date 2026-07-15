const stats = [
  { label: 'Reports Resolved', value: '2,345' },
  { label: 'Workers Active', value: '126' },
  { label: 'Pending Issues', value: '53' },
];

const steps = [
  'Capture a photo instantly',
  'Auto-detect the location',
  'Submit to the civic dashboard',
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-cyan-600 p-8 text-white shadow-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">Smart civic reporting</p>
          <h1 className="text-4xl font-bold sm:text-5xl">See it. Snap it. Report it.</h1>
          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            Let citizens report garbage, potholes, and civic issues in seconds with geotagged photos and live status tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/report" className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50">
              Report Now
            </a>
            <a href="/map" className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              View Live Map
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Live Statistics</h2>
          <div className="mt-5 space-y-4">
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
            The platform helps citizens report civic issues quickly so municipalities can respond faster and prioritize the most urgent locations.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Featured article</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">A cleaner city starts with simple action</h2>
            <p className="mt-4 text-slate-600">
              When residents report overflowing bins, blocked drains, or broken lights in real time, local teams can act faster and neighborhoods stay healthier. CleanCity turns everyday observations into meaningful civic action.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">What this article highlights</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Faster reporting for public issues</li>
              <li>• Clear visibility of unresolved problems</li>
              <li>• Better coordination between citizens and authorities</li>
            </ul>
            <a href="/report" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700">
              Report an issue
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

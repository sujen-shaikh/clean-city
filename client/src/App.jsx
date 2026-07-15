import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-semibold tracking-tight text-emerald-700">
            CleanCity
          </Link>
          <div className="flex gap-4 text-sm font-medium text-slate-700">
            <Link to="/report" className="hover:text-emerald-700">Report</Link>
            <Link to="/map" className="hover:text-emerald-700">Map</Link>
            <Link to="/dashboard" className="hover:text-emerald-700">Dashboard</Link>
            <Link to="/about" className="hover:text-emerald-700">About</Link>
            <Link to="/contact" className="hover:text-emerald-700">Contact</Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

const REPORTS_KEY = 'cleancity-reports';

export const defaultReports = [
  {
    id: 1,
    title: 'Garbage pile near the school gate',
    description: 'Large bins have overflowed and litter has spread across the pavement near the main entrance.',
    category: 'Garbage',
    latitude: '19.228400',
    longitude: '72.856700',
    status: 'Pending',
    createdAt: '2025-02-15T08:30:00.000Z',
    image: '',
  },
  {
    id: 2,
    title: 'Drainage blockage on Lilavati Road',
    description: 'Water is collecting in front of the bus stop and the drain is clogged with plastic waste.',
    category: 'Drainage',
    latitude: '19.231100',
    longitude: '72.858200',
    status: 'In Progress',
    createdAt: '2025-02-19T10:15:00.000Z',
    image: '',
  },
  {
    id: 3,
    title: 'Broken street light near Nandadeep Plaza',
    description: 'A street light has been out for several nights, creating a safety concern for pedestrians.',
    category: 'Street Light',
    latitude: '19.226500',
    longitude: '72.853900',
    status: 'Resolved',
    createdAt: '2025-02-21T18:00:00.000Z',
    image: '',
  },
];

export function readReports() {
  try {
    const saved = localStorage.getItem(REPORTS_KEY);
    if (!saved) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(defaultReports));
      return [...defaultReports];
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultReports];
  } catch (error) {
    console.error('Failed to read saved reports:', error);
    return [...defaultReports];
  }
}

export function writeReports(reports) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return reports;
}

export function addReport(report) {
  const current = readReports();
  const nextReport = {
    ...report,
    id: Date.now(),
    status: report.status || 'Pending',
    createdAt: report.createdAt || new Date().toISOString(),
  };

  const updated = [nextReport, ...current];
  return writeReports(updated);
}

export function updateReportStatus(id, status) {
  const current = readReports();
  const updated = current.map((item) =>
    item.id === Number(id) ? { ...item, status } : item
  );

  return writeReports(updated);
}

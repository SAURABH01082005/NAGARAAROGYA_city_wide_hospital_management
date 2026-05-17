import { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Activity,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  Server,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { AdminContext } from '../../contexts/AdminContext';

const websiteUsage = [
  { day: 'Mon', visits: 1240, appointments: 82 },
  { day: 'Tue', visits: 1680, appointments: 116 },
  { day: 'Wed', visits: 1510, appointments: 104 },
  { day: 'Thu', visits: 1920, appointments: 138 },
  { day: 'Fri', visits: 2140, appointments: 156 },
  { day: 'Sat', visits: 1760, appointments: 121 },
  { day: 'Sun', visits: 2330, appointments: 168 },
];

const bedTypeSurge = [
  { month: 'Jan', general_bed: 42, icu_bed: 18, nicu_bed: 8, critical_care_bed: 11 },
  { month: 'Feb', general_bed: 56, icu_bed: 24, nicu_bed: 11, critical_care_bed: 17 },
  { month: 'Mar', general_bed: 49, icu_bed: 30, nicu_bed: 14, critical_care_bed: 21 },
  { month: 'Apr', general_bed: 68, icu_bed: 37, nicu_bed: 16, critical_care_bed: 27 },
  { month: 'May', general_bed: 76, icu_bed: 46, nicu_bed: 19, critical_care_bed: 34 },
  { month: 'Jun', general_bed: 88, icu_bed: 52, nicu_bed: 22, critical_care_bed: 41 },
];

const bedTypeSeries = [
  { key: 'general_bed', label: 'General Bed', color: '#5D84F9' },
  { key: 'icu_bed', label: 'ICU Bed', color: '#F59E0B' },
  { key: 'nicu_bed', label: 'NICU Bed', color: '#22D3EE' },
  { key: 'critical_care_bed', label: 'Critical Care Bed', color: '#F43F5E' },
];

const recentActivity = [
  {
    title: 'New hospital onboarding request',
    detail: 'City Care Hospital submitted registration details',
    time: '12 min ago',
  },
  {
    title: 'Appointment traffic increased',
    detail: 'OPD bookings are up compared with last week',
    time: '1 hr ago',
  },
  {
    title: 'Hospital directory synced',
    detail: 'Public listing and map records refreshed',
    time: '3 hrs ago',
  },
  {
    title: 'Security check completed',
    detail: 'Admin authentication service reported normal activity',
    time: 'Today',
  },
];

const systemHealth = [
  { label: 'API Gateway', value: '99.9%', status: 'Healthy', color: 'bg-emerald-400' },
  { label: 'Hospital Links', value: '94%', status: 'Reachable', color: 'bg-sky-400' },
  { label: 'Auth Service', value: 'Normal', status: 'Secure', color: 'bg-violet-400' },
];

function AdminDashboard() {
  const { aToken, adminData } = useContext(AdminContext);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const getHospitals = async () => {
      if (!aToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/hospitals`,
          { headers: { atoken: aToken } }
        );

        if (data.success) {
          setHospitals(data.data || []);
          setLoadError('');
        } else {
          setLoadError(data.message || 'Unable to load hospital summary');
        }
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        setLoadError('Unable to load live hospital summary');
      } finally {
        setIsLoading(false);
      }
    };

    getHospitals();
  }, [aToken]);

  const activeHospitalCount = useMemo(
    () => hospitals.filter((hospital) => Boolean(hospital.url)).length,
    [hospitals]
  );

  const maxVisits = Math.max(...websiteUsage.map((item) => item.visits));
  const bedChartWidth = 720;
  const bedChartHeight = 270;
  const bedChartPadding = { top: 22, right: 26, bottom: 38, left: 42 };
  const bedPlotWidth = bedChartWidth - bedChartPadding.left - bedChartPadding.right;
  const bedPlotHeight = bedChartHeight - bedChartPadding.top - bedChartPadding.bottom;
  const maxBedSurge =
    Math.ceil(
      Math.max(...bedTypeSurge.flatMap((month) => bedTypeSeries.map((series) => month[series.key]))) / 10
    ) * 10;

  const getBedChartPoint = (value, index) => {
    const x = bedChartPadding.left + (index / (bedTypeSurge.length - 1)) * bedPlotWidth;
    const y = bedChartPadding.top + (1 - value / maxBedSurge) * bedPlotHeight;

    return { x, y };
  };

  const summaryCards = [
    {
      label: 'Registered Hospitals',
      value: isLoading ? '...' : hospitals.length,
      note: `${activeHospitalCount} linked websites`,
      icon: Building2,
      iconStyle: 'bg-blue-500/10 text-blue-400',
    },
    {
      label: 'Website Visits',
      value: '12.6k',
      note: '+18% this week',
      icon: TrendingUp,
      iconStyle: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      label: 'Appointments Routed',
      value: '885',
      note: 'Across OPD services',
      icon: CalendarDays,
      iconStyle: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: 'Active Users',
      value: '3,240',
      note: 'Patients, doctors, admins',
      icon: UsersRound,
      iconStyle: 'bg-cyan-500/10 text-cyan-400',
    },
  ];

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen h-[700px] overflow-y-auto no-scrollbar w-full px-5 py-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-lg border border-[#5D84F9]/30 bg-[#5D84F9]/10 px-3 py-1 text-xs font-medium text-[#9BB2FF]">
              <ShieldCheck className="h-4 w-4" />
              Admin Control Center
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-400">
              Welcome back, {adminData?.name || 'Administrator'}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-100">Platform Stable</p>
              <p className="text-xs text-gray-500">Last checked today</p>
            </div>
          </div>
        </div>

        {loadError && (
          <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {loadError}. Static usage insights are still available.
          </div>
        )}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-lg border border-gray-800 bg-gray-900/60 p-5 shadow-lg shadow-black/20 transition-colors hover:border-[#5D84F9]/50"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{card.label}</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-50">{card.value}</h2>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.iconStyle}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">{card.note}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-lg border border-gray-800 bg-gray-900/60 p-5 shadow-xl shadow-black/25 md:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100">
                  <Activity className="h-5 w-5 text-[#5D84F9]" />
                  Website Usage
                </h2>
                <p className="mt-1 text-sm text-gray-500">Weekly visits and appointment activity</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5D84F9]" />
                  Visits
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Appointments
                </span>
              </div>
            </div>

            <div className="h-72 rounded-lg border border-gray-800 bg-[#161A24] px-4 pb-4 pt-6">
              <div className="flex h-full items-end justify-between gap-3">
                {websiteUsage.map((item) => {
                  const visitHeight = `${Math.max((item.visits / maxVisits) * 100, 12)}%`;
                  const appointmentHeight = `${Math.max((item.appointments / 180) * 100, 10)}%`;

                  return (
                    <div key={item.day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3">
                      <div className="flex h-full w-full max-w-14 items-end justify-center gap-1.5">
                        <div
                          className="w-4 rounded-t-lg bg-[#5D84F9] shadow-lg shadow-[#5D84F9]/20"
                          style={{ height: visitHeight }}
                          title={`${item.visits.toLocaleString()} visits`}
                        />
                        <div
                          className="w-4 rounded-t-lg bg-emerald-400 shadow-lg shadow-emerald-400/10"
                          style={{ height: appointmentHeight }}
                          title={`${item.appointments} appointments`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-300">{item.day}</p>
                        <p className="mt-1 text-[11px] text-gray-500">{item.visits.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-800 bg-gray-900/60 p-5 shadow-xl shadow-black/25 md:p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100">
              <Server className="h-5 w-5 text-[#5D84F9]" />
              System Health
            </h2>
            <div className="mt-5 space-y-4">
              {systemHealth.map((item) => (
                <div key={item.label} className="rounded-lg border border-gray-800 bg-[#161A24] p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${item.color}`} />
                      <p className="font-medium text-gray-200">{item.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-100">{item.value}</p>
                  </div>
                  <p className="text-sm text-gray-500">{item.status}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-[#5D84F9]/25 bg-[#5D84F9]/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#B7C7FF]">
                <Globe2 className="h-4 w-4" />
                Network Coverage
              </div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="mt-1 text-sm text-gray-400">City-wide hospital access monitoring</p>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900/60 p-5 shadow-xl shadow-black/25 md:p-6">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100">
                <Activity className="h-5 w-5 text-[#5D84F9]" />
                Bed-Type Surge by Month
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Static monthly demand trend for bed queue categories
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
              {bedTypeSeries.map((series) => (
                <span key={series.key} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.color }} />
                  {series.label}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#161A24] p-4 no-scrollbar">
            <svg
              viewBox={`0 0 ${bedChartWidth} ${bedChartHeight}`}
              className="min-w-[680px] w-full"
              role="img"
              aria-label="Line chart showing monthly bed-type surge"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = bedChartPadding.top + ratio * bedPlotHeight;
                const value = Math.round(maxBedSurge * (1 - ratio));

                return (
                  <g key={ratio}>
                    <line
                      x1={bedChartPadding.left}
                      y1={y}
                      x2={bedChartWidth - bedChartPadding.right}
                      y2={y}
                      stroke="#263244"
                      strokeWidth="1"
                    />
                    <text x="8" y={y + 4} fill="#6B7280" fontSize="11">
                      {value}
                    </text>
                  </g>
                );
              })}

              {bedTypeSeries.map((series) => (
                <g key={series.key}>
                  <polyline
                    points={bedTypeSurge
                      .map((month, index) => {
                        const point = getBedChartPoint(month[series.key], index);
                        return `${point.x},${point.y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {bedTypeSurge.map((month, index) => {
                    const point = getBedChartPoint(month[series.key], index);

                    return (
                      <circle
                        key={`${series.key}-${month.month}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#161A24"
                        stroke={series.color}
                        strokeWidth="2"
                      />
                    );
                  })}
                </g>
              ))}

              {bedTypeSurge.map((month, index) => {
                const x = bedChartPadding.left + (index / (bedTypeSurge.length - 1)) * bedPlotWidth;

                return (
                  <text
                    key={month.month}
                    x={x}
                    y={bedChartHeight - 10}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="12"
                  >
                    {month.month}
                  </text>
                );
              })}
            </svg>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-lg border border-gray-800 bg-gray-900/60 p-5 shadow-xl shadow-black/25 md:p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100">
              <Clock3 className="h-5 w-5 text-[#5D84F9]" />
              Recent Activity
            </h2>
            <div className="mt-5 divide-y divide-gray-800">
              {recentActivity.map((item) => (
                <div key={item.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#5D84F9]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-800 bg-gray-900/60 p-5 shadow-xl shadow-black/25 md:p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-100">
              <Building2 className="h-5 w-5 text-[#5D84F9]" />
              Hospital Summary
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-800 bg-[#161A24] p-4">
                <p className="text-sm text-gray-500">Linked Websites</p>
                <p className="mt-2 text-3xl font-bold text-gray-50">{activeHospitalCount}</p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-[#161A24] p-4">
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="mt-2 text-3xl font-bold text-gray-50">3</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-gray-800 bg-[#161A24] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-gray-200">Directory Completion</p>
                <p className="text-sm font-semibold text-emerald-400">86%</p>
              </div>
              <div className="h-2 rounded-full bg-gray-800">
                <div className="h-2 w-[86%] rounded-full bg-emerald-400" />
              </div>
              <p className="mt-3 text-sm text-gray-500">Hospital profiles, websites, and public contact records</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

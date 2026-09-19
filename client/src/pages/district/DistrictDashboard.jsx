import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Coins,
  Eye,
  FileSearch,
  LandPlot,
  Scale,
  Search,
  Users,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { GISMap } from '../../components/gis/GISMap';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { Table } from '../../components/ui/Table';

import { useAuth } from '../../hooks/useAuth';
import { useGIS } from '../../hooks/useGIS';
import apiClient from '../../services/api/apiClient';

const formatActivityTime = (value) => {
  if (!value) return 'Recent';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const age = Date.now() - date.getTime();

  if (age > 86400000) {
    return 'Yesterday';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatusDot = ({ tone = 'pending' }) => (
  <span
    className={`status-dot status-dot-${tone}`}
    aria-hidden="true"
  />
);

export const DistrictDashboard = () => {
  const { user } = useAuth();

  const {
    geoJsonData,
    stats,
    setSelectedParcel,
    loading: gisLoading,
  } = useGIS();

  const [projects, setProjects] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [compensation, setCompensation] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rrPackages, setRrPackages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [audit, setAudit] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);

      const requests = await Promise.allSettled([
        apiClient.get('/projects'),
        apiClient.get('/parcels'),
        apiClient.get('/compensation'),
        apiClient.get('/documents'),
        apiClient.get('/rr'),
        apiClient.get('/notifications'),
        apiClient.get('/audit?limit=6'),
      ]);

      if (!mounted) return;

      const getData = (index) => {
        const request = requests[index];

        if (request.status !== 'fulfilled') {
          return [];
        }

        const data = request.value?.data?.data;

        return Array.isArray(data) ? data : [];
      };

      setProjects(getData(0));
      setParcels(getData(1));
      setCompensation(getData(2));
      setDocuments(getData(3));
      setRrPackages(getData(4));
      setNotifications(getData(5));
      setAudit(getData(6));

      setLoading(false);
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * All KPI values are derived from backend records.
   * No fallback/demo numbers are used.
   */
  const kpis = useMemo(() => {
    const pendingVerification = parcels.filter(
      (parcel) => !parcel.fieldVerification?.isVerified
    ).length;

    const highRiskCases =
      projects.filter((project) =>
        ['HIGH', 'CRITICAL'].includes(project.riskLevel)
      ).length +
      parcels.filter(
        (parcel) => parcel.acquisitionStatus === 'DISPUTED'
      ).length;

    const pendingCompensation = compensation.filter(
      (award) => award.disbursementStatus !== 'DISBURSED'
    ).length;

    return {
      activeProjects: projects.length,
      pendingVerification,
      highRiskCases,
      compensationPending: pendingCompensation,
    };
  }, [compensation, parcels, projects]);

  const activity = useMemo(() => {
    const auditItems = audit.map((item) => ({
      time: formatActivityTime(item.timestamp),
      action:
        item.action
          ?.replace(/_/g, ' ')
          .replace(/^\w/, (letter) => letter.toUpperCase()) ||
        'Administrative action',
      entity:
        item.userEmail ||
        item.module ||
        'District administration',
    }));

    const notificationItems = notifications.slice(0, 6).map((item) => ({
      time: formatActivityTime(item.createdAt),
      action: item.title || 'Notification',
      entity: item.message || 'District notification',
    }));

    return [...auditItems, ...notificationItems].slice(0, 6);
  }, [audit, notifications]);

  const filteredParcels = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return parcels;
    }

    return parcels.filter((parcel) =>
      [
        parcel.surveyNumber,
        parcel.village,
        parcel.primaryOwnerName,
      ].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [parcels, search]);

  const visibleFeatures = useMemo(() => {
    const features = geoJsonData?.features || [];
    const query = search.trim().toLowerCase();

    if (!query) {
      return features;
    }

    return features.filter((feature) =>
      [
        feature.properties?.surveyNumber,
        feature.properties?.village,
        feature.properties?.primaryOwnerName,
      ].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [geoJsonData, search]);

  const secondaryStats = useMemo(
    () => [
      [
        'Parcels Acquired',
        stats?.awardedParcels ??
          parcels.filter(
            (parcel) =>
              parcel.acquisitionStatus === 'AWARD_PRONOUNCED'
          ).length,
      ],
      [
        'Documents Pending',
        documents.filter(
          (document) =>
            document.verificationStatus === 'PENDING'
        ).length,
      ],
      [
        'Disputed Parcels',
        stats?.disputedParcels ??
          parcels.filter(
            (parcel) =>
              parcel.acquisitionStatus === 'DISPUTED'
          ).length,
      ],
      [
        'R&R Pending',
        rrPackages.filter(
          (item) =>
            item.deliveryStatus !== 'FULLY_DELIVERED'
        ).length,
      ],
    ],
    [documents, parcels, rrPackages, stats]
  );

  const priorityActions = useMemo(
    () => [
      {
        title: 'Parcel verification required',
        detail:
          kpis.pendingVerification > 0
            ? `${kpis.pendingVerification} parcels awaiting review`
            : 'No parcels currently awaiting verification',
        to: '/district/parcels',
        tone:
          kpis.pendingVerification > 0
            ? 'progress'
            : 'closed',
      },
      {
        title: 'Compensation approval',
        detail:
          kpis.compensationPending > 0
            ? `${kpis.compensationPending} compensation records not yet disbursed`
            : 'No compensation records currently pending',
        to: '/district/compensation',
        tone:
          kpis.compensationPending > 0
            ? 'progress'
            : 'closed',
      },
      {
        title: 'High-risk acquisition',
        detail:
          kpis.highRiskCases > 0
            ? `${kpis.highRiskCases} cases require attention`
            : 'No high-risk cases currently recorded',
        to: '/district/projects',
        tone:
          kpis.highRiskCases > 0
            ? 'urgent'
            : 'closed',
      },
    ],
    [
      kpis.compensationPending,
      kpis.highRiskCases,
      kpis.pendingVerification,
    ]
  );

  const parcelColumns = [
    {
      title: 'Survey #',
      key: 'surveyNumber',
      render: (value) => (
        <span className="font-mono font-bold text-kobicha">
          {value || '—'}
        </span>
      ),
    },
    {
      title: 'Village',
      key: 'village',
      render: (value) => value || '—',
    },
    {
      title: 'Primary Landowner',
      key: 'primaryOwnerName',
      render: (value) => (
        <span className="font-bold text-bistre">
          {value || '—'}
        </span>
      ),
    },
    {
      title: 'Area (Acres)',
      key: 'areaAcres',
      render: (value) =>
        value !== undefined && value !== null
          ? value
          : '—',
    },
    {
      title: 'Status',
      key: 'acquisitionStatus',
      render: (value) =>
        value ? (
          <Badge status={value}>
            {String(value).replace(/_/g, ' ')}
          </Badge>
        ) : (
          '—'
        ),
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/district/parcels/${row.id}`}>
          <Button
            size="sm"
            variant="outline"
            icon={Eye}
          >
            Inspect Plot
          </Button>
        </Link>
      ),
    },
  ];

  const districtName =
    user?.jurisdiction?.district || 'District';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-kobicha mb-1">
            SIH26016 / District Authority
          </div>

          <h2 className="text-xl font-bold text-bistre">
            District Land Acquisition Authority
          </h2>

          <p className="text-xs text-text-muted mt-1">
            Office of District Collector &amp; Competent LAA Authority
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 border border-chamoisee/30 rounded-lg bg-surface text-text-muted">
            <Search className="w-4 h-4 shrink-0" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search parcels"
              aria-label="Search parcels"
              className="w-full sm:w-48 bg-transparent border-0 outline-none text-xs text-text-primary placeholder:text-text-muted"
            />
          </label>

          <div className="text-xs text-text-muted">
            <span className="font-semibold text-bistre">
              {districtName}
            </span>{' '}
            District
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Projects"
          value={loading ? '—' : kpis.activeProjects}
          subtitle="Projects within district jurisdiction"
          icon={LandPlot}
          color="kobicha"
        />

        <KPICard
          title="Parcels Pending Verification"
          value={loading ? '—' : kpis.pendingVerification}
          subtitle="Field verification not completed"
          icon={Users}
          color="warning"
        />

        <KPICard
          title="High-Risk Cases"
          value={loading ? '—' : kpis.highRiskCases}
          subtitle="Projects or parcels marked high risk"
          icon={AlertTriangle}
          color="danger"
        />

        <KPICard
          title="Compensation Pending"
          value={loading ? '—' : kpis.compensationPending}
          subtitle="Records not yet disbursed"
          icon={Coins}
          color="info"
        />
      </div>

      {/* Secondary Stats */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            setShowMoreStats((current) => !current)
          }
          aria-expanded={showMoreStats}
          className="text-xs font-semibold text-kobicha hover:underline flex items-center gap-1"
        >
          {showMoreStats
            ? 'Hide more stats'
            : 'Show more stats'}

          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              showMoreStats ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {showMoreStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map(([label, value]) => (
            <div
              key={label}
              className="p-4 border border-chamoisee/20 rounded-xl bg-surface"
            >
              <p className="text-[10px] uppercase tracking-wide text-text-muted">
                {label}
              </p>

              <p className="text-xl font-bold text-bistre mt-1">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/district/field-officers"
          className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group"
        >
          <UserCheck className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />

          <span className="text-xs font-bold text-bistre block">
            Field Officers
          </span>

          <span className="text-[10px] text-text-muted">
            View surveyors
          </span>
        </Link>

        <Link
          to="/district/documents"
          className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group"
        >
          <FileSearch className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />

          <span className="text-xs font-bold text-bistre block">
            Verify Documents
          </span>

          <span className="text-[10px] text-text-muted">
            Document queue
          </span>
        </Link>

        <Link
          to="/district/compensation"
          className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group"
        >
          <Coins className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />

          <span className="text-xs font-bold text-bistre block">
            Compensation
          </span>

          <span className="text-[10px] text-text-muted">
            Awards &amp; disbursement
          </span>
        </Link>

        <Link
          to="/district/rr"
          className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group"
        >
          <Scale className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />

          <span className="text-xs font-bold text-bistre block">
            R&amp;R
          </span>

          <span className="text-[10px] text-text-muted">
            Rehabilitation &amp; resettlement
          </span>
        </Link>
      </div>

      {/* GIS */}
      <Card
        title="District Cadastral Spatial Viewer"
        subtitle="Cadastral boundaries and acquisition status across the district"
        action={
          <Link to="/district/gis">
            <Button
              size="sm"
              variant="outline"
              icon={ArrowRight}
            >
              Full GIS View
            </Button>
          </Link>
        }
      >
        <GISMap
          features={visibleFeatures}
          stats={stats}
          onSelectParcel={setSelectedParcel}
          height="380px"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 text-xs text-text-muted">
          <span>
            {gisLoading
              ? 'Loading spatial records…'
              : `${visibleFeatures.length} parcel boundaries available`}
          </span>

          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <StatusDot tone="urgent" />
              Disputed
            </span>

            <span className="flex items-center gap-1">
              <StatusDot tone="progress" />
              In progress
            </span>

            <span className="flex items-center gap-1">
              <StatusDot tone="pending" />
              Pending review
            </span>
          </span>
        </div>
      </Card>

      {/* Parcels + Delay Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Land Parcels Queue"
            subtitle="Review ownership, acquisition status and ground survey records"
            action={
              <Link to="/district/parcels">
                <Button
                  size="sm"
                  variant="outline"
                  icon={ArrowRight}
                >
                  View All
                </Button>
              </Link>
            }
          >
            {loading ? (
              <div className="py-10 text-center text-xs text-text-muted">
                Loading district parcel records…
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="py-10 text-center text-xs text-text-muted">
                No parcel records found.
              </div>
            ) : (
              <Table
                columns={parcelColumns}
                data={filteredParcels}
                onRowClick={(row) =>
                  setSelectedParcel(row)
                }
              />
            )}
          </Card>
        </div>

        <div>
          <DelayRadar />
        </div>
      </div>

      {/* Priority Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Priority Actions"
          subtitle="Current items requiring district attention"
        >
          <div className="divide-y divide-chamoisee/15">
            {priorityActions.map((item) => (
              <div
                key={item.title}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusDot tone={item.tone} />

                    <span className="text-xs font-bold text-bistre">
                      {item.title}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-muted mt-1">
                    {item.detail}
                  </p>
                </div>

                <Link
                  to={item.to}
                  className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-kobicha hover:underline"
                >
                  Review
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Recent Activity"
          subtitle="Latest recorded district actions"
        >
          {loading && activity.length === 0 ? (
            <div className="py-10 text-center text-xs text-text-muted">
              Loading recent activity…
            </div>
          ) : activity.length === 0 ? (
            <div className="py-10 text-center text-xs text-text-muted">
              No recent activity recorded.
            </div>
          ) : (
            <div className="divide-y divide-chamoisee/15">
              {activity.map((item, index) => (
                <div
                  className="py-3.5 flex items-start gap-3"
                  key={`${item.time}-${index}`}
                >
                  <span className="w-14 shrink-0 text-[10px] font-semibold text-kobicha">
                    {item.time}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-bistre">
                      {item.action}
                    </p>

                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                      {item.entity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DistrictDashboard;
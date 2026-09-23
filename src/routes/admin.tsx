import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CountUp from "@/components/ui/CountUp";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import {
  getBookings,
  fetchBookingsFromSupabase,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  resetToDemoBookings,
  exportBookingsCsv,
  type BookingStatus,
  type Reservation,
} from "@/lib/bookings";
import { getEmailLogs, resendBookingEmail } from "@/lib/api/bookings";
import type { EmailLog } from "@/types/booking";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  isAdminAuthenticated,
  setAdminSession,
  verifyPasscode,
  getStoredPasscode,
  setOwnerPasscode,
} from "@/lib/admin-auth";
import { inr, whatsappUrl, vehicles } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner Admin Portal — Rashe Holidays" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setCheckingAuth(false);
  }, []);

  const handleLogin = (remember: boolean) => {
    setAdminSession(true, remember);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAdminSession(false);
    setAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="size-5 animate-spin text-gold" />
          <span>Verifying owner access…</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

/* =========================================================================
   LOGIN SCREEN
   ========================================================================= */
function AdminLogin({ onLogin }: { onLogin: (remember: boolean) => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter the owner passcode.");
      return;
    }
    if (verifyPasscode(passcode)) {
      setError("");
      onLogin(remember);
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/30">
            <Lock className="size-8" />
          </div>

          <div className="mt-6 text-center">
            <span className="eyebrow">Restricted Area</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Owner Portal
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your owner passcode to view and manage customer reservations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Owner Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter passcode"
                  className={cn(
                    "h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/30",
                    error &&
                      "border-destructive focus:border-destructive focus:ring-destructive/20",
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
                  <AlertCircle className="size-3.5" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-border text-gold accent-gold focus:ring-gold"
                />
                Remember this device
              </label>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full">
              <KeyRound className="size-4" /> Unlock Dashboard
            </Button>

            <div className="rounded-xl border border-border/70 bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
              Default passcode:{" "}
              <span className="font-mono font-semibold text-foreground">ootyadmin2026</span>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tripTypeFilter, setTripTypeFilter] = useState<string>("all");
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const [isSyncing, setIsSyncing] = useState(false);

  const refreshBookings = async () => {
    setBookings(getBookings());
    if (isSupabaseConfigured) {
      setIsSyncing(true);
      try {
        const synced = await fetchBookingsFromSupabase();
        setBookings(synced);
      } catch (err) {
        console.warn("Supabase fetch error:", err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  useEffect(() => {
    refreshBookings();
    setCurrentTime(
      new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    );

    const handleUpdate = () => refreshBookings();
    window.addEventListener("nilgiri_bookings_updated", handleUpdate);
    window.addEventListener("nilgiri_booking_created", handleUpdate);
    return () => {
      window.removeEventListener("nilgiri_bookings_updated", handleUpdate);
      window.removeEventListener("nilgiri_booking_created", handleUpdate);
    };
  }, []);

  // Filtered reservations
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = b.name.toLowerCase().includes(query);
        const matchPhone = b.phone.toLowerCase().includes(query);
        const matchEmail = (b.email || "").toLowerCase().includes(query);
        const matchRoute = `${b.from} ${b.to}`.toLowerCase().includes(query);
        const matchId = b.id.toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchEmail && !matchRoute && !matchId) {
          return false;
        }
      }
      // Status filter
      if (statusFilter !== "all" && b.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && b.category !== categoryFilter) {
        return false;
      }
      // Trip Type
      if (tripTypeFilter !== "all" && b.tripType !== tripTypeFilter) {
        return false;
      }
      return true;
    });
  }, [bookings, search, statusFilter, categoryFilter, tripTypeFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = bookings.length;
    const newRequests = bookings.filter((b) => b.status === "New").length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
    const pipelineEstimate = bookings
      .filter((b) => b.status !== "Cancelled")
      .reduce((acc, b) => acc + (b.estimate?.low || 0), 0);

    return { total, newRequests, confirmed, pipelineEstimate };
  }, [bookings]);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    refreshBookings();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove reservation ${id} (${name})?`)) {
      deleteBooking(id);
      refreshBookings();
      if (activeReservation?.id === id) {
        setActiveReservation(null);
      }
    }
  };

  const handleResetDemo = () => {
    if (confirm("Reset bookings back to the original demo sample requests?")) {
      resetToDemoBookings();
      refreshBookings();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80">
              <div className="grid size-9 place-items-center rounded-xl bg-gold text-ink font-bold text-base shadow">
                RH
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-foreground block leading-tight">
                  Rashe Holidays
                </span>
                <span className="text-[10px] font-semibold text-gold uppercase tracking-wider block leading-none">
                  Owner Admin
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Reservations
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-muted-foreground mr-2">
              {currentTime}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => exportBookingsCsv(bookings)}
              title="Download all reservations as CSV spreadsheet"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasscodeModal(true)}
              title="Change owner passcode"
            >
              <Settings className="size-3.5" />
              <span className="hidden sm:inline">Passcode</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Log out and lock admin panel"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container-x pt-8">
        {/* Title and stats bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Reservation Dashboard
              </h1>
              {isSupabaseConfigured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Live
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
                  title="Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
                >
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Local / Offline Mode
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitor incoming cab bookings, contact travellers, and track trip statuses.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isSupabaseConfigured && (
              <Button
                variant="outline"
                size="sm"
                onClick={refreshBookings}
                disabled={isSyncing}
                title="Fetch latest bookings from Supabase"
              >
                <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin text-gold")} />
                <span className="hidden sm:inline">Sync DB</span>
              </Button>
            )}
            <Link to="/booking">
              <Button variant="gold" size="sm">
                + Create Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Total Requests</span>
              <Users className="size-4 text-gold" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              <CountUp to={metrics.total} duration={1.5} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">All logged reservations</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-card p-5 shadow-card relative overflow-hidden">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                New Requests
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              <CountUp to={metrics.newRequests} duration={1.5} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Awaiting owner response</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
              <CheckCircle className="size-4 text-indigo-500" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              <CountUp to={metrics.confirmed} duration={1.5} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Trips confirmed with driver</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Est. Pipeline</span>
              <Car className="size-4 text-gold" />
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-gold truncate">
              {inr(metrics.pipelineEstimate)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active bookings estimate</p>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, phone, email, route, or ID…"
                className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold outline-none focus:border-gold"
            >
              <option value="all">All Statuses ({bookings.length})</option>
              <option value="New">New ({bookings.filter((b) => b.status === "New").length})</option>
              <option value="Contacted">
                Contacted ({bookings.filter((b) => b.status === "Contacted").length})
              </option>
              <option value="Confirmed">
                Confirmed ({bookings.filter((b) => b.status === "Confirmed").length})
              </option>
              <option value="Completed">
                Completed ({bookings.filter((b) => b.status === "Completed").length})
              </option>
              <option value="Cancelled">
                Cancelled ({bookings.filter((b) => b.status === "Cancelled").length})
              </option>
            </select>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold outline-none focus:border-gold"
            >
              <option value="all">All Vehicle Types</option>
              <option value="4-seater">4-Seater Cars</option>
              <option value="8-seater">8-Seater Innova</option>
              <option value="19-seater">19-Seater Traveller</option>
            </select>

            {/* Trip Type Dropdown */}
            <select
              value={tripTypeFilter}
              onChange={(e) => setTripTypeFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold outline-none focus:border-gold"
            >
              <option value="all">All Trip Types</option>
              <option value="one-way">One Way</option>
              <option value="round-trip">Round Trip</option>
            </select>
          </div>

          {/* Quick status tabs for desktop */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Quick Filter:
            </span>
            {(["all", "New", "Contacted", "Confirmed", "Completed", "Cancelled"] as const).map(
              (s) => {
                const count =
                  s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                      statusFilter === s
                        ? "bg-gold text-ink"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s === "all" ? "All" : s} ({count})
                  </button>
                );
              },
            )}

            {(search ||
              statusFilter !== "all" ||
              categoryFilter !== "all" ||
              tripTypeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setTripTypeFilter("all");
                }}
                className="ml-auto text-xs font-medium text-gold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Actions */}
        <div className="mt-6 flex items-center justify-between px-1">
          <p className="text-xs font-medium text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
            {bookings.length} reservations
          </p>

          <button
            type="button"
            onClick={handleResetDemo}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RefreshCw className="size-3" /> Reset Demo Bookings
          </button>
        </div>

        {/* Bookings List / Table */}
        {filtered.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Car className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No reservations found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || statusFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "No customer booking requests have been recorded yet."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setTripTypeFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map((item) => (
              <ReservationRow
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
                onViewDetails={() => setActiveReservation(item)}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Reservation Details Modal */}
      {activeReservation && (
        <ReservationModal
          reservation={activeReservation}
          onClose={() => setActiveReservation(null)}
          onStatusChange={handleStatusChange}
          onSaveNotes={(id, notes) => {
            updateBooking(id, { internalNotes: notes });
            setActiveReservation((prev) => (prev ? { ...prev, internalNotes: notes } : null));
            refreshBookings();
          }}
        />
      )}

      {/* Change Passcode Modal */}
      {showPasscodeModal && <PasscodeModal onClose={() => setShowPasscodeModal(false)} />}
    </div>
  );
}

/* =========================================================================
   RESERVATION CARD / ROW COMPONENT
   ========================================================================= */
function ReservationRow({
  item,
  onStatusChange,
  onViewDetails,
  onDelete,
}: {
  item: Reservation;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onViewDetails: () => void;
  onDelete: () => void;
}) {
  const vehicleObj = item.vehicle ? vehicles.find((v) => v.slug === item.vehicle) : null;
  const vehicleName = vehicleObj ? vehicleObj.name : `${item.category} vehicle`;

  // WhatsApp quick response message
  const waMessage = `Hi ${item.name}! This is Rashe Holidays regarding your reservation ${item.id} (${item.from} → ${item.to}, ${item.date}). We would love to confirm availability and driver details for your ${vehicleName}. Are you ready to proceed?`;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:border-border/80 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Identification and customer details */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20">
              {item.id}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(item.createdAt).toLocaleString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                item.tripType === "round-trip"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
              )}
            >
              {item.tripType === "round-trip" ? "Round Trip" : "One Way"}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-base font-bold text-foreground">{item.name}</h3>
            <a
              href={`tel:${item.phone}`}
              className="text-xs font-semibold text-muted-foreground hover:text-gold flex items-center gap-1"
            >
              <Phone className="size-3 text-gold" />
              {item.phone}
            </a>
            {item.email && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="size-3" />
                {item.email}
              </span>
            )}
          </div>

          {/* Route and dates */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground flex items-center gap-1">
              <MapPin className="size-3.5 text-gold" />
              {item.from} → {item.to}
              {item.tripType === "round-trip" ? ` → ${item.from}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {item.date}
              {item.returnDate && ` to ${item.returnDate}`}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {item.passengers} pax
            </span>
            <span className="flex items-center gap-1">
              <Car className="size-3.5 text-gold" />
              {vehicleName}
            </span>
          </div>

          {item.notes && (
            <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg p-2 line-clamp-1 italic">
              "{item.notes}"
            </p>
          )}
        </div>

        {/* Right: Status selector and actions */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 border-t border-border/60 pt-3 lg:border-t-0 lg:pt-0">
          {/* Estimated fare */}
          {item.estimate && (
            <div className="text-left lg:text-right mr-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Estimated Fare
              </span>
              <span className="text-sm font-bold text-foreground">
                {inr(item.estimate.low)} – {inr(item.estimate.high)}
              </span>
            </div>
          )}

          {/* Status Dropdown */}
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value as BookingStatus)}
            className={cn(
              "h-9 rounded-xl border px-3 text-xs font-bold outline-none cursor-pointer",
              item.status === "New" &&
                "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              item.status === "Contacted" &&
                "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
              item.status === "Confirmed" &&
                "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400",
              item.status === "Completed" &&
                "border-slate-500/40 bg-slate-500/10 text-slate-600 dark:text-slate-400",
              item.status === "Cancelled" &&
                "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
            )}
          >
            <option value="New">● New</option>
            <option value="Contacted">● Contacted</option>
            <option value="Confirmed">● Confirmed</option>
            <option value="Completed">● Completed</option>
            <option value="Cancelled">● Cancelled</option>
          </select>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30"
              title="Open WhatsApp chat with customer"
            >
              <a href={whatsappUrl(waMessage)} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-3.5 text-emerald-500" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              title="View complete trip details"
            >
              <Eye className="size-3.5" />
              <span className="hidden sm:inline">Details</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Delete reservation"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   DETAIL INSPECTION MODAL
   ========================================================================= */
function ReservationModal({
  reservation,
  onClose,
  onStatusChange,
  onSaveNotes,
}: {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
}) {
  const [internalNotes, setInternalNotes] = useState(reservation.internalNotes || "");
  const [savedMessage, setSavedMessage] = useState(false);

  // Email Delivery & Logs State
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingEmailLogs, setLoadingEmailLogs] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resendStatusMsg, setResendStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingEmailLogs(true);
    getEmailLogs(reservation.id).then((res) => {
      if (active) {
        if (res.success && res.data) {
          setEmailLogs(res.data);
        }
        setLoadingEmailLogs(false);
      }
    });
    return () => {
      active = false;
    };
  }, [reservation.id]);

  const handleResend = async (type: "customer_confirmation" | "admin_notification" | "both") => {
    setIsResending(true);
    setResendStatusMsg(null);
    const res = await resendBookingEmail(reservation.id, type);
    if (res.success) {
      setResendStatusMsg({ type: "success", text: "Email dispatch re-triggered successfully!" });
      const updated = await getEmailLogs(reservation.id);
      if (updated.success && updated.data) {
        setEmailLogs(updated.data);
      }
    } else {
      setResendStatusMsg({ type: "error", text: res.error || "Failed to trigger email resend." });
    }
    setIsResending(false);
  };

  const vehicleObj = reservation.vehicle
    ? vehicles.find((v) => v.slug === reservation.vehicle)
    : null;
  const vehicleName = vehicleObj ? vehicleObj.name : `${reservation.category} vehicle`;

  const waMessage = `Hi ${reservation.name}! Rashe Holidays here regarding your enquiry ${reservation.id} (${reservation.from} → ${reservation.to}). We have reviewed your details and would love to confirm your booking.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
            {reservation.id}
          </span>
          <span className="text-xs text-muted-foreground">
            Received {new Date(reservation.createdAt).toLocaleString("en-IN")}
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-bold text-foreground">{reservation.name}</h2>

        {/* Customer contact cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Phone Number
            </span>
            <div className="mt-1 flex items-center justify-between">
              <a
                href={`tel:${reservation.phone}`}
                className="text-sm font-semibold text-gold hover:underline"
              >
                {reservation.phone}
              </a>
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${reservation.phone}`}>Call</a>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Email Address
            </span>
            <span className="text-sm font-semibold text-foreground block truncate mt-1">
              {reservation.email || "Not provided"}
            </span>
          </div>
        </div>

        {/* Trip details */}
        <div className="mt-6 rounded-2xl border border-border bg-secondary/20 p-5 space-y-3 text-sm">
          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Trip Type</span>
            <span className="font-semibold text-foreground">
              {reservation.tripType === "round-trip" ? "Round Trip" : "One Way"}
            </span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Route</span>
            <span className="font-semibold text-foreground text-right">
              {reservation.from} → {reservation.to}
              {reservation.tripType === "round-trip" ? ` → ${reservation.from}` : ""}
            </span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Travel Date</span>
            <span className="font-semibold text-foreground">
              {reservation.date}
              {reservation.returnDate
                ? ` to ${reservation.returnDate} (${reservation.days} days)`
                : ""}
            </span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Passengers</span>
            <span className="font-semibold text-foreground">
              {reservation.passengers} passengers
            </span>
          </div>

          <div className="flex justify-between border-b border-border/60 pb-2">
            <span className="text-muted-foreground">Vehicle Requested</span>
            <span className="font-semibold text-foreground">{vehicleName}</span>
          </div>

          {reservation.estimate && (
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Estimated Fare</span>
              <span className="font-bold text-gold">
                {inr(reservation.estimate.low)} – {inr(reservation.estimate.high)} (≈{" "}
                {reservation.estimate.km} km)
              </span>
            </div>
          )}
        </div>

        {/* Customer Notes */}
        {reservation.notes && (
          <div className="mt-5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Customer Special Requirements / Notes:
            </span>
            <div className="rounded-xl border border-border bg-card p-3.5 text-sm text-foreground">
              {reservation.notes}
            </div>
          </div>
        )}

        {/* Email Delivery & Resend Section */}
        <div className="mt-5 rounded-2xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-gold" />
              Email Notifications (Resend)
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isResending}
              onClick={() => handleResend("both")}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={cn("size-3.5", isResending && "animate-spin")} />
              {isResending ? "Resending..." : "Resend Emails"}
            </Button>
          </div>

          {resendStatusMsg && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                resendStatusMsg.type === "success" ? "text-emerald-500" : "text-destructive",
              )}
            >
              {resendStatusMsg.text}
            </p>
          )}

          <div className="mt-3 space-y-2">
            {loadingEmailLogs ? (
              <p className="text-xs text-muted-foreground italic">
                Checking email delivery logs...
              </p>
            ) : emailLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No email dispatch logs recorded yet. (Emails trigger automatically on live
                bookings).
              </p>
            ) : (
              <div className="space-y-1.5">
                {emailLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card p-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          log.status === "sent"
                            ? "bg-emerald-500"
                            : log.status === "failed"
                              ? "bg-destructive"
                              : "bg-amber-500",
                        )}
                      />
                      <span className="font-semibold text-foreground capitalize">
                        {log.emailType.replace("_", " ")}
                      </span>
                      <span className="text-muted-foreground truncate max-w-[180px]">
                        ({log.recipient})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.status === "sent" ? (
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500">
                          Sent
                        </span>
                      ) : (
                        <span
                          className="rounded bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive cursor-help"
                          title={log.errorMessage || "Delivery failed"}
                        >
                          Failed
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Owner Internal Remarks */}
        <div className="mt-5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
            Internal Dispatch Remarks (Owner Only):
          </span>
          <textarea
            value={internalNotes}
            onChange={(e) => {
              setInternalNotes(e.target.value);
              setSavedMessage(false);
            }}
            placeholder="Assign driver name, vehicle number, advance payment details, or discussion notes…"
            rows={3}
            className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <div className="mt-2 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onSaveNotes(reservation.id, internalNotes);
                setSavedMessage(true);
                setTimeout(() => setSavedMessage(false), 2500);
              }}
            >
              Save Internal Remarks
            </Button>
            {savedMessage && (
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                <CheckCircle className="size-3.5" /> Saved!
              </span>
            )}
          </div>
        </div>

        {/* Action footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Status:
            </span>
            <select
              value={reservation.status}
              onChange={(e) => onStatusChange(reservation.id, e.target.value as BookingStatus)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs font-bold outline-none focus:border-gold"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="gold" size="sm">
              <a href={whatsappUrl(waMessage)} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   CHANGE PASSCODE MODAL
   ========================================================================= */
function PasscodeModal({ onClose }: { onClose: () => void }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPasscode(currentPass)) {
      setError("Current passcode is incorrect.");
      return;
    }
    if (newPass.length < 6) {
      setError("New passcode must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("New passcode and confirmation do not match.");
      return;
    }

    setOwnerPasscode(newPass);
    setError("");
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-gold/10 text-gold">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Change Passcode</h3>
            <p className="text-xs text-muted-foreground">Update your owner access passcode</p>
          </div>
        </div>

        {success ? (
          <div className="my-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
            <ShieldCheck className="mx-auto size-8 text-emerald-500" />
            <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Passcode updated successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">
                Current Passcode
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter current passcode"
                className="h-10 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">
                New Passcode
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="At least 6 characters"
                className="h-10 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">
                Confirm New Passcode
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new passcode"
                className="h-10 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-gold"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3.5" />
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Save New Passcode
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
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
  exportBookingsCsv,
  type BookingStatus,
  type Reservation,
} from "@/lib/bookings";
import { getEmailLogs, resendBookingEmail } from "@/lib/api/bookings";
import type { EmailLog } from "@/types/booking";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  AUTHORIZED_ADMIN_EMAIL,
  isAuthorizedAdminEmail,
} from "@/lib/admin-auth";
import { inr, whatsappUrl, vehicles } from "@/data/site";
import { cn } from "@/lib/utils";
import headerLogo from "@/assets/header-logo.png";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function AdminErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-card p-6 text-center shadow-lg">
        <AlertCircle className="mx-auto size-10 text-destructive mb-3" />
        <h2 className="text-lg font-bold text-foreground">Admin Portal Notice</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {error.message || "An unexpected error occurred while loading reservations."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              reset();
            }}
          >
            Retry Loading
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              try {
                localStorage.removeItem("nilgiri_rides_reservations");
              } catch (_) {}
              window.location.reload();
            }}
          >
            Reset Local Cache & Reload
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner Admin Portal — Rashe Holidays" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRouteComponent,
  errorComponent: AdminErrorComponent,
});

function AdminRouteComponent() {
  const [adminUser, setAdminUser] = useState<{ email: string; id: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.warn("Session check notice:", error.message);
        }

        if (session?.user) {
          const email = (session.user.email || "").toLowerCase().trim();
          if (isAuthorizedAdminEmail(email)) {
            if (mounted) {
              setAdminUser({ email: session.user.email || "", id: session.user.id });
              setAuthError("");
            }
          } else {
            // Unauthorized account! Sign out immediately.
            await supabase.auth.signOut();
            if (mounted) {
              setAdminUser(null);
              setAuthError(
                `Access Denied: The account "${session.user.email}" is not authorized. Only ${AUTHORIZED_ADMIN_EMAIL} can access the Owner Portal.`,
              );
            }
          }
        } else {
          if (mounted) setAdminUser(null);
        }
      } catch (err: any) {
        console.error("Auth check failed:", err);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const email = (session.user.email || "").toLowerCase().trim();
          if (isAuthorizedAdminEmail(email)) {
            setAdminUser({ email: session.user.email || "", id: session.user.id });
            setAuthError("");
          } else {
            await supabase.auth.signOut();
            setAdminUser(null);
            setAuthError(
              `Access Denied: The account "${session.user.email}" is not authorized. Only ${AUTHORIZED_ADMIN_EMAIL} can access the Owner Portal.`,
            );
          }
        }
      } else if (event === "SIGNED_OUT") {
        setAdminUser(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setAdminUser(null);
      setAuthError("");
    }
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

  if (!adminUser) {
    return <AdminLogin initialError={authError} />;
  }

  return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
}

/* =========================================================================
   LOGIN SCREEN (Google OAuth Only)
   ========================================================================= */
function AdminLogin({ initialError }: { initialError?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError || "");

  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const redirectUrl = `${window.location.origin}/admin`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to start Google sign in. Please verify OAuth setup.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/30 shadow-sm">
            <Lock className="size-8" />
          </div>

          <div className="mt-6 text-center">
            <span className="eyebrow">Owner Portal Access</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Rashe Holidays
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your verified Google account to view and manage live customer reservations.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-3 animate-fade-in">
                <ShieldAlert className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Access Denied</p>
                  <p className="mt-1 leading-relaxed text-destructive/90">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              size="lg"
              className="w-full h-12 gap-3 text-sm font-semibold border-border bg-background hover:bg-secondary transition-all shadow-sm"
            >
              {loading ? (
                <RefreshCw className="size-4 animate-spin text-gold" />
              ) : (
                <GoogleIcon className="size-5 shrink-0" />
              )}
              <span>{loading ? "Connecting to Google…" : "Continue with Google"}</span>
            </Button>

            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <ShieldCheck className="size-4 text-gold shrink-0" />
                <span>Authorized Account Only</span>
              </div>
              <p className="mt-1.5 leading-relaxed">
                Access is restricted strictly to{" "}
                <span className="font-semibold text-gold underline underline-offset-2">
                  {AUTHORIZED_ADMIN_EMAIL}
                </span>
                . All other accounts are automatically blocked.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
function AdminDashboard({
  adminUser,
  onLogout,
}: {
  adminUser: { email?: string; id?: string } | null;
  onLogout: () => void;
}) {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tripTypeFilter, setTripTypeFilter] = useState<string>("all");
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
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


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity">
              <img
                src={headerLogo}
                alt="Rashe Holidays"
                className="h-9 sm:h-10 w-auto object-contain"
              />
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider hidden sm:inline-block">
                Admin
              </span>
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

            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span className="font-mono">{adminUser?.email || AUTHORIZED_ADMIN_EMAIL}</span>
            </div>

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
              <option value="4-seater">4-Seater Sedan</option>
              <option value="7-seater">7-Seater (Crysta / HyCross)</option>
              <option value="9-seater">9-Seater Tavera</option>
              <option value="12-seater">12-Seater Traveller</option>
              <option value="16-seater">16-Seater Urbania</option>
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

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between px-1">
          <p className="text-xs font-medium text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
            {bookings.length} reservations
          </p>
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
            {item.waitingDays && item.waitingDays > 0 ? (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold border border-gold/30">
                {item.waitingDays} waiting day{item.waitingDays > 1 ? "s" : ""}
              </span>
            ) : null}
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
    const res = await resendBookingEmail(reservation.id, type, {
      customerName: reservation.name,
      phoneNumber: reservation.phone,
      emailAddress: reservation.email ?? null,
      tripType: reservation.tripType,
      vehicleCategory: reservation.category,
      preferredVehicle: reservation.vehicle ?? null,
      passengers: reservation.passengers,
      pickupLocation: reservation.from,
      destination: reservation.to,
      departureDate: reservation.date,
      returnDate: reservation.returnDate ?? null,
      numberOfDays: reservation.days,
      waitingDays: reservation.waitingDays ?? 0,
      specialRequirements: reservation.notes ?? null,
      createdAt: reservation.createdAt,
    });
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

          {reservation.waitingDays && reservation.waitingDays > 0 ? (
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Waiting Days (Parked)</span>
              <span className="font-semibold text-gold">
                {reservation.waitingDays} day{reservation.waitingDays > 1 ? "s" : ""} (idle / standby)
              </span>
            </div>
          ) : null}

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


import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import {
  LayoutDashboard,
  History,
  Link as LinkIcon,
  Settings,
  Plus,
  LogOut,
  Search,
  Bell,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  PhoneCall,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  User
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/payment/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setStats(response.data.stats);
          setTransactions(response.data.recentTransactions || []);
          setCallbacks(response.data.recentCallbacks || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-violet-950 border-t-violet-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-violet-400 text-lg">payments</span>
          </div>
        </div>
        <p className="mt-4 text-slate-400 text-sm font-semibold tracking-wide animate-pulse">
          Loading dashboard terminal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-900/40 border-r border-slate-900 flex flex-col py-8 z-50 backdrop-blur-xl">
        <div className="px-6 mb-8 mt-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-950 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/25">
            <span className="material-symbols-outlined text-white text-xl">
              payments
            </span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              UPI Collection
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4">
          <a
            className="flex items-center gap-3 px-4 py-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl font-bold transition-all"
            href="#"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-semibold">Dashboard</span>
          </a>
          <button
            onClick={() => navigate("/payments")}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all rounded-xl w-full text-left cursor-pointer"
          >
            <History className="w-5 h-5" />
            <span className="text-sm font-semibold">Payment History</span>
          </button>
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all rounded-xl w-full text-left cursor-pointer"
          >
            <LinkIcon className="w-5 h-5" />
            <span className="text-sm font-semibold">Generate Link</span>
          </button>
          <a
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all rounded-xl"
            href="#"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-semibold">Settings</span>
          </a>
        </nav>

        <div className="mt-auto px-4 border-t border-slate-900 pt-4">
          <button
            onClick={() => navigate("/generate")}
            className="w-full mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            Generate Link
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/10 transition-all rounded-xl mb-2 w-full text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 h-16 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md flex justify-between items-center px-8 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                className="w-full bg-slate-900/40 border border-slate-900 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5 text-slate-200 transition-all placeholder-slate-500"
                placeholder="Search transactions, references..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 rounded-full transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-900 pl-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-200">User</p>

              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Title */}
          <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Collection Dashboard
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Monitor and route your real-time enterprise UPI collections.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-900 px-4 py-2 rounded-xl text-slate-300 backdrop-blur-md">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </section>

          {/* Live Stats Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Collected */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collected</span>
                <div className="p-2.5 bg-violet-600/10 rounded-xl text-violet-400 border border-violet-500/10">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-black text-white">
                  {stats ? `₹${stats.totalCollected.toLocaleString("en-IN")}` : "₹0"}
                </h3>
                {stats && stats.monthlyGrowth > 0 ? (
                  <div className="mt-1 flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{stats.monthlyGrowth}% growth rate</span>
                  </div>
                ) : (
                  <div className="mt-1 text-slate-500 font-semibold text-[10px]">No collection activity</div>
                )}
              </div>
            </div>

            {/* Pending Count */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Links</span>
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/10">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-black text-white">
                  {stats ? stats.pendingCount : 0}
                </h3>
                {stats && stats.urgentCount > 0 ? (
                  <div className="mt-1 flex items-center gap-1 text-red-400 font-bold text-[10px] bg-red-950/20 px-2 py-0.5 rounded w-fit border border-red-500/10">
                    <AlertCircle className="w-3 h-3" />
                    <span>{stats.urgentCount} urgent (&gt;24h)</span>
                  </div>
                ) : (
                  <div className="mt-1 text-slate-500 font-semibold text-[10px]">No urgent pending links</div>
                )}
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Success Rate</span>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/10">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-black text-white">
                  {stats ? `${stats.successRate.toFixed(1)}%` : "100%"}
                </h3>
                {stats && (
                  <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-900">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Callback Requests */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Callbacks</span>
                <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/10">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <h3 className="text-2xl font-black text-white">
                  {stats ? stats.pendingCallbacks : 0}
                </h3>
                {stats && stats.pendingCallbacks > 0 ? (
                  <div className="mt-1 flex items-center gap-1 text-rose-400 font-bold text-[10px] bg-rose-950/20 px-2 py-0.5 rounded w-fit border border-rose-500/10">
                    <span>{stats.pendingCallbacks} request queue</span>
                  </div>
                ) : (
                  <div className="mt-1 text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    All clear
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Quick Actions Card Tiles */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Action 1: Create Link */}
              <div
                onClick={() => navigate("/generate")}
                className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950/80 to-[#10083e] p-8 rounded-2xl border border-slate-800/80 cursor-pointer hover:translate-y-[-2px] hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/20 transition-all group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-105 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Generate Payment Link</h4>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Issue secure, on-demand UPI checkout requests for invoice settlement.
                    </p>
                  </div>
                  <button className="mt-8 bg-white hover:bg-slate-100 text-slate-950 font-bold py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 w-fit text-xs cursor-pointer">
                    <span>Create Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action 2: View History */}
              <div
                onClick={() => navigate("/payments")}
                className="relative overflow-hidden bg-slate-900/20 p-8 rounded-2xl border border-slate-900 cursor-pointer hover:translate-y-[-2px] hover:border-slate-800 hover:shadow-2xl hover:shadow-slate-950/60 transition-all group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-slate-300 group-hover:scale-105 transition-transform">
                      <History className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-200 mb-2">Payment Archive</h4>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Audit previous transaction histories, settlements, and compliance reports.
                    </p>
                  </div>
                  <button className="mt-8 border border-slate-850 hover:bg-slate-900 text-slate-300 font-bold py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 w-fit text-xs cursor-pointer">
                    <span>Audit Registry</span>
                    <History className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Table */}
          <section className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/10">
              <h3 className="text-base font-bold text-white tracking-tight">Recent Collections</h3>
              <button className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
                Export Registry (CSV)
              </button>
            </div>
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-600 block mx-auto mb-3">
                    inbox
                  </span>
                  <h5 className="text-slate-300 font-bold text-sm">No transaction records found</h5>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                    Payments will register here once checkout links are active and paid.
                  </p>
                  <button
                    onClick={() => navigate("/generate")}
                    className="mt-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Generate First Link
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/40 border-b border-slate-900">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Payee Reference / Note</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Stamp Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Routing Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-600/10 border border-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs">
                              {transaction.customerName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-slate-200">{transaction.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          ₹{transaction.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(transaction.date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${transaction.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : transaction.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${transaction.status === "Success"
                              ? "bg-emerald-400"
                              : transaction.status === "Pending"
                                ? "bg-amber-400"
                                : "bg-red-400"
                              }`}></span>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {transactions.length > 0 && (
              <div className="p-4 border-t border-slate-900 text-center bg-slate-900/10">
                <button
                  onClick={() => navigate("/payments")}
                  className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  View All Activity
                </button>
              </div>
            )}
          </section>

          {/* Callbacks Section */}
          <section className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/10">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Active Inquiries</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              {callbacks.length === 0 ? (
                <div className="p-10 text-center">
                  <HelpCircle className="w-10 h-10 text-slate-700 block mx-auto mb-2" />
                  <h5 className="text-slate-400 font-bold text-xs">No active inquiry tickets</h5>
                  <p className="text-slate-500 text-[10px] mt-1">
                    Customer assistance queries route here automatically.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/40 border-b border-slate-900">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sender</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Contact Number</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Queue Time</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {callbacks.slice(0, 5).map((callback) => (
                      <tr key={callback.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-200">{callback.customerName}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-300">
                          {callback.phoneNumber}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(callback.requestTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {callback.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-900 py-6 px-8 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          
          <div className="flex gap-4">
            
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
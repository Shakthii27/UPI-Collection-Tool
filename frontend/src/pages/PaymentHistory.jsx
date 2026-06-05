import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  History,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  Search
} from "lucide-react";

function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        "/payment/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (Array.isArray(res.data)) {
        setPayments(res.data);
      } else if (res.data.payments) {
        setPayments(res.data.payments);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter payments based on search query (by reference_id or note)
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    const reference = (payment.reference_id || "").toLowerCase();
    const note = (payment.note || "").toLowerCase();
    const status = (payment.status || "").toLowerCase();
    return reference.includes(query) || note.includes(query) || status.includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-violet-950 border-t-violet-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <History className="w-5 h-5 text-violet-400" />
          </div>
        </div>
        <p className="mt-4 text-slate-400 text-sm font-semibold tracking-wide animate-pulse">
          Retrieving payment registry...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-12 relative overflow-hidden flex flex-col items-center justify-start">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-5xl z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center gap-2 text-slate-400 hover:text-white font-semibold mb-6 transition-colors cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-violet-600/10 border border-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Payment History
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Audit and track UPI collections.
                </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-xs group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5 text-slate-200 transition-all placeholder-slate-500"
              placeholder="Search reference or note..."
              type="text"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            {filteredPayments.length === 0 ? (
              <div className="p-16 text-center">
                <Layers className="w-12 h-12 text-slate-700 block mx-auto mb-4" />
                <h4 className="text-slate-350 font-bold text-base">No payment history found</h4>
                <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                  {searchQuery ? "No records match your search criteria." : "Once checkout links are settled, the ledger will populate."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/40 border-b border-slate-900">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Payee Reference / Note</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-900/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-violet-600/10 border border-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs">
                            {payment.note ? payment.note.slice(0, 2).toUpperCase() : "UP"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200">{payment.note || "UPI Payee"}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{payment.reference_id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-black text-white">
                          <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-400" />
                          <span>{payment.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {payment.createdAt ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-650">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${payment.status.toLowerCase() === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : payment.status.toLowerCase() === "pending"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${payment.status.toLowerCase() === "success"
                            ? "bg-emerald-400"
                            : payment.status.toLowerCase() === "pending"
                              ? "bg-amber-400"
                              : "bg-red-400"
                            }`}></span>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {filteredPayments.length > 0 && (
            <div className="p-4 bg-slate-900/10 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
              <p>Showing {filteredPayments.length} transactions</p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;
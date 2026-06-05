import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  ArrowLeft, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  IndianRupee, 
  FileText, 
  Info,
  Sparkles
} from "lucide-react";

function GenerateLink() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [copiedField, setCopiedField] = useState(null); // 'ref' or 'link'

  const generatePayment = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/payment/generate-link",
        {
          amount,
          note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess({
        referenceId: res.data.payment.reference_id,
        link: res.data.payment.payment_link || res.data.payment.link || res.data.link
      });
      setAmount("");
      setNote("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to generate payment link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-2xl z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 text-slate-400 hover:text-white font-semibold mb-6 transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-violet-600/10 border border-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
              <LinkIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Generate Payment Link
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Create instant UPI request references for customers.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-200">Error</h4>
              <p className="text-red-400/90 text-xs mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-emerald-500/10">
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white">Payment Link Generated</h4>
                  <p className="text-xs text-slate-400 mt-0.5">The checkout link is active and ready for receipt.</p>
                </div>
                
                <div className="space-y-2.5 text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 font-semibold">Reference ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {success.referenceId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(success.referenceId, "ref")}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer relative"
                        title="Copy Reference"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedField === "ref" && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded border border-slate-800 whitespace-nowrap shadow-xl">
                            Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {success.link && (
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-900">
                      <span className="text-xs text-slate-400 font-semibold">Checkout URL:</span>
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="font-mono text-xs text-violet-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate">
                          {success.link}
                        </span>
                        <button
                          onClick={() => copyToClipboard(success.link, "link")}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer relative"
                          title="Copy Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedField === "link" && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded border border-slate-800 whitespace-nowrap shadow-xl">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-8 backdrop-blur-xl">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Amount (INR)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Note / Description (Optional)
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-4 pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Invoice #2024-89, Customer Account balance"
                  rows="3"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={generatePayment}
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/25 active:scale-[0.98] cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  <span>Generating secure link...</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" />
                  <span>Generate Payment Link</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Amount Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-900">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Presets</p>
            <div className="flex gap-2 flex-wrap">
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="px-4 py-2 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 border border-slate-900 rounded-xl text-slate-300 hover:text-white font-bold transition-all text-xs cursor-pointer"
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-slate-900/10 border border-slate-900 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-violet-400 mt-0.5" />
            <div>
              <p className="text-sm text-slate-200 font-bold mb-1">
                How link billing works
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                UPI Collect generates a custom checkout routing URI hosted securely. The payee opens this checkout, selects their preferred UPI wallet app (GPay, PhonePe, Paytm, etc.), and authorizes the funds. Settlements are credited in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateLink;
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface AppData {
  name: string;
  message: string;
}

function App() {
  const [data, setData] = useState<AppData>({ name: "", message: "" });
  const [form, setForm] = useState<AppData>({ name: "", message: "" });
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch current data on mount
  useEffect(() => {
    fetch(`${API_URL}/data`)
      .then((res) => res.json())
      .then((d: AppData) => {
        setData(d);
        setForm(d);
      })
      .catch(() => setStatus("❌ Failed to connect to backend"))
      .finally(() => setLoading(false));
  }, []);

  // PATCH data
  const handleSave = async () => {
    setStatus("Saving...");
    try {
      const res = await fetch(`${API_URL}/data`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated: AppData = await res.json();
      setData(updated);
      setStatus("✅ Saved!");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("❌ Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">📦 K8s Study App v2</h1>
          <p className="text-sm text-gray-400">
            Backend: <code className="text-blue-400">{API_URL}</code>
          </p>
        </div>

        {/* Current Data Display */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Current Data</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Message</span>
              <span className="font-medium">{data.message}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Update</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Message</label>
              <input
                type="text"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition cursor-pointer">
            Save
          </button>

          {status && <p className="text-center text-sm text-gray-400">{status}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;

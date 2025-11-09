import { useState, useEffect } from "react";
import { Moon, Sun, Upload, FileText, Download, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  // ✅ Apply initial theme on first load
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Toggle Light/Dark Mode
  const toggleDark = () => {
    setDark(!dark);

    if (!dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ✅ Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
      setResult(null);
    } else {
      setError("Please upload a valid PDF file");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  // ✅ Parse PDF
  const handleParse = async () => {
    if (!file) {
      setError("Please upload a PDF file first");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/parse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");
      
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to connect to backend server. Please ensure it's running on localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear file
  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  // ✅ Download JSON
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement_${result.bank}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        
        {/* ✅ Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Statement Parser
              </h1>
            </div>

            {/* ✅ Dark Mode Button */}
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
            </button>
          </div>
        </header>

        {/* ✅ MAIN CONTENT */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          
          {/* ✅ Upload Section */}
          <div className="mb-8">
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              } ${file ? "shadow-lg" : "shadow"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                id="uploadInput"
                onChange={handleFileSelect}
              />

              {/* ✅ If NO file */}
              {!file ? (
                <label
                  htmlFor="uploadInput"
                  className="flex flex-col items-center justify-center py-16 px-6 cursor-pointer"
                >
                  <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Upload className="text-white" size={32} />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Upload Credit Card Statement
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to browse or drag and drop your PDF here
                  </p>
                </label>
              ) : (
                <div className="py-12 px-6">
                  <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearFile}
                      className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Remove file"
                    >
                      <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Error Message */}
            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* ✅ Parse Button */}
            {file && !result && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleParse}
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing PDF...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileText size={20} />
                      Parse Statement
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ✅ Results */}
          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                
                {/* ✅ Success Banner */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={28} />
                    <div>
                      <h2 className="text-2xl font-bold">Parsing Complete</h2>
                      <p className="text-green-100 text-sm mt-1">Your statement has been successfully processed</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* ✅ Bank Info */}
                  <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bank Name</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.bank}</p>
                  </div>

                  {/* ✅ Extracted Fields */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Extracted Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.fields).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            {value || <span className="text-gray-400 dark:text-gray-500 italic">Not found</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ✅ Download JSON */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={downloadJSON}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center gap-2"
                    >
                      <Download size={20} />
                      Download JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ✅ Footer */}
        <footer className="mt-16 pb-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Securely parse your credit card statements • All processing happens locally</p>
        </footer>
      </div>
    </div>
  );
}

import React from 'react';
import { useAppStore } from './store';
import { MessageSquare, Database, Send, AlertCircle, Trash2 } from 'lucide-react';
import ExcelUploader from './components/ExcelUploader';
import EditableTable from './components/EditableTable';
import TemplateEditor from './components/TemplateEditor';
import MessageCardGrid from './components/MessageCardGrid';

export default function App() {
  const { activeTab = 'data', setActiveTab, loadSampleData, datasets = [], activeDatasetId, setActiveDatasetId, deleteDataset } = useAppStore();
  const activeDataset = datasets.find(d => d.id === activeDatasetId);
  const senderProfile = "+91 6353303572";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 items-center py-4 sm:py-0 gap-4">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md shadow-emerald-200">
                <MessageSquare size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Campaign Hub</h1>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
              <button 
                onClick={() => setActiveTab('data')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'data' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-2"><Database size={16} /> Data Hub</div>
              </button>
              <button 
                onClick={() => setActiveTab('dispatcher')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'dispatcher' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-2"><Send size={16} /> Dispatcher</div>
              </button>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-4">
              {datasets.length > 0 && (
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <select 
                    value={activeDatasetId || ''}
                    onChange={(e) => setActiveDatasetId(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-700 outline-none pl-2 pr-1 max-w-[150px] truncate"
                  >
                    {datasets.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      if (window.confirm("Delete this dataset?")) {
                        deleteDataset(activeDatasetId);
                      }
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Dataset"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <button 
                onClick={loadSampleData}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Load Mock Data
              </button>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 hidden sm:inline-flex">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sender: {senderProfile}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'data' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ExcelUploader />
            <EditableTable />
          </div>
        ) : activeDataset && activeDataset.data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-5"><TemplateEditor /></div>
            <div className="lg:col-span-7"><MessageCardGrid /></div>
          </div>
        ) : (
           <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center mt-12">
             <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
             <h3 className="text-xl font-bold text-slate-700">No Audience Data Found</h3>
             <p className="text-slate-500 mt-2">Please go to the Data Hub to upload an Excel file or load the mock dataset first.</p>
           </div>
        )}
      </main>
    </div>
  );
}

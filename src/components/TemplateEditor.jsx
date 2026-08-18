import React, { useRef } from 'react';
import { useAppStore } from '../store';
import { FileText, Save, Plus, Trash2 } from 'lucide-react';

export default function TemplateEditor() {
  const { datasets = [], activeDatasetId, templates = [], activeTemplateId, saveTemplate, setActiveTemplateId, deleteTemplate } = useAppStore();
  const activeDataset = datasets.find(d => d.id === activeDatasetId) || { data: [], columns: [] };
  const { columns = [], data = [] } = activeDataset;
  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0] || { text: '' };
  const textareaRef = useRef(null);

  const handleAddTemplate = () => {
    const newId = Date.now();
    saveTemplate(newId, `Template ${templates.length + 1}`, 'Type your message here...');
    setActiveTemplateId(newId);
  };

  const handleInject = (col) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBefore = activeTemplate.text.substring(0, start);
    const textAfter = activeTemplate.text.substring(end, activeTemplate.text.length);
    const injection = `{{${col}}}`;
    
    saveTemplate(activeTemplate.id, activeTemplate.name, textBefore + injection + textAfter);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + injection.length, start + injection.length);
    }, 0);
  };

  const resolvePreview = () => {
    if (data.length === 0) return "No data available to preview.";
    let resolved = activeTemplate.text;
    columns.forEach(col => {
      resolved = resolved.replace(new RegExp(`{{${col}}}`, 'gi'), data[0][col] || '');
    });
    return resolved;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[650px] overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <FileText size={20} className="text-emerald-600" /> Template Studio
        </h2>
        <button onClick={handleAddTemplate} className="text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
          <Plus size={14} /> New Template
        </button>
      </div>

      {/* Template Tabs */}
      <div className="flex overflow-x-auto gap-2 px-5 pt-3 pb-2 border-b border-slate-100 bg-slate-50 shrink-0 custom-scrollbar">
        {templates.map(t => (
          <div 
            key={t.id}
            onClick={() => setActiveTemplateId(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer font-semibold text-sm transition-colors border-b-2 ${activeTemplateId === t.id ? 'border-emerald-500 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <input 
              value={t.name}
              onChange={(e) => saveTemplate(t.id, e.target.value, t.text)}
              className="bg-transparent outline-none w-28 focus:w-40 transition-all text-inherit cursor-pointer focus:cursor-text"
              onClick={() => setActiveTemplateId(t.id)}
            />
            {templates.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); deleteTemplate(t.id); }} 
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap gap-2">
          {columns.map(col => (
            <button 
              key={col}
              onClick={() => handleInject(col)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              +{col}
            </button>
          ))}
        </div>
        
        <textarea 
          ref={textareaRef}
          value={activeTemplate.text}
          onChange={(e) => saveTemplate(activeTemplate.id, activeTemplate.name, e.target.value)}
          className="flex-1 min-h-[150px] shrink-0 w-full border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 bg-slate-50"
          placeholder="Type your message..."
        />

        {/* Live Preview Box */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 shrink-0">
          <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Live Preview (Row 1)</h3>
          <div className="text-sm text-indigo-900 whitespace-pre-wrap">{resolvePreview()}</div>
        </div>
      </div>
    </div>
  );
}

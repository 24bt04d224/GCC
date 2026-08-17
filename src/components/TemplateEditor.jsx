import React, { useRef } from 'react';
import { useAppStore } from '../store';
import { FileText, Save, Plus } from 'lucide-react';

export default function TemplateEditor() {
  const { templates, activeTemplateId, saveTemplate, columns, data } = useAppStore();
  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];
  const textareaRef = useRef(null);

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
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <FileText size={20} className="text-emerald-600" /> Template Studio
        </h2>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{activeTemplate.name}</span>
      </div>
      
      <div className="p-5 flex-1 flex flex-col gap-4">
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
          className="flex-1 w-full border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 bg-slate-50"
          placeholder="Type your message..."
        />

        {/* Live Preview Box */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Live Preview (Row 1)</h3>
          <div className="text-sm text-indigo-900 whitespace-pre-wrap">{resolvePreview()}</div>
        </div>
      </div>
    </div>
  );
}

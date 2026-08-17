import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Send, CheckCircle2, Clock, Mail } from 'lucide-react';

export default function MessageCardGrid() {
  const { datasets, activeDatasetId, templates, activeTemplateId, markAsSent, deleteRow } = useAppStore();
  const activeDataset = datasets.find(d => d.id === activeDatasetId) || { data: [], columns: [], columnMapping: { phone: '', name: '' }, dispatchStatuses: {} };
  const { data, columns, columnMapping, dispatchStatuses } = activeDataset;
  const [filter, setFilter] = useState('All');
  const [exclusionToggles, setExclusionToggles] = useState(['Touch 1 Channel']); // Default to Touch 1
  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];

  const checkIsContacted = (row) => {
    for (const toggle of exclusionToggles) {
      const colName = toggle.toLowerCase().trim();
      const col = columns.find(c => String(c).toLowerCase().trim() === colName);
      const val = col ? String(row[col] || '').trim().toLowerCase() : '';
      if (val !== '' && val !== 'empty' && val !== 'null') {
        return true;
      }
    }
    return false;
  };

  const resolveTemplate = (row) => {
    let resolved = activeTemplate.text;

    // Guess Title if missing
    const nameCol = columnMapping.name;
    const nameStr = nameCol ? String(row[nameCol] || '') : '';
    let guessedTitle = "Sir/Ma'am";

    if (nameStr) {
      const firstName = nameStr.split(' ')[0].toLowerCase();
      // Basic heuristic: names ending in a, i, e, y are often female
      if (/[aiey]$/.test(firstName)) {
        guessedTitle = "Ma'am";
      } else {
        guessedTitle = "Sir";
      }
    }

    resolved = resolved.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
      const cleanPlaceholder = String(p1).replace(/\s+/g, '').toLowerCase();
      
      if (cleanPlaceholder === 'title') {
        const exactTitleCol = columns.find(c => String(c).replace(/\s+/g, '').toLowerCase() === 'title');
        return (exactTitleCol ? row[exactTitleCol] : '') || guessedTitle;
      }

      const matchedCol = columns.find(c => String(c).replace(/\s+/g, '').toLowerCase() === cleanPlaceholder);
      
      if (matchedCol !== undefined) {
        return row[matchedCol] || '';
      }
      return match;
    });

    return resolved;
  };

  const handleSend = (index, row, resolvedMessage) => {
    const phoneCol = columnMapping.phone;
    if (!phoneCol || !row[phoneCol]) {
      alert("No valid phone number found! Check your column mapping.");
      return;
    }

    let phone = String(row[phoneCol]).replace(/[- ()]/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(resolvedMessage)}`;
    window.open(url, '_blank');
    markAsSent(index);
  };

  const handleSendEmail = (index, row, resolvedMessage) => {
    const emailCol = columnMapping.email;
    if (!emailCol || !row[emailCol]) {
      alert("No valid email address found! Check your column mapping.");
      return;
    }

    const email = row[emailCol];
    const subject = encodeURIComponent("Campaign Update");
    const body = encodeURIComponent(resolvedMessage);

    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(url, '_self'); // mailto usually works better with _self or just changing window.location
    markAsSent(index);
  };

  // Pre-calculate duplicates
  const seenPhones = new Set();
  const duplicateIndices = new Set();
  data.forEach((row, i) => {
    const rawPhone = columnMapping.phone ? row[columnMapping.phone] : null;
    if (rawPhone) {
      let cleanPhone = String(rawPhone).replace(/[- ()]/g, '');
      if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
      
      if (seenPhones.has(cleanPhone)) {
        duplicateIndices.add(i);
      } else {
        seenPhones.add(cleanPhone);
      }
    }
  });

  const filteredData = data.map((row, i) => ({ row, index: i })).filter(({ row, index }) => {
    const isContacted = checkIsContacted(row);
    
    let status = dispatchStatuses[index]?.status || 'Pending';
    if (isContacted) status = 'Contacted';

    if (filter === 'All') return true;
    if (filter === 'Duplicates') return duplicateIndices.has(index);
    return status === filter;
  });

  const sentCount = Object.values(dispatchStatuses).length;
  const total = data.length;
  const progress = total === 0 ? 0 : Math.round((sentCount / total) * 100);

  return (
    <div className="flex flex-col h-[650px]">
      
      {/* Exclusion Toggles */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col sm:flex-row items-center gap-4 shrink-0">
        <span className="text-sm font-bold text-slate-700">Disable cards if already contacted in:</span>
        <div className="flex gap-2 flex-wrap">
          {['Touch 1 Channel', 'Touch 2 Channel', 'Touch 3 Channel'].map(t => {
            const isActive = exclusionToggles.includes(t);
            return (
              <button
                key={t}
                onClick={() => {
                  if (isActive) {
                    setExclusionToggles(exclusionToggles.filter(x => x !== t));
                  } else {
                    setExclusionToggles([...exclusionToggles, t]);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isActive 
                    ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Utility Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-700">Batch Progress</span>
            <span className="text-emerald-600 font-bold">{sentCount} / {total} Dispatched</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner overflow-x-auto">
          {['All', 'Pending', 'Sent', 'Contacted', 'Duplicates'].map(f => {
            const isDupFilter = f === 'Duplicates';
            return (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-900'} ${isDupFilter && filter !== f && duplicateIndices.size > 0 ? 'text-orange-500' : ''}`}
            >
              {f} {isDupFilter && duplicateIndices.size > 0 && `(${duplicateIndices.size})`}
            </button>
            );
          })}
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-4 pr-2 custom-scrollbar flex-1 content-start">
        {filteredData.map(({ row, index }) => {
          const dispatchRecord = dispatchStatuses[index];
          const isSent = dispatchRecord?.status === 'Sent';
          const isDuplicate = duplicateIndices.has(index);
          const name = columnMapping.name ? row[columnMapping.name] : 'Unknown';
          const phone = columnMapping.phone ? row[columnMapping.phone] : 'No Phone';
          const resolvedMsg = resolveTemplate(row);

          const isContacted = checkIsContacted(row);

          return (
            <div key={index} className={`rounded-2xl shadow-sm border p-5 flex flex-col transition-all duration-200 ${
              isDuplicate
                ? 'border-orange-300 bg-orange-50/10'
                : isContacted
                  ? 'opacity-60 bg-slate-50 border-slate-200'
                  : isSent 
                    ? 'bg-emerald-50/20 border-emerald-200' 
                    : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
            }`}>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 truncate max-w-[200px]" title={name}>
                    <span className="text-slate-400 font-medium mr-1 text-xs">SR {index + 1}.</span> 
                    {name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{phone}</p>
                </div>
                <div className="text-right flex flex-col gap-1 items-end">
                  {isContacted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                      <CheckCircle2 size={12} />
                      Contacted
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isSent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {isSent ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {isSent ? 'Sent' : 'Pending'}
                    </span>
                  )}
                  {isDuplicate && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                      Duplicate
                    </span>
                  )}
                  {isSent && !isContacted && <div className="text-[10px] text-slate-400 mt-1">{dispatchRecord.timestamp}</div>}
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex-1 whitespace-pre-wrap line-clamp-4 relative">
                {resolvedMsg}
              </div>

              <div className="flex flex-col xl:flex-row gap-2">
                <button 
                  onClick={() => handleSend(index, row, resolvedMsg)}
                  disabled={isContacted}
                  className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all text-sm ${
                    isContacted
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isSent 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200'
                  }`}
                >
                  <Send size={14} /> 
                  WhatsApp
                </button>
                <button 
                  onClick={() => handleSendEmail(index, row, resolvedMsg)}
                  disabled={isContacted}
                  className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all text-sm ${
                    isContacted
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isSent 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
                  }`}
                >
                  <Mail size={14} /> 
                  Email
                </button>
                {isDuplicate && (
                  <button 
                    onClick={() => deleteRow(index)}
                    className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl font-bold transition-all border border-red-100 text-sm"
                    title="Remove Duplicate"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

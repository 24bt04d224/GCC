import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Trash2, Plus, Search } from 'lucide-react';

export default function EditableTable() {
  const { data, columns, columnMapping, setColumnMapping, updateRow, addRow, deleteRow, clearData } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null);

  if (data.length === 0) return null;

  const filteredData = data.filter(row => 
    Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
        
        {/* Column Mapping Controls */}
        <div className="flex gap-4 items-center bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Phone Column:</label>
            <select 
              value={columnMapping.phone} 
              onChange={(e) => setColumnMapping({ phone: e.target.value })}
              className="text-sm border border-indigo-200 rounded-md py-1 px-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Name Column:</label>
            <select 
              value={columnMapping.name} 
              onChange={(e) => setColumnMapping({ name: e.target.value })}
              className="text-sm border border-indigo-200 rounded-md py-1 px-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-48 transition-all focus:w-64"
            />
          </div>
          <button onClick={addRow} className="p-2 bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors" title="Add Row"><Plus size={18} /></button>
          <button onClick={clearData} className="p-2 bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors" title="Clear All"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                  {col === columnMapping.phone && <span className="ml-2 bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-[10px]">PHONE</span>}
                  {col === columnMapping.name && <span className="ml-2 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px]">NAME</span>}
                </th>
              ))}
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50 group">
                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-400 font-medium">{rowIndex + 1}</td>
                {columns.map((col, colIndex) => {
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === col;
                  return (
                    <td 
                      key={colIndex} 
                      className="px-6 py-3 whitespace-nowrap text-sm text-slate-700 cursor-pointer"
                      onClick={() => setEditingCell({ row: rowIndex, col })}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          className="border-b-2 border-emerald-500 outline-none bg-transparent w-full py-1 text-emerald-900"
                          value={row[col] || ''}
                          onChange={(e) => updateRow(rowIndex, col, e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                        />
                      ) : (
                        <span className={!row[col] ? 'text-slate-300 italic' : ''}>{row[col] || 'Empty'}</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
                  <button onClick={() => deleteRow(rowIndex)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

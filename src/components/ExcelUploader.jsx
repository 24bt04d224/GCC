import React, { useRef } from 'react';
import { useAppStore } from '../store';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet } from 'lucide-react';

export default function ExcelUploader() {
  const { setColumns, setData, setColumnMapping } = useAppStore();
  const fileRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const ws = workbook.Sheets[workbook.SheetNames[0]];
        
        // Auto-detect header row
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
        let headerRowIndex = aoa.findIndex(row => 
          row.some(cell => {
            if (!cell) return false;
            const str = String(cell).toLowerCase().trim();
            return [
              'name', 'student name', 'first name', 'last name', 
              'phone', 'phone number', 'whatsapp number', 'mobile',
              'email', 'email id', 'email address', 'sr no', 'batch'
            ].includes(str);
          })
        );
        if (headerRowIndex === -1) headerRowIndex = 0; // Fallback to first row

        const parsedData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, defval: '' });

        if (parsedData.length > 0) {
          const detectedColumns = Object.keys(parsedData[0]);
          const phoneCol = detectedColumns.find(c => /phone|mobile|contact|cell|whatsapp/i.test(c)) || '';
          const nameCol = detectedColumns.find(c => /name|customer|client/i.test(c)) || '';

          setColumns(detectedColumns);
          setData(parsedData);
          setColumnMapping({ phone: phoneCol, name: nameCol });
        }
      } catch (err) {
        alert("Invalid file format. Please upload a valid .xlsx or .csv file.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; 
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Audience Data</h2>
          <p className="text-sm text-slate-500">Upload your customer list to map fields and start editing.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileRef} onChange={handleFileUpload} />
          <button 
            onClick={() => fileRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-emerald-200"
          >
            <Upload size={18} /> Upload Excel
          </button>
        </div>
      </div>
    </div>
  );
}

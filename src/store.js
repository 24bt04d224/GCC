import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // Navigation
      activeTab: 'data', // 'data' | 'dispatcher'
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Datasets State
      datasets: [], // { id, name, data, columns, columnMapping, dispatchStatuses }
      activeDatasetId: null,

      addDataset: (name, data, columns, columnMapping) => set((state) => {
        const id = Date.now().toString();
        const newDataset = { id, name, data, columns, columnMapping: columnMapping || { phone: '', name: '', email: '', srNo: '' }, dispatchStatuses: {} };
        return { 
          datasets: [...state.datasets, newDataset],
          activeDatasetId: id 
        };
      }),
      setActiveDatasetId: (id) => set({ activeDatasetId: id }),
      deleteDataset: (id) => set((state) => {
        const newDatasets = state.datasets.filter(d => d.id !== id);
        return {
          datasets: newDatasets,
          activeDatasetId: state.activeDatasetId === id ? (newDatasets[0]?.id || null) : state.activeDatasetId
        };
      }),

      setColumnMapping: (mapping) => set((state) => {
        if (!state.activeDatasetId) return state;
        return {
          datasets: state.datasets.map(d => 
            d.id === state.activeDatasetId 
              ? { ...d, columnMapping: { ...d.columnMapping, ...mapping } } 
              : d
          )
        };
      }),
      
      // Grid CRUD
      updateRow: (index, key, value) => set((state) => {
        if (!state.activeDatasetId) return state;
        return {
          datasets: state.datasets.map(d => {
            if (d.id !== state.activeDatasetId) return d;
            const newData = [...d.data];
            newData[index] = { ...newData[index], [key]: value };
            return { ...d, data: newData };
          })
        };
      }),
      addRow: () => set((state) => {
        if (!state.activeDatasetId) return state;
        return {
          datasets: state.datasets.map(d => {
            if (d.id !== state.activeDatasetId) return d;
            const newRow = d.columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
            return { ...d, data: [newRow, ...d.data] };
          })
        };
      }),
      deleteRow: (index) => set((state) => {
        if (!state.activeDatasetId) return state;
        return {
          datasets: state.datasets.map(d => {
            if (d.id !== state.activeDatasetId) return d;
            const newData = [...d.data];
            newData.splice(index, 1);
            return { ...d, data: newData };
          })
        };
      }),
      clearData: () => set((state) => {
        if (!state.activeDatasetId) return state;
        return {
          datasets: state.datasets.map(d => 
            d.id === state.activeDatasetId 
              ? { ...d, data: [], columns: [], columnMapping: { phone: '', name: '', email: '', srNo: '' }, dispatchStatuses: {} } 
              : d
          )
        };
      }),

      // Template Management
      templates: [
        { id: 1, name: 'Alumni Outreach', text: 'Hello {{StudentName}} {{Title}}, this is Patel Deep from GSFC University and I’m part of the Global Connect Club, an initiative of our International Cell.\n\nWe’re reaching out to GSFCU alumni who have gone abroad to understand their experiences and build a useful guide for students who are planning their applications this year. You completed your {{Course}} in the {{Batch}} batch and are currently in the {{Country}}, so your experience would be really valuable for students. Would you be available for a 15-minute call sometime this week? Any day or time that is convenient for you, works for us. If a call is difficult, I can also send you a short form instead.\n\nThank you!' }
      ],
      activeTemplateId: 1,
      setActiveTemplateId: (id) => set({ activeTemplateId: id }),
      saveTemplate: (id, name, text) => set((state) => {
        const exists = state.templates.find(t => t.id === id);
        if (exists) {
          return { templates: state.templates.map(t => t.id === id ? { ...t, name, text } : t) };
        }
        return { templates: [...state.templates, { id, name, text }], activeTemplateId: id };
      }),
      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id),
        activeTemplateId: state.activeTemplateId === id ? (state.templates[0]?.id || null) : state.activeTemplateId
      })),

      // Dispatch Matrix State
      markAsSent: (index) => set((state) => {
        if (!state.activeDatasetId) return state;
        return {
          datasets: state.datasets.map(d => {
            if (d.id !== state.activeDatasetId) return d;
            return {
              ...d,
              dispatchStatuses: { 
                ...d.dispatchStatuses, 
                [index]: { status: 'Sent', timestamp: new Date().toLocaleString() } 
              }
            };
          })
        };
      }),

      // Mock Data Loader
      loadSampleData: () => set((state) => {
        const id = Date.now().toString();
        const sampleDataset = {
          id,
          name: 'Sample Data',
          columns: ['SR No.', 'StudentName', 'Title', 'Mobile', 'Course', 'Batch', 'Country', 'Email ID'],
          columnMapping: { phone: 'Mobile', name: 'StudentName', email: 'Email ID', srNo: 'SR No.' },
          data: [
            { 'SR No.': '1', StudentName: 'Aarav Patel', Title: 'Sir', Mobile: '9876543210', Course: 'B.Tech CSE', Batch: '2021', Country: 'USA', 'Email ID': 'aarav@example.com' },
            { 'SR No.': '2', StudentName: 'Priya Sharma', Title: 'Ma\'am', Mobile: '9123456789', Course: 'BBA', Batch: '2020', Country: 'UK', 'Email ID': 'priya@example.com' },
            { 'SR No.': '3', StudentName: 'Rahul Verma', Title: 'Sir', Mobile: '9988776655', Course: 'B.Sc Chemistry', Batch: '2022', Country: 'Canada', 'Email ID': 'rahul@example.com' },
            { 'SR No.': '4', StudentName: 'Sneha Gupta', Title: 'Ma\'am', Mobile: '9871234560', Course: 'B.Tech Mechanical', Batch: '2019', Country: 'Germany', 'Email ID': 'sneha@example.com' },
          ],
          dispatchStatuses: {}
        };
        return {
          datasets: [...state.datasets, sampleDataset],
          activeDatasetId: id
        };
      })
    }),
    { name: 'whatsapp-campaign-hub-v2' }
  )
);

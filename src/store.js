import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // Navigation
      activeTab: 'data', // 'data' | 'dispatcher'
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Data Grid State
      data: [],
      setData: (data) => set({ data }),
      columns: [],
      setColumns: (columns) => set({ columns }),
      columnMapping: { phone: '', name: '' },
      setColumnMapping: (mapping) => set((state) => ({ 
        columnMapping: { ...state.columnMapping, ...mapping } 
      })),
      
      // Grid CRUD
      updateRow: (index, key, value) => set((state) => {
        const newData = [...state.data];
        newData[index] = { ...newData[index], [key]: value };
        return { data: newData };
      }),
      addRow: () => set((state) => {
        const newRow = state.columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
        return { data: [newRow, ...state.data] };
      }),
      deleteRow: (index) => set((state) => {
        const newData = [...state.data];
        newData.splice(index, 1);
        return { data: newData };
      }),
      clearData: () => set({ data: [], columns: [], columnMapping: { phone: '', name: '' }, dispatchStatuses: {} }),

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
      dispatchStatuses: {}, // { rowIndex: { status: 'Sent', timestamp: '...' } }
      markAsSent: (index) => set((state) => ({
        dispatchStatuses: { 
          ...state.dispatchStatuses, 
          [index]: { status: 'Sent', timestamp: new Date().toLocaleString() } 
        }
      })),

      // Mock Data Loader
      loadSampleData: () => set({
        columns: ['StudentName', 'Title', 'Mobile', 'Course', 'Batch', 'Country'],
        columnMapping: { phone: 'Mobile', name: 'StudentName' },
        data: [
          { StudentName: 'Aarav Patel', Title: 'Sir', Mobile: '9876543210', Course: 'B.Tech CSE', Batch: '2021', Country: 'USA' },
          { StudentName: 'Priya Sharma', Title: 'Ma\'am', Mobile: '9123456789', Course: 'BBA', Batch: '2020', Country: 'UK' },
          { StudentName: 'Rahul Verma', Title: 'Sir', Mobile: '9988776655', Course: 'B.Sc Chemistry', Batch: '2022', Country: 'Canada' },
          { StudentName: 'Sneha Gupta', Title: 'Ma\'am', Mobile: '9871234560', Course: 'B.Tech Mechanical', Batch: '2019', Country: 'Germany' },
        ],
        dispatchStatuses: {}
      })
    }),
    { name: 'whatsapp-campaign-hub-v2' }
  )
);

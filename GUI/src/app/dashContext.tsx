import React, { createContext, useContext } from 'react';

const DashboardContext = createContext<any>(null);

export const useDashboard = () => useContext(DashboardContext);

export default DashboardContext;
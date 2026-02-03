
import React, { useState } from 'react';
import Layout from './components/Layout';
import CitizenChat from './components/CitizenChat';
import ForensicPanel from './components/ForensicPanel';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CITIZEN_CHAT);

  return (
    <Layout viewMode={viewMode} setViewMode={setViewMode}>
      {viewMode === ViewMode.CITIZEN_CHAT ? (
        <CitizenChat />
      ) : (
        <ForensicPanel />
      )}
    </Layout>
  );
};

export default App;

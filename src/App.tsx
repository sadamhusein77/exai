// Application Entry Point
// AI Export Promotion Generator

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './presentation/components/layout/Header';
import { ProductsPage, CMSPage } from './presentation/pages';
import { SettingsModal } from './presentation/components/ui/SettingsModal';
import { useSettings } from './presentation/hooks';

function App() {
  const { apiKey, setApiKey } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header onSettingsClick={() => setIsSettingsOpen(true)} />
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cms" element={<CMSPage />} />
        </Routes>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={setApiKey}
      />
    </BrowserRouter>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  History, 
  FileTerminal, 
  Code2, 
  ShieldCheck, 
  PlayCircle,
  AlertTriangle
} from 'lucide-react';

// Components (to be implemented next)
import VulnerableApp from './components/VulnerableApp';
import RefererPanel from './components/RefererPanel';
import ServerLogViewer from './components/ServerLogViewer';
import BrowserHistoryPanel from './components/BrowserHistoryPanel';
import TokenExtractorScript from './components/TokenExtractorScript';
import SecureAlternatives from './components/SecureAlternatives';
import AttackSimulation from './components/AttackSimulation';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-security-dark text-white flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-security-card border-r border-security-border transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-security-border flex items-center gap-3">
          <ShieldAlert className="text-security-red w-8 h-8" />
          {isSidebarOpen && <span className="font-bold text-lg">LeakGuard Demo</span>}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard />} label="Vulnerable App" isOpen={isSidebarOpen} />
          <NavItem to="/referer" icon={<AlertTriangle />} label="Referer Sızıntısı" isOpen={isSidebarOpen} />
          <NavItem to="/logs" icon={<FileTerminal />} label="Server Logs" isOpen={isSidebarOpen} />
          <NavItem to="/history" icon={<History />} label="Tarayıcı Geçmişi" isOpen={isSidebarOpen} />
          <NavItem to="/extractor" icon={<Code2 />} label="Token Extractor" isOpen={isSidebarOpen} />
          <NavItem to="/secure" icon={<ShieldCheck />} label="Güvenli Yollar" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-security-border">
          <NavLink 
            to="/simulation" 
            className="flex items-center gap-3 p-3 rounded-lg bg-security-red/10 text-security-red border border-security-red/20 hover:bg-security-red/20 transition-all font-bold"
          >
            <PlayCircle />
            {isSidebarOpen && <span>Saldırı Simülasyonu</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-security-card border-b border-security-border flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">🔓 Token Güvenlik Demo | <span className="text-security-orange">Eğitim Amaçlı</span></h1>
          </div>
          <div className="flex items-center gap-2 text-sm bg-security-red/10 text-security-red px-3 py-1 rounded-full border border-security-red/20">
            <AlertTriangle size={14} />
            Yalnızca Eğitim Amaçlıdır
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<VulnerableApp />} />
            <Route path="/referer" element={<RefererPanel />} />
            <Route path="/logs" element={<ServerLogViewer />} />
            <Route path="/history" element={<BrowserHistoryPanel />} />
            <Route path="/extractor" element={<TokenExtractorScript />} />
            <Route path="/secure" element={<SecureAlternatives />} />
            <Route path="/simulation" element={<AttackSimulation />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, isOpen }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 p-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-security-red/10 text-security-red border border-security-red/20' 
          : 'text-gray-400 hover:bg-security-border hover:text-white'
      }`
    }
  >
    {icon}
    {isOpen && <span>{label}</span>}
  </NavLink>
);

export default App;

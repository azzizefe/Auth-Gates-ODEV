import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  ShieldAlert, 
  Settings, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  Lock,
  Compass,
  Zap
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateSecret, verifyTOTP } from './utils/totp';
import { securityScenarios } from './utils/security-data';

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Card = ({ children, className, title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any }) => (
  <div className={cn("bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-2xl space-y-4", className)}>
    {(title || Icon) && (
      <div className="flex items-center gap-3 border-b border-dark-700 pb-4 mb-2">
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
        <h3 className="font-semibold text-slate-100 uppercase tracking-wider text-sm">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ children, variant = 'info' }: { children: React.ReactNode, variant?: 'success' | 'error' | 'warning' | 'info' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };
  return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[variant])}>{children}</span>;
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'gen' | 'verify' | 'live' | 'report'>('gen');
  const [secret, setSecret] = useState('');
  const [issuer, setIssuer] = useState('AuthGates');
  const [account, setAccount] = useState('user@example.com');
  const [userInputToken, setUserInputToken] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean, offset: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [liveTokens, setLiveTokens] = useState<{ prev: string, curr: string, next: string }>({ prev: '', curr: '', next: '' });
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Auto-generate secret on mount
  useEffect(() => {
    handleNewSecret();
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Update live tokens
  useEffect(() => {
    if (!secret) return;
    const update = async () => {
      const epoch = Math.floor(Date.now() / 1000);
      const step = Math.floor(epoch / 30);
      
      const [prev, curr, next] = await Promise.all([
        generateHOTP(secret, step - 1),
        generateHOTP(secret, step),
        generateHOTP(secret, step + 1),
      ]);
      setLiveTokens({ prev, curr, next });
    };
    update();
  }, [secret, Math.floor(currentTime / 30000)]);

  const handleNewSecret = () => {
    setSecret(generateSecret());
    setVerifyResult(null);
    setUserInputToken('');
  };

  const handleVerify = async () => {
    if (userInputToken.length !== 6) return;
    const result = await verifyTOTP(secret, userInputToken);
    setVerifyResult(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const timeLeft = 30 - (Math.floor(currentTime / 1000) % 30);
  const otpAuthUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              TOTP Security Lab
            </h1>
            <p className="text-slate-500 font-medium">RFC 6238 Implementation & 2FA Audit Suite</p>
          </div>
        </div>
        
        <nav className="flex bg-dark-800 p-1 rounded-xl border border-dark-700">
          {[
            { id: 'gen', label: 'Generator', icon: Key },
            { id: 'verify', label: 'Verifier', icon: ShieldCheck },
            { id: 'live', label: 'Live Tokens', icon: RefreshCw },
            { id: 'report', label: 'Audit Report', icon: ShieldAlert }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                activeTab === tab.id ? "bg-dark-700 text-blue-400 shadow-inner" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Generator Tab */}
        {activeTab === 'gen' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 transition-all">
            <Card title="Configuration" icon={Settings}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Issuer Name</label>
                  <input 
                    type="text" value={issuer} onChange={e => setIssuer(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Account / Email</label>
                  <input 
                    type="text" value={account} onChange={e => setAccount(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <button 
                  onClick={handleNewSecret}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  <RefreshCw className="w-4 h-4" /> Generate New Secret
                </button>
              </div>
            </Card>

            <Card title="Authenticator Pairing" icon={Compass}>
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="p-4 bg-white rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <QRCodeSVG value={otpAuthUri} size={200} />
                </div>
                <div className="w-full bg-dark-900 p-4 rounded-xl border border-dark-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Secret Key</span>
                    <button onClick={() => copyToClipboard(secret)} className="text-blue-500 hover:text-blue-400">
                      {copyFeedback ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <code className="block text-lg font-mono text-center text-blue-400 break-all">{secret}</code>
                </div>
                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  Scan this QR with <strong>Google Authenticator</strong> or enter the secret key manually. 
                  The URI follows the standard <code>otpauth://</code> format.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Verifier Tab */}
        {activeTab === 'verify' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in scale-95 transition-all">
            <Card title="Manual Verification" icon={Lock}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Active Secret</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" value={secret} onChange={e => setSecret(e.target.value)}
                      className="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 font-mono text-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">6-Digit Code</label>
                  <input 
                    type="text" maxLength={6} placeholder="000 000"
                    value={userInputToken} onChange={e => setUserInputToken(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-6 text-4xl text-center font-mono tracking-[0.5em] focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <button 
                  onClick={handleVerify}
                  className="w-full bg-slate-100 hover:bg-white text-dark-900 font-black py-4 rounded-xl transition-all shadow-xl"
                >
                  VERIFY TOKEN
                </button>

                {verifyResult && (
                  <div className={cn(
                    "p-6 rounded-xl border flex items-center gap-4 animate-in zoom-in-95",
                    verifyResult.valid ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"
                  )}>
                    {verifyResult.valid ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <ShieldAlert className="w-8 h-8 text-rose-500" />}
                    <div>
                      <p className={cn("font-bold text-lg", verifyResult.valid ? "text-emerald-400" : "text-rose-400")}>
                        {verifyResult.valid ? "VALID TOKEN" : "INVALID TOKEN"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {verifyResult.valid 
                          ? `Matched via window offset: ${verifyResult.offset} (${verifyResult.offset === 0 ? 'Current' : verifyResult.offset === -1 ? 'Previous' : 'Future'})` 
                          : "The code provided did not match any allowed time window."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Timer className="w-6 h-6 text-slate-500" />
                <div>
                  <p className="text-sm font-bold text-slate-300">Token Refresh In</p>
                  <p className="text-xs text-slate-500">Automatic cycle every 30 seconds</p>
                </div>
              </div>
              <div className="text-3xl font-mono font-bold text-blue-500">{timeLeft}s</div>
            </div>
          </div>
        )}

        {/* Live Tokens Tab */}
        {activeTab === 'live' && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in transition-all">
            {[
              { id: 'prev', label: 'Previous Window', token: liveTokens.prev, offset: -1 },
              { id: 'curr', label: 'Current Window', token: liveTokens.curr, offset: 0, active: true },
              { id: 'next', label: 'Next Window', token: liveTokens.next, offset: 1 }
            ].map(t => (
              <Card key={t.id} className={cn(t.active && "border-blue-500/50 ring-1 ring-blue-500/20 shadow-blue-500/10")}>
                <div className="space-y-4 text-center">
                  <Badge variant={t.active ? 'info' : 'warning'}>{t.label}</Badge>
                  <h4 className="text-5xl font-mono font-black text-slate-100 tracking-tighter">
                   {t.token.slice(0, 3)} {t.token.slice(3)}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">T {(t.offset >= 0 ? '+' : '') + t.offset}</p>
                  {t.active && (
                    <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-1000"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Security Report Tab */}
        {activeTab === 'report' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 transition-all">
            <div className="bg-dark-800 border-l-4 border-blue-600 p-8 rounded-r-xl space-y-2">
              <h2 className="text-2xl font-bold">2FA Bypass & Vulnerability Analysis</h2>
              <p className="text-slate-500 max-w-3xl leading-relaxed">
                TOTP is significantly more secure than SMS 2FA, but it isn't bulletproof. 
                Modern attackers use advanced interception techniques to bypass secondary authentication.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityScenarios.map(scenario => (
                <Card key={scenario.id} className="hover:border-slate-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <Badge variant={scenario.severity === 'High' ? 'error' : scenario.severity === 'Medium' ? 'warning' : 'success'}>
                        {scenario.severity} Severity
                     </Badge>
                  </div>
                  <h4 className="font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    {scenario.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {scenario.description}
                  </p>
                  <div className="pt-4 border-t border-dark-700 mt-2">
                    <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Mitigation Strategy
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{scenario.mitigation}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-6">
                <AlertCircle className="w-12 h-12 text-blue-500 shrink-0" />
                <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase tracking-tighter">Security Disclaimer</p>
                    <p className="text-sm text-slate-500">
                        This application is an educational sandbox built for RFC algorithm demonstration. 
                        Do not use this implementation in production environments without a professional peer review 
                        and security audit of the cryptographic handling.
                    </p>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="pt-8 border-t border-dark-700 text-center space-y-2 opacity-50">
        <p className="text-xs text-slate-500 font-mono">
            RFC 6238 (TOTP) • RFC 4226 (HOTP) • HMAC-SHA1 Web Crypto API
        </p>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
            Built with React + Tailwind by AuthGates Security Lab
        </p>
      </footer>
    </div>
  );
}

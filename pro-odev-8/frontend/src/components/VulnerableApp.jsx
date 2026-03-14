import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogIn, Layout, ExternalLink, ShieldAlert, User as UserIcon } from 'lucide-react';
import axios from 'axios';

const VulnerableApp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login');
      // Vulnerable Redirect: Putting token in query param
      navigate(`/?token=${res.data.token}`);
    } catch (err) {
      setError('Giriş başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    navigate('/');
  };

  if (tokenFromUrl) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-security-card border border-security-border rounded-xl overflow-hidden">
          <div className="p-4 bg-security-orange/10 border-b border-security-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-security-orange">
              <Layout size={20} />
              <span className="font-bold">Dashboard (Zafiyetli Görünüm)</span>
            </div>
            <button 
              onClick={clearToken}
              className="text-xs bg-security-border hover:bg-gray-700 px-3 py-1 rounded transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-security-border rounded-full flex items-center justify-center">
                <UserIcon size={32} className="text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Hoş geldin, Admin!</h2>
                <p className="text-gray-400">Sistem yetkili girişi başarılı.</p>
              </div>
            </div>

            <div className="bg-security-dark p-4 rounded-lg border border-security-border mb-6">
              <p className="text-sm text-gray-400 mb-2 font-mono uppercase tracking-wider">Aktif Session Token (URL'den okundu):</p>
              <div className="bg-black/50 p-3 rounded font-mono text-security-orange break-all text-sm border border-security-orange/20">
                {tokenFromUrl}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-security-border rounded-lg bg-security-dark/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ExternalLink size={16} className="text-blue-400" />
                  Dış Bağlantı Testi
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Bu butona tıklamak sizi "harici" bir sayfaya yönlendirir ve Referer header sızıntısını tetikler.
                </p>
                <a 
                  href="http://localhost:4000/api/external" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Harici Siteye Git (Target _blank)
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="p-4 border border-security-red/20 rounded-lg bg-security-red/5">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-security-red">
                  <ShieldAlert size={16} />
                  Neden Tehlikeli?
                </h3>
                <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                  <li>Token URL barında açıkça görünür.</li>
                  <li>Sayfa yenilendiğinde URL değişmezse ifşa devam eder.</li>
                  <li>Paylaşılan ekran görüntülerinde kazara görünebilir.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-security-orange/5 border border-security-orange/20 p-4 rounded-lg flex gap-4 items-start">
          <div className="bg-security-orange/20 p-2 rounded-lg text-security-orange">
            <Layout size={24} />
          </div>
          <div>
            <h4 className="font-bold text-security-orange">Nasıl Çalışır?</h4>
            <p className="text-sm text-gray-400">
              Uygulama, <code>useSearchParams</code> kullanarak URL'deki <code>token</code> parametresini okur. 
              Bu yöntem kolay olsa da, token'ın geçtiği her yerde (loglar, geçmiş, referer) iz bırakmasına neden olur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-security-card border border-security-border rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-security-red/10 p-4 rounded-2xl mb-4 border border-security-red/20 animate-pulse-red">
            <ShieldAlert className="text-security-red w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">Vulnerable Login</h2>
          <p className="text-gray-400 text-sm mt-1">Token Sızıntısı Demosu</p>
        </div>

        {error && (
          <div className="bg-security-red/10 border border-security-red/20 text-security-red p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5 font-mono">USERNAME</label>
            <input 
              type="text" 
              defaultValue="admin"
              disabled
              className="w-full bg-security-dark border border-security-border rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5 font-mono">PASSWORD</label>
            <input 
              type="password" 
              defaultValue="********"
              disabled
              className="w-full bg-security-dark border border-security-border rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-security-red hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                Giriş Yap (Sızıntıyı Başlat)
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-security-border text-center">
          <p className="text-xs text-gray-500 leading-relaxed italic">
            "Bu buton tıklandığında backend'den bir token alınacak ve URL sorgu parametresi olarak dashboard'a aktarılacaktır."
          </p>
        </div>
      </div>
    </div>
  );
};

export default VulnerableApp;

import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, ArrowRight, Share2, Info } from 'lucide-react';
import axios from 'axios';

const RefererPanel = () => {
  const [referer, setReferer] = useState('Yükleniyor...');
  const [loading, setLoading] = useState(false);
  const [tokenLeaked, setTokenLeaked] = useState(false);

  const fetchReferer = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/referer');
      setReferer(res.data.referer);
      setTokenLeaked(res.data.referer.includes('token='));
    } catch (err) {
      setReferer('Referer bilgisi alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferer();
  }, []);

  const extractToken = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('token') || 'Bulunamadı';
    } catch (e) {
      return 'Geçersiz URL';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Share2 className="text-security-red" />
            🚨 Referer Sızıntısı İzleyici
          </h2>
          <p className="text-gray-400 mt-1">Harici sitelere sızan kimlik bilgilerinizi görün.</p>
        </div>
        <button 
          onClick={fetchReferer}
          disabled={loading}
          className="p-2 bg-security-card border border-security-border rounded-lg hover:bg-security-border transition-all disabled:opacity-50"
          title="Yenile"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className={`p-8 border rounded-2xl transition-all duration-500 ${
        tokenLeaked ? 'bg-security-red/5 border-security-red/30 shadow-[0_0_30px_rgba(248,113,113,0.1)]' : 'bg-security-card border-security-border'
      }`}>
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 block">Son Yakalanan Referer Header:</label>
            <div className={`p-4 rounded-xl font-mono text-sm break-all border transition-all ${
              tokenLeaked ? 'bg-black/40 border-security-red/30 text-security-red' : 'bg-black/20 border-security-border text-gray-300'
            }`}>
              {referer}
            </div>
          </div>

          {tokenLeaked ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
              <div className="bg-security-red/10 border border-security-red/20 p-5 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-security-red/20 p-2 rounded-lg text-security-red">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-security-red mb-1">Kritik Sızıntı Tespit Edildi!</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Dashboard sayfasındayken bir linke tıkladınız. Tarayıcı, gittiğiniz siteye 
                      <b> tam URL'inizi</b> (gizli tokenınız dahil) gönderdi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 border border-security-border p-5 rounded-xl flex flex-col justify-center">
                <p className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wider text-center">İfşa Olan Token Değeri:</p>
                <div className="text-security-orange font-mono text-lg text-center break-all selection:bg-orange-500/20">
                  {extractToken(referer)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-security-green/10 border border-security-green/20 p-6 rounded-xl flex items-center gap-4">
              <div className="bg-security-green/20 p-2 rounded-lg text-security-green">
                <ArrowRight size={24} />
              </div>
              <p className="text-gray-400 text-sm">
                Şu anda sızan bir token tespit edilmedi. Dashboard'a gidin ve bu paneli tekrar kontrol edin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-security-card border border-security-border p-5 rounded-xl">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-security-orange">
            <Info size={18} />
            Referer Nedir?
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Kullanıcı bir bağlantıya tıkladığında, tarayıcı yeni sayfaya kullanıcının 
            nereden geldiğini belirten bir <code>Referer</code> header'ı gönderir.
          </p>
        </div>

        <div className="bg-security-card border border-security-border p-5 rounded-xl">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-security-orange">
            <Info size={18} />
            Tehlike Faktörü
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Eğer URL'niz <code>?token=...</code> içeriyorsa, bu token 3. taraf reklam servisleri, 
            analitik araçları veya kötü niyetli site sahipleri tarafından okunabilir.
          </p>
        </div>

        <div className="bg-security-card border border-security-border p-5 rounded-xl">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-security-orange">
            <Info size={18} />
            Nasıl Önlenir?
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            <code>Referrer-Policy: no-referrer</code> kullanarak bu header'ın gönderilmesini 
            engelleyebilirsiniz. Ancak en kesin çözüm, token'ı asla URL'de taşımamaktır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefererPanel;

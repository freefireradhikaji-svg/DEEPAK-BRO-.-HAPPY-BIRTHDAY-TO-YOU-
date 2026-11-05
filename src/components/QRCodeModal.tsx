import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, X, Share2, Sparkles, Heart } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHARED_APP_URL = 'https://ais-pre-ytgz26t7agepacolb2aojo-94534874848.asia-east1.run.app';

export const getPublicShareUrl = (): string => {
  if (typeof window === 'undefined') return SHARED_APP_URL;
  const currentUrl = window.location.href;
  if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
    return SHARED_APP_URL;
  }
  return currentUrl.split('?')[0];
};

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const targetUrl = getPublicShareUrl();

  useEffect(() => {
    if (!isOpen) return;

    // Generate high resolution QR code with dark/gold styling
    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0B0907',
        light: '#FFFDF0',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'Deepak-Bhai-Birthday-Surprise-QR.png';
    link.href = qrDataUrl;
    link.click();
  };

  const handleWhatsAppShare = () => {
    const text = `Bhai! Deepak Bhai ke liye ek zabardast 3D Birthday Surprise banaya hai 🎂👑! Jaldi se dekho yahan: ${targetUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a140d] via-[#120e09] to-[#0a0806] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.35)] text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Official Surprise QR Code</span>
        </div>

        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 mb-1">
          DEEPAK BHAI KA QR CODE 👑
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mb-4">
          Scan karte hi direct Deepak Bhai ka 3D Birthday Surprise khul jayega!
        </p>

        {/* QR Code Card */}
        <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 p-3 bg-gradient-to-br from-[#FFE79A] via-[#D4AF37] to-[#AA771C] rounded-2xl shadow-xl flex items-center justify-center group">
          <div className="w-full h-full bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Deepak Bhai Birthday QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-zinc-500 text-sm animate-pulse">Generating QR...</div>
            )}
          </div>
          {/* Central Logo Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 border-2 border-white flex items-center justify-center shadow-lg text-lg">
              👑
            </div>
          </div>
        </div>

        {/* Public URL Display */}
        <div className="mt-4 p-2.5 rounded-xl bg-black/60 border border-amber-500/20 flex items-center justify-between text-xs text-amber-200/90 font-mono overflow-hidden">
          <span className="truncate mr-2">{targetUrl}</span>
          <button
            onClick={handleCopyLink}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs sm:text-sm shadow-md transition transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Save QR Image</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-medium text-xs sm:text-sm shadow-md transition transform active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-zinc-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>7 November • 100% Online Public Link</span>
          <Heart className="w-3 h-3 text-red-500" />
        </p>
      </div>
    </div>
  );
};

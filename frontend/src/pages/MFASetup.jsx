import { useState } from 'react';
import axios from 'axios';

export default function MFASetup() {
  const [step, setStep] = useState('setup'); // setup, verify
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSetupMFA = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/mfa/setup', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setSecret(response.data.secret);
      setQrCode(response.data.qrCode);
      setBackupCodes(response.data.backupCodes);
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في إعداد MFA');
    }
  };

  const handleVerifyMFA = async () => {
    if (!token || token.length !== 6) {
      setError('أدخل رمز 6 أرقام من التطبيق');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/mfa/verify-setup', 
        { token, secret, backupCodes },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setSuccess('تم تفعيل المصادقة الثنائية بنجاح!');
      setStep('setup');
      setToken('');
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في التحقق');
    }
  };

  return (
    <div className="mfa-setup-container">
      <h2>المصادقة الثنائية (MFA)</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {step === 'setup' && (
        <div className="setup-section">
          <p>لتحسين أمان حسابك، يمكنك تفعيل المصادقة الثنائية</p>
          <button onClick={handleSetupMFA} className="btn btn-primary">
            تفعيل المصادقة الثنائية
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="verify-section">
          <h3>خطوات التفعيل:</h3>
          <ol>
            <li>افتح تطبيق المصادقة (Google Authenticator, Microsoft Authenticator, إلخ)</li>
            <li>امسح رمز QR أدناه:
              {qrCode && <img src={qrCode} alt="QR Code" className="qr-code" />}
            </li>
            <li>أدخل الرمز من التطبيق:
              <input 
                type="text" 
                placeholder="000000" 
                maxLength="6"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mfa-input"
              />
            </li>
            <li>احفظ رموز النسخ الاحتياطية:
              <div className="backup-codes">
                {backupCodes.map((code, idx) => (
                  <code key={idx}>{code}</code>
                ))}
              </div>
            </li>
          </ol>
          <button onClick={handleVerifyMFA} className="btn btn-success">
            تأكيد المصادقة
          </button>
        </div>
      )}
    </div>
  );
}

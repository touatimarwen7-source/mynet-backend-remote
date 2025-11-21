import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/unified-header.css';

export default function UnifiedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication on mount and when auth changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');
      setIsAuthenticated(!!token);
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  // Determine if we're on a public page
  const isPublicPage = ['/', '/about', '/features', '/pricing', '/contact'].includes(
    location.pathname
  );

  // Navigation links for public pages
  const publicLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos', href: '/about' },
    { label: 'Solutions', href: '/features' },
    { label: 'Tarification', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ];

  // Navigation links for authenticated pages
  const authenticatedLinks = [
    { label: '📊 Tableau de Bord', href: '/dashboard', icon: '📊' },
    { label: '📋 Appels d\'Offres', href: '/tenders', icon: '📋' },
    { label: '💼 Mon Profil', href: '/profile', icon: '💼' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="unified-header">
      <div className="header-container">
        {/* Logo & Brand */}
        <div className="header-brand">
          <a href="/" className="brand-logo">
            <span className="brand-icon">🌐</span>
            <span className="brand-text">MyNet.tn</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {isPublicPage || !isAuthenticated ? (
            // Public Navigation
            <>
              {publicLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${
                    location.pathname === link.href ? 'active' : ''
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </>
          ) : (
            // Authenticated Navigation
            <>
              {authenticatedLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${
                    location.pathname === link.href ? 'active' : ''
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </>
          )}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            // Authenticated Actions
            <>
              <span className="user-info">👤 {userRole === 'buyer' ? 'Acheteur' : 'Fournisseur'}</span>
              <button className="btn-logout" onClick={handleLogout}>
                🚪 Déconnexion
              </button>
            </>
          ) : (
            // Public Actions
            <>
              <a href="/login" className="btn-login">
                🔐 Connexion
              </a>
              <a href="/register" className="btn-register">
                ✍️ Inscription
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {isPublicPage || !isAuthenticated ? (
              // Public Mobile Navigation
              <>
                {publicLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`mobile-nav-link ${
                      location.pathname === link.href ? 'active' : ''
                    }`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            ) : (
              // Authenticated Mobile Navigation
              <>
                {authenticatedLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`mobile-nav-link ${
                      location.pathname === link.href ? 'active' : ''
                    }`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            )}
          </nav>

          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <span className="mobile-user-info">👤 {userRole === 'buyer' ? 'Acheteur' : 'Fournisseur'}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  🚪 Déconnexion
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn-login">
                  🔐 Connexion
                </a>
                <a href="/register" className="btn-register">
                  ✍️ Inscription
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

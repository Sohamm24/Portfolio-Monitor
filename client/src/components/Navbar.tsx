import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { currentUser, loading, signInWithGoogle, logout } = useAuth(); 

  console.log(currentUser)
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
      }
    } else {
      // Navigate to dashboard if authenticated
      window.location.href = '/dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      // Optionally redirect to home page after logout
      // window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state if auth is still loading
  if (loading) {
    return (
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isNavbarScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/60' 
          : 'bg-white/90 backdrop-blur-lg border-b border-gray-200/40'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Portfolio Monitor
            </div>
          </div>

          {/* Loading spinner */}
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isNavbarScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/60' 
        : 'bg-white/90 backdrop-blur-lg border-b border-gray-200/40'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
            Portfolio Monitor
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center">
          {!isAuthenticated ? (
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30 active:translate-y-0 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100/80 transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=3b82f6&color=fff`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg group-hover:border-blue-200 transition-all duration-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 py-2 animate-in fade-in duration-200"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=3b82f6&color=fff`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{currentUser?.displayName || 'User'}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </a>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200/60 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
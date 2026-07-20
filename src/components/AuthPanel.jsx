import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, logout, auth, registerWithEmail, loginWithEmail, onAuthStateChanged, resetPassword } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn, LogOut, Shield, GraduationCap, AlertCircle, Mail, Lock, Check } from 'lucide-react';


export default function AuthPanel({ onNavigate }) {
  const { user, setUser, clearUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) {
      clearUser();
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser]);

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      if (err.message.includes("not configured")) {
        setErrorMsg("Firebase is not configured yet. Please add your credentials to .env.local");
      } else {
        setErrorMsg(err.message);
      }
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (isLoginView) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes("not configured")) {
        setErrorMsg("Firebase is not configured yet. Please add your credentials to .env.local");
      } else {
        setErrorMsg(err.message.replace("Firebase: ", ""));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await resetPassword(email);
      setSuccessMsg('Password reset email sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      if (err.message.includes("not configured")) {
        setErrorMsg("Firebase is not configured yet. Please add your credentials to .env.local");
      } else {
        setErrorMsg(err.message.replace("Firebase: ", ""));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPortal = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  if (loading && auth) {
    return <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const isAdmin = user?.email === 'wuhs.official@gmail.com';

  return (
    <div className="flex flex-col space-y-6">
      {!user ? (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center text-center space-y-2 mb-2">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
              <LogIn className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-ink dark:text-cloudy">
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-xs text-muted dark:text-gray-400">
              {isLoginView ? 'Sign in to access your portals.' : 'Register for an account first.'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="flex flex-col space-y-3">
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-gold outline-none text-ink dark:text-cloudy"
                required
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-gold outline-none text-ink dark:text-cloudy"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-goldDark text-white py-2 rounded-lg text-sm font-semibold shadow-md transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Please wait...' : isLoginView ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-2">
            <button 
              type="button" 
              onClick={() => { setIsLoginView(!isLoginView); setErrorMsg(''); setSuccessMsg(''); }}
              className="hover:text-gold transition-colors underline"
            >
              {isLoginView ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
            {isLoginView && (
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="hover:text-gold transition-colors underline"
              >
                Forgot Password?
              </button>
            )}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-ink dark:text-cloudy py-2 px-4 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          
          {errorMsg && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="break-all">{errorMsg}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs flex items-start gap-2 text-left border border-emerald-500/20">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="break-all">{successMsg}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <img src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.email} alt="Profile" className="w-10 h-10 rounded-full bg-white" referrerPolicy="no-referrer" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-ink dark:text-cloudy truncate">{user.displayName || 'User'}</span>
              <span className="text-xs text-muted dark:text-gray-400 truncate">{user.email}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="text-xs font-bold text-muted dark:text-gray-400 uppercase tracking-wider mb-1">Portals</h4>
            <button
              onClick={() => goToPortal('/student-portal')}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gold dark:hover:border-gold transition-colors text-left"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink dark:text-cloudy">Student Portal</div>
                <div className="text-xs text-muted dark:text-gray-400">View merits and progress</div>
              </div>
            </button>
            
            {isAdmin && (
              <button
                onClick={() => goToPortal('/admin-portal')}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gold dark:hover:border-gold transition-colors text-left"
              >
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink dark:text-cloudy">Admin Portal</div>
                  <div className="text-xs text-muted dark:text-gray-400">Manage data and users</div>
                </div>
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium mt-auto"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

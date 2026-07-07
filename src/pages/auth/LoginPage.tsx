import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, Key, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2FA Control Multi-step state mechanics
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Helper utility to calculate Password Strength Meter (Milestone 6)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<> ]/.test(pass) && pass.length >= 8) score += 1;

    if (score === 1) return { score, label: 'Weak Account Security', color: 'bg-rose-500 w-1/3' };
    if (score === 2) return { score, label: 'Medium Security Layer', color: 'bg-amber-500 w-2/3' };
    return { score, label: 'Strong Cryptographic Key', color: 'bg-emerald-500 w-full' };
  };

  const strength = getPasswordStrength(password);
  
  // Phase 1: Handle initial credential validation check
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Intact verification check simulation context
      if (email && password) {
        // Trigger multi-step 2FA challenge layer instead of standard instant route
        setTimeout(() => {
          setIsLoading(false);
          setShowTwoFactorModal(true);
          setOtpInput('');
          setOtpError(null);
        }, 800);
      }
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  // Phase 2: Finalize Multi-step authorization challenge node (OTP validation block)
  const handleOtpVerifyAndRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setIsOtpVerifying(true);

    // Mock verification criteria matching (Accepts 123456 as verified bypass node or any 6 digits)
    if (otpInput.length !== 6) {
      setOtpError("Secure standard tokens require exactly 6 digit numeric code sequences.");
      setIsOtpVerifying(false);
      return;
    }

    try {
      // Execute the real background context authorization authentication hook sequence
      await login(email, password, role);
      setIsOtpVerifying(false);
      setShowTwoFactorModal(false);
      
      // Role-based route branching securely verified via 2FA
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setOtpError((err as Error).message || "2FA verification payload authentication handshake failed.");
      setIsOtpVerifying(false);
    }
  };
  
  // Pre-filled credentials mapping
  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('SecurePass123!');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('SecurePass123!');
    }
    setRole(userRole);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Business Nexus
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect with investors and entrepreneurs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleInitialSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors font-semibold text-sm ${
                    role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>
                
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors font-semibold text-sm ${
                    role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('investor')}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>
              </div>
            </div>
            
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} />}
            />
            
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              
              {/* Milestone 6 Feature: Interactive Password Strength Meter Bar Widget */}
              {password && (
                <div className="pt-2 animate-fade-in">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.color}`} />
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 mt-1 flex justify-between items-center">
                    <span>Account Security Score:</span>
                    <span className={
                      strength.score === 1 ? 'text-rose-600' : strength.score === 2 ? 'text-amber-600' : 'text-emerald-600'
                    }>{strength.label}</span>
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              leftIcon={<LogIn size={18} />}
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Demo Accounts</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fillDemoCredentials('entrepreneur')}
                leftIcon={<Building2 size={16} />}
              >
                Entrepreneur Demo
              </Button>
              
              <Button
                variant="outline"
                onClick={() => fillDemoCredentials('investor')}
                leftIcon={<CircleDollarSign size={16} />}
              >
                Investor Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Week 3 Milestone 6 Crucial Feature: Multi-step Login 2FA OTP Simulation Overlay Dialog */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                <h3 className="text-base font-bold tracking-tight">Multi-Factor Authentication Required</h3>
              </div>
              <button type="button" onClick={() => setShowTwoFactorModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleOtpVerifyAndRedirect}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-center bg-blue-50 text-blue-700 w-12 h-12 rounded-full mx-auto">
                  <Key size={22} />
                </div>
                
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Enter Your 2FA Secure Access Token</p>
                  <p className="text-xs text-gray-500">A security payload verification token was dispatched to your system node registry channel. For demo bypass, provide a 6-digit numeric sequence.</p>
                </div>

                {otpError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="font-medium">{otpError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <input
                    type="text"
                    maxLength={6}
                    pattern="\d*"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456"
                    className="w-full text-center tracking-[0.75em] text-xl font-bold font-mono py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 px-1 pt-1 font-medium">
                    <span>MFA Node: Active</span>
                    <span>Status: Challenging Payload</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowTwoFactorModal(false)}>Abort</Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  isLoading={isOtpVerifying}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  Verify & Unlock
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
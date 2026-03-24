/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  Server, 
  Settings, 
  Cpu, 
  Database, 
  Route, 
  BarChart2,
  Layout,
  CreditCard,
  Network,
  Chrome,
  Snowflake,
  Figma,
  Github,
  Cloud,
  BookOpen,
  Bot,
  Star,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { ThreeBackground } from './components/ThreeBackground';
import { CommandPalette } from './components/CommandPalette';
import { cn } from './lib/utils';
import { auth, db } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  industry?: string;
  createdAt: Timestamp;
}

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    industry: ''
  });

  const [distortion, setDistortion] = useState(0.6);
  const [detail, setDetail] = useState(0.9);
  const [speed, setSpeed] = useState(0.1);
  const [opacity, setOpacity] = useState(0.8);
  const [color, setColor] = useState('#f97316');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
      setScrolled(currentScroll > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as UserProfile);
          setShowProfileForm(false);
        } else {
          setProfile(null);
          setShowProfileForm(true);
          setProfileFormData(prev => ({
            ...prev,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
          }));
        }
      } else {
        setProfile(null);
        setShowProfileForm(false);
      }
      setIsAuthLoading(false);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newProfile = {
      uid: user.uid,
      ...profileFormData,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), newProfile);
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      setProfile(profileDoc.data() as UserProfile);
      setShowProfileForm(false);
    } catch (error) {
      console.error("Profile creation error:", error);
    }
  };

  return (
    <div className="min-h-screen selection:bg-orange-500/30 selection:text-white">
      {/* SCROLL PROGRESS */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[110] pointer-events-none">
        <motion.div 
          className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* PROFILE FORM MODAL */}
      <AnimatePresence>
        {showProfileForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md tech-glass p-8 rounded-2xl border border-zinc-800/80 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
              
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                  <span className="font-mono text-[10px] text-orange-500 uppercase tracking-widest">Initialization Protocol</span>
                </div>
                <h2 className="text-2xl font-medium text-white tracking-tight">Complete Your Profile</h2>
                <p className="text-sm text-zinc-500 mt-2">We need a few more details to calibrate your system access.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Work Email</label>
                    <input 
                      type="email" 
                      required
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Company</label>
                  <input 
                    type="text" 
                    required
                    value={profileFormData.company}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Role</label>
                    <input 
                      type="text" 
                      required
                      value={profileFormData.role}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Industry</label>
                    <input 
                      type="text" 
                      required
                      value={profileFormData.industry}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full group flex items-center justify-center gap-3 bg-orange-500 text-white px-6 py-4 rounded-lg hover:bg-orange-600 transition-all duration-300 font-medium text-sm mt-4"
                >
                  Confirm Registration
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />

      {/* AUTH MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm tech-glass p-8 rounded-2xl border border-zinc-800/80 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 flex flex-col items-center justify-center gap-[2px] rounded bg-white text-black font-mono text-xs font-medium mx-auto mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  FF
                </div>
                <h2 className="text-2xl font-medium text-white tracking-tight">
                  {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                  {authMode === 'signup' 
                    ? 'Join FlowForge to automate your infrastructure.' 
                    : 'Access your operational dashboard.'}
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-white text-zinc-950 px-6 py-3 rounded-lg hover:bg-zinc-200 transition-all duration-300 font-medium text-sm"
                >
                  <Chrome className="w-4 h-4" />
                  Continue with Google
                </button>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-mono">
                    <span className="bg-[#09090b] px-2 text-zinc-600">Secure Access</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-zinc-500">
                    {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                    <button 
                      onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                      className="ml-2 text-orange-500 hover:text-orange-400 font-medium transition-colors"
                    >
                      {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-center gap-2 opacity-40">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 pointer-events-none grid-overlay z-0" />
        <ThreeBackground 
          distortion={distortion}
          detail={detail}
          speed={speed}
          opacity={opacity}
          color={color}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <header className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-6 flex justify-between items-center",
          scrolled ? "bg-black/60 backdrop-blur-md border-b border-zinc-900 py-4" : "bg-transparent"
        )}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex flex-col items-center justify-center gap-[2px] rounded bg-white text-black font-mono text-xs font-medium shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                FF
              </div>
              <span className="text-xl tracking-tight text-white font-medium">FlowForge Systems</span>
            </div>
            <div className="flex items-center gap-2 pl-11">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Node Architecture</span>
            </div>
          </motion.div>

            <nav className="pointer-events-auto hidden md:flex items-center gap-6">
                <a href="#capabilities" className="font-mono text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Capabilities</a>
                <a href="#architecture" className="font-mono text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Architecture</a>
                
                <div className="h-4 w-px bg-zinc-800 mx-2"></div>

                <button 
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/80 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-700 transition-all duration-200"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium tracking-tight mr-2">Search...</span>
                  <div className="flex items-center gap-1">
                    <kbd className="font-mono text-[9px] px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-700 text-zinc-400 shadow-sm">⌘</kbd>
                    <kbd className="font-mono text-[9px] px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-400 shadow-sm">K</kbd>
                  </div>
                </button>

                {isAuthLoading ? (
                  <div className="w-24 h-9 bg-zinc-900 animate-pulse rounded-full" />
                ) : user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-white">{profile?.name || user.displayName}</span>
                      <button 
                        onClick={handleSignOut}
                        className="text-[10px] font-mono text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest"
                      >
                        Sign Out
                      </button>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setAuthMode('signin');
                        setIsAuthModalOpen(true);
                      }}
                      className="text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        setAuthMode('signup');
                        setIsAuthModalOpen(true);
                      }}
                      className="text-sm px-6 py-2 bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors rounded-full flex items-center gap-2"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
            </nav>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-20 w-full max-w-4xl mt-auto md:mt-0 md:top-[-5%]"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-px bg-orange-500" 
            />
            <span className="font-mono text-xs text-orange-500 uppercase tracking-[0.2em]">Operational Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] tracking-tight font-medium text-balance">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block"
            >
              Automate
            </motion.span><br />
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-zinc-500 inline-block"
            >
              Everything.
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-8 max-w-md text-base md:text-lg text-zinc-400 font-light leading-relaxed"
          >
            From backend workflows to full operational systems, we eliminate manual friction. Unlocking true operational velocity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-6 pointer-events-auto"
          >
            <button 
              onClick={() => {
                if (user) {
                  document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }
              }}
              className="group flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded hover:bg-orange-600 transition-all duration-300 font-medium text-sm shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              Initialize System
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">System Online</span>
            </div>
          </motion.div>
        </motion.div>

        {/* LOGO CLOUD */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="absolute bottom-24 left-6 md:left-12 flex items-center gap-8 md:gap-12 grayscale opacity-40"
        >
          <div className="flex items-center gap-2"><Cpu className="w-5 h-5" /><span className="font-mono text-[10px] uppercase tracking-widest">Nvidia</span></div>
          <div className="flex items-center gap-2"><Cloud className="w-5 h-5" /><span className="font-mono text-[10px] uppercase tracking-widest">AWS</span></div>
          <div className="flex items-center gap-2"><Database className="w-5 h-5" /><span className="font-mono text-[10px] uppercase tracking-widest">Oracle</span></div>
          <div className="flex items-center gap-2"><Settings className="w-5 h-5" /><span className="font-mono text-[10px] uppercase tracking-widest">Siemens</span></div>
        </motion.div>

        {/* Controls Panel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="pointer-events-auto absolute bottom-8 right-6 md:right-12 hidden lg:flex items-center"
        >
          <div className="w-48 tech-glass rounded-lg p-4 relative z-10 flex flex-col gap-3 mr-[-4px]">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">WSS_Link.01</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Packets</span><span className="text-orange-500">14.2k/s</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Latency</span><span>8ms</span>
              </div>
            </div>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-950 border border-zinc-700 rounded-full z-20" />
          </div>

          <svg className="w-12 h-2 overflow-visible relative z-0">
            <path d="M0,4 C24,4 24,4 48,4" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="3 3" className="animate-flow" />
          </svg>

          <div className="w-[280px] tech-glass rounded-lg ml-[-4px] relative z-10">
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-950 border border-zinc-700 rounded-full z-20" />

            <div className="border-b border-zinc-800/60 px-4 py-3 flex justify-between items-center">
              <span className="font-mono text-xs text-white uppercase tracking-widest">System Calibration</span>
              <Settings className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="p-5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  <span>Flux Dynamics</span>
                  <span className="text-zinc-300">{distortion.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2.0" 
                  step="0.1" 
                  value={distortion} 
                  onChange={(e) => setDistortion(parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  <span>Processing Threads</span>
                  <span className="text-zinc-300">{detail.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2.0" 
                  step="0.1" 
                  value={detail} 
                  onChange={(e) => setDetail(parseFloat(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-800/60">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                    <span>Clock Rate</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="0.5" 
                    step="0.01" 
                    value={speed} 
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                    <span>Core Density</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={opacity} 
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Energy Profile</span>
                <div className="flex gap-2">
                  {[
                    { hex: '#f97316', label: 'Orange' },
                    { hex: '#3b82f6', label: 'Blue' },
                    { hex: '#10b981', label: 'Green' }
                  ].map((c) => (
                    <button 
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      className={cn(
                        "w-4 h-4 rounded border border-transparent transition-all",
                        color === c.hex ? "ring-1 ring-offset-2 ring-offset-[#09090b] ring-zinc-600" : "hover:ring-1 hover:ring-offset-2 hover:ring-offset-[#09090b] hover:ring-zinc-600"
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-6 md:left-12 flex flex-col gap-1 opacity-60">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Protocol v4.0.1</span>
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Encrypted Tunnel</span>
        </div>
      </section>

      {/* WHAT WE AUTOMATE - BENTO GRID */}
      <section id="capabilities" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-20">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-[10px] text-orange-500 uppercase tracking-widest">Capabilities Matrix</span>
            </div>
            <h2 className="text-4xl md:text-5xl tracking-tight font-medium text-white mb-4">What We Automate</h2>
            <p className="text-zinc-400 text-base md:text-lg font-light">End-to-end integration mapping across hardware interfaces and digital infrastructure.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-xs font-mono">
              Nodes: <span className="text-white">370+</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-xs font-mono">
              Uptime: <span className="text-green-500">99.99%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Bento Item */}
          <div className="md:col-span-8 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Route className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 text-orange-500">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-medium text-white tracking-tight mb-4">Supply Chain Logic</h3>
              <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-md">
                Autonomous routing, predictive inventory load balancing, and autonomous dispatch synchronization across global networks.
              </p>
              <div className="mt-8 flex gap-3">
                {['Routing', 'Inventory', 'Dispatch'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Small Bento Item */}
          <div className="md:col-span-4 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 text-blue-500">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-medium text-white tracking-tight mb-4">Data ETL</h3>
            <p className="text-base text-zinc-400 font-light leading-relaxed">
              Self-healing data extraction, schema normalization, and dynamic multi-node stream processing.
            </p>
          </div>

          {/* Small Bento Item */}
          <div className="md:col-span-4 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 text-green-500">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-medium text-white tracking-tight mb-4">Hardware</h3>
            <p className="text-base text-zinc-400 font-light leading-relaxed">
              Direct PLC integrations, robotic arm pathing optimization, and real-time sensory array ingestion.
            </p>
          </div>

          {/* Medium Bento Item */}
          <div className="md:col-span-8 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 text-amber-500">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-medium text-white tracking-tight mb-4">Predictive Analytics</h3>
                <p className="text-base text-zinc-400 font-light leading-relaxed">
                  Real-time forecasting models that automatically adjust operational parameters to prevent bottlenecks before they occur.
                </p>
              </div>
              <div className="w-full md:w-48 aspect-square bg-zinc-950 rounded-xl border border-zinc-800 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  <span className="text-[9px] font-mono text-zinc-600">LIVE_FEED</span>
                </div>
                <div className="space-y-2">
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['20%', '80%', '40%', '90%'] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="h-full bg-orange-500" 
                    />
                  </div>
                  <div className="h-1 w-3/4 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['40%', '20%', '70%', '30%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-full bg-zinc-700" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section id="architecture" className="py-24 border-y border-zinc-900 bg-zinc-950/50 relative z-20">
        <div className="px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 group">
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" 
                alt="Robotic arm factory automation" 
                className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 px-4 py-2 rounded">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Routing Latency</span>
                  <span className="text-lg font-medium text-white">4.2ms</span>
                </div>
                <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 px-4 py-2 rounded flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-widest">Live Sync</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="flex items-center gap-2">
              <BarChart2 className="text-orange-500 w-5 h-5" />
              <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">Case Study</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl tracking-tight font-medium text-white leading-tight">
              How Global Logistics Inc reduced manual routing by 98%.
            </h2>
            
            <p className="text-base md:text-lg text-zinc-400 font-light leading-relaxed">
              By implementing the FlowForge operational engine, GLI entirely bypassed their legacy ERP bottleneck. The system natively integrates with existing robotic arrays to process and allocate thousands of units per minute with zero human intervention.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
              <div>
                <div className="text-4xl tracking-tighter font-medium text-white mb-1">10x</div>
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Throughput Increase</div>
              </div>
              <div>
                <div className="text-4xl tracking-tighter font-medium text-white mb-1">&lt;1s</div>
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Decision Latency</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTEGRATIONS SECTION */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-20 border-b border-zinc-900">
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl tracking-tight font-medium text-white mb-6">Integrations are baked in.</h2>
          <p className="text-base md:text-lg text-zinc-400 font-light text-balance leading-relaxed">
            Connect to 370+ services, trigger workflows from any event. No migration, no lock-in.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: Layout, label: "Webflow" },
            { icon: CreditCard, label: "Stripe" },
            { icon: Network, label: "Hubspot" },
            { icon: Chrome, label: "Google" },
            { icon: Snowflake, label: "Snowflake" },
            { icon: Database, label: "Supabase" },
            { icon: Figma, label: "Figma" },
            { icon: Snowflake, label: "MongoDB" },
            { icon: Github, label: "GitHub" },
            { icon: Layout, label: "WordPress" },
            { icon: Cloud, label: "Salesforce" },
            { icon: BookOpen, label: "Notion" }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-xl bg-[#0c0c0e] border border-zinc-800/60 hover:bg-[#121214] hover:border-zinc-700 transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 text-zinc-400 group-hover:text-white transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-base font-medium text-white mb-1">{item.label}</span>
              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Connect</span>
                <ArrowRight className="w-3 h-3 text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW ENGINE CTA */}
      <section className="relative w-full overflow-hidden bg-[#050505] min-h-[700px] flex items-center border-b border-zinc-900">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute -top-10 -right-20 w-[120%] h-[120%] flex flex-col gap-16 transform -rotate-[8deg] select-none opacity-10 blur-[1px]">
            <div className="text-[140px] font-medium tracking-tighter text-zinc-500 whitespace-nowrap leading-none">Add Nodes Add Nodes Add Nodes</div>
            <div className="text-[90px] font-medium tracking-tighter text-zinc-500 whitespace-nowrap leading-none ml-32">Drag nodes from here to the canvas or click to add them</div>
            <div className="text-[120px] font-medium tracking-tighter text-zinc-500 whitespace-nowrap leading-none ml-64">Search nodes... Search nodes...</div>
          </div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-blue-600/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(37,99,235,0.15)]">
            <span className="text-blue-400 font-medium text-lg tracking-tight flex items-center gap-2">
              <Bot className="w-5 h-5" /> Agent Chat
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded mb-8">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">New Engine</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-medium text-white mb-6 leading-[1.05] text-balance">
              We are the easiest way to build automations & AI agents for the AI era.
            </h2>
            
            <p className="text-base md:text-lg text-zinc-400 font-light leading-relaxed mb-10 max-w-md">
              AI-powered workflow execution. From conditional logic to complex orchestration — build, test, and deploy with complete flexibility.
            </p>

            <a href="#booking-section" className="group flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-7 py-3.5 rounded-md transition-all duration-300 font-medium text-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="w-full lg:w-5/12 flex justify-start lg:justify-end">
            <div className="tech-glass p-10 rounded-2xl w-full max-w-md border border-zinc-800/80 relative overflow-hidden group bg-[#0a0a0c]/80">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-2xl tracking-tight font-medium text-white mb-8 pr-8 leading-tight">
                A visual workflow engine with 370+ installable nodes
              </h3>

              <div className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-6 relative">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-3">Integrations Available</span>
                <div className="text-6xl tracking-tighter font-medium text-white mb-4">800+</div>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Over 200 installed with a default command. Connect to any service, API, or database across your entire stack.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking-section" className="py-32 px-6 md:px-12 bg-[#09090b] relative z-20 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">Protocol: Initialization</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl tracking-tight font-medium text-white leading-tight">
              Ready to automate your <span className="text-zinc-500">digital infrastructure?</span>
            </h2>
            
            <p className="text-base md:text-lg text-zinc-400 font-light leading-relaxed max-w-md">
              Submit your system parameters below. Our engineering team will review your architecture and provide an automation roadmap within 24 hours.
            </p>

            <div className="space-y-4 pt-8 border-t border-zinc-900">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Custom Architecture</div>
                  <div className="text-xs text-zinc-500">Tailored to your specific stack</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Full Integration</div>
                  <div className="text-xs text-zinc-500">End-to-end node synchronization</div>
                </div>
              </div>
            </div>
          </div>

          <div className="tech-glass p-8 md:p-10 rounded-2xl border border-zinc-800/80">
            <form 
              action="https://formspree.io/f/mzdjnzpn" 
              method="POST"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    defaultValue={profile?.name || user?.displayName || ''}
                    placeholder="John Doe"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Work Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    defaultValue={profile?.email || user?.email || ''}
                    placeholder="john@company.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Official Website Link</label>
                  <input 
                    type="url" 
                    id="website" 
                    name="website" 
                    required 
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Required Automation Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="automation_date" 
                  required 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="requirements" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Specific Requirements / Notes</label>
                <textarea 
                  id="requirements" 
                  name="requirements" 
                  rows={4}
                  placeholder="Tell us about your current workflow bottlenecks..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full group flex items-center justify-center gap-3 bg-orange-500 text-white px-6 py-4 rounded-lg hover:bg-orange-600 transition-all duration-300 font-medium text-sm"
              >
                Submit Initialization Request
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[10px] text-zinc-600 text-center font-mono uppercase tracking-widest">
                Secure SSL Encrypted Transmission
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden bg-animated-gradient z-20 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 grid-overlay opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-amber-400 w-5 h-5" />
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">Early Access</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-medium text-white mb-6 text-balance">
            Ready to forge your <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">automated future?</span>
          </h2>
          
          <p className="text-base md:text-lg text-blue-100/70 font-light max-w-xl mb-10 text-balance leading-relaxed">
            Join the waitlist today. Get exclusive access to the beta and start building operational intelligence at scale.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md relative z-20">
            <input 
              type="email" 
              placeholder="Enter your work email" 
              className="w-full bg-[#020617]/40 border border-[#1e3a8a]/60 rounded-full px-6 py-3.5 text-sm text-white placeholder:text-blue-300/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all backdrop-blur-md"
            />
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#020617] px-8 py-3.5 rounded-full transition-all duration-300 font-medium text-sm whitespace-nowrap gold-glow hover:scale-[1.02]">
              Sign Up
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#09090b] pt-20 pb-10 px-6 md:px-12 relative z-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 flex flex-col items-center justify-center rounded bg-white text-black font-mono text-[10px] font-medium">
                FF
              </div>
              <span className="text-lg tracking-tight text-white font-medium">FlowForge Systems</span>
            </div>
            <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-xs mb-6">
              Automate everything. From backend workflows to full operational systems, we eliminate manual friction.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-mono text-white uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-mono text-white uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-mono text-white uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm font-light text-zinc-500 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-light text-zinc-600">© 2024 FlowForge Systems. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

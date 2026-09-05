import React from "react";
import GridShape from "../../components/common/GridShape";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import "./AuthPageLayout.css"; // Import the CSS file

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid relative overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-brand-400/10 to-brand-800/20 animate-gradient-xy"></div>
          
          {/* Animated Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-64 h-64 -top-20 -left-20 bg-brand-400/10 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute w-96 h-96 -bottom-32 -right-32 bg-brand-600/10 rounded-full blur-3xl animate-float-delay"></div>
            <div className="absolute w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
            {/* Additional floating particles for more animation */}
            <div className="absolute w-32 h-32 top-1/4 left-1/4 bg-brand-300/5 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-40 h-40 bottom-1/4 right-1/4 bg-brand-500/5 rounded-full blur-2xl animate-float-delay" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute w-24 h-24 top-3/4 left-1/3 bg-brand-400/5 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
            {/* New particles with different animations */}
            <div className="absolute w-20 h-20 top-1/3 right-1/3 bg-brand-300/5 rounded-full blur-xl animate-float-delay" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute w-56 h-56 bottom-1/3 left-1/4 bg-brand-400/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1.2s' }}></div>
            <div className="absolute w-28 h-28 top-2/3 right-1/4 bg-brand-500/5 rounded-full blur-2xl animate-float-delay" style={{ animationDelay: '0.8s' }}></div>
            {/* Shimmer particles */}
            <div className="absolute w-2 h-2 top-1/4 left-1/2 bg-brand-400/30 rounded-full animate-shimmer"></div>
            <div className="absolute w-2 h-2 bottom-1/3 right-1/3 bg-brand-300/30 rounded-full animate-shimmer" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute w-3 h-3 top-2/3 left-1/4 bg-brand-500/20 rounded-full animate-shimmer" style={{ animationDelay: '2.5s' }}></div>
          </div>

          {/* Animated Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-5 animate-grid-pulse">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-md animate-fade-in-up px-6">
              {/* Dashboard Illustration Image - Professional Design with Enhanced Animation */}
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-600/20 to-transparent rounded-2xl blur-2xl animate-pulse-slow"></div>
                <div className="absolute -inset-8 bg-gradient-to-r from-brand-400/10 via-transparent to-brand-600/10 rounded-full blur-3xl animate-spin-slow"></div>
                <div className="absolute -inset-12 bg-gradient-to-l from-brand-500/5 via-transparent to-brand-300/5 rounded-full blur-3xl animate-spin-slow-reverse"></div>
                
                {/* Animated border glow */}
                <div className="absolute -inset-6 rounded-2xl border border-brand-400/20 animate-border-glow"></div>
                
                {/* Rotating gradient ring */}
                <div className="absolute -inset-10 rounded-full animate-spin-slow">
                  <div className="w-full h-full rounded-full border-2 border-transparent border-t-brand-400/20 border-r-brand-400/10"></div>
                </div>
                <div className="absolute -inset-14 rounded-full animate-spin-slow-reverse">
                  <div className="w-full h-full rounded-full border-2 border-transparent border-b-brand-400/10 border-l-brand-400/20"></div>
                </div>

                <img
                  src="/images/illustration-dashboard.webp"
                  alt="Project Management Dashboard"
                  className="relative w-80 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-all duration-500 ease-out animate-float-image"
                  style={{ 
                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))',
                  }}
                />
                {/* Decorative ring around image with enhanced animation */}
                <div className="absolute -inset-4 rounded-full border border-brand-400/20 animate-pulse-slow"></div>
                <div className="absolute -inset-8 rounded-full border border-brand-400/10 animate-float-slow"></div>
                <div className="absolute -inset-12 rounded-full border border-brand-300/5 animate-spin-slow"></div>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-brand-500/20 via-transparent to-transparent"></div>
                
                {/* Animated pulse ring on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 rounded-2xl animate-ping-ring border-2 border-brand-400/20"></div>
                </div>
              </div>
              
              <div className="space-y-4 text-center">
                {/* Project Management Slogan with Enhanced Animation */}
                <div className="animate-slide-in">
                  <h2 className="text-3xl font-bold text-white dark:text-white/90 mb-2 animate-gradient-text bg-gradient-to-r from-brand-400 via-white to-brand-400 bg-300% bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                    ProjectPlus
                  </h2>
                  {/* Animated underline */}
                  <div className="relative mx-auto w-20 h-0.5 mt-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent animate-width-expand"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-400/30 to-transparent animate-width-expand-delay"></div>
                  </div>
                  <p className="text-sm font-medium text-brand-300/80 dark:text-brand-400/80 tracking-wider uppercase mb-3 animate-pulse-text">
                    Enterprise Project Management
                  </p>
                  <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-brand-400/50 to-transparent mb-3 animate-width-expand"></div>
                  <p className="text-lg text-gray-300 dark:text-white/60 font-light animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                    <span className="inline-block animate-typing">Streamline. Collaborate. Deliver.</span>
                  </p>
                  <p className="text-sm text-gray-400 dark:text-white/40 font-light mt-1 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                    Manage projects, teams, and tasks all in one place
                  </p>
                </div>

                {/* Animated Features Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 dark:text-white/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-brand-400/30 group">
                    <svg className="w-3 h-3 text-brand-400 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Agile
                  </span>
                 
             
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 dark:text-white/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-brand-400/30 group">
                    <svg className="w-3 h-3 text-brand-400 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Analytics
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 dark:text-white/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-brand-400/30 group">
                    <svg className="w-3 h-3 text-brand-400 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Teams
                  </span>
                </div>

                {/* Admin Login Badge with Enhanced Animation */}
                {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 animate-fade-in-up hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-brand-400/30 group" style={{ animationDelay: '0.8s', opacity: 0 }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot"></span>
                  <span className="text-xs text-gray-300 dark:text-white/50 font-medium group-hover:text-brand-300 transition-colors duration-300">
                    Admin Access
                  </span>
                  <span className="text-xs text-gray-400 dark:text-white/30">•</span>
                  <span className="text-xs text-gray-400 dark:text-white/30 animate-pulse-text">
                    Secure
                  </span>
                  <span className="w-0.5 h-4 bg-white/10"></span>
                  <span className="text-xs text-brand-400/60 group-hover:text-brand-400 transition-colors duration-300 animate-pulse-text">
                    ● Live
                  </span>
                </div> */}

                {/* Animated Bottom Decorative Line */}
                <div className="flex items-center justify-center gap-3 mt-2 animate-fade-in-up" style={{ animationDelay: '1s', opacity: 0 }}>
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-400/30 animate-width-expand-left"></div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400/30 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400/30 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400/30 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400/40 animate-bounce" style={{ animationDelay: '0.45s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400/30 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-400/30 animate-width-expand-right"></div>
                </div>

                {/* Animated version badge */}
                {/* <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s' }}>
                  <span className="text-[10px] text-gray-500 dark:text-white/20 font-mono tracking-wider">
                    v3.2.0 • © 2026 ProjectFlow Inc.
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {children}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          {/* <ThemeTogglerTwo /> */}
        </div>
      </div>

      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 0.6; transform: scale(1.1) translate(-45%, -45%); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float-image {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes width-expand {
          from { width: 0; }
          to { width: 64px; }
        }
        
        @keyframes width-expand-delay {
          from { width: 0; }
          to { width: 64px; }
        }
        
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
        
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        
        @keyframes border-glow {
          0%, 100% { border-color: rgba(99, 102, 241, 0.1); }
          50% { border-color: rgba(99, 102, 241, 0.3); }
        }
        
        @keyframes ping-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes width-expand-left {
          from { width: 0; }
          to { width: 32px; }
        }
        
        @keyframes width-expand-right {
          from { width: 0; }
          to { width: 32px; }
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 8s ease infinite;
          background-size: 400% 400%;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animate-gradient-text {
          animation: gradient-text 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        
        .animate-float-image {
          animation: float-image 3s ease-in-out infinite;
        }
        
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
        
        .animate-width-expand {
          animation: width-expand 1s ease-out forwards;
          animation-delay: 0.4s;
        }
        
        .animate-width-expand-delay {
          animation: width-expand 1s ease-out forwards;
          animation-delay: 0.6s;
        }
        
        .animate-pulse-dot {
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-grid-pulse {
          animation: grid-pulse 4s ease-in-out infinite;
        }
        
        .animate-border-glow {
          animation: border-glow 3s ease-in-out infinite;
        }
        
        .animate-ping-ring {
          animation: ping-ring 1.5s ease-out infinite;
        }
        
        .animate-typing {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2s steps(30) forwards;
          animation-delay: 0.3s;
          width: 0;
        }
        
        .animate-width-expand-left {
          animation: width-expand-left 0.8s ease-out forwards;
          animation-delay: 0.8s;
        }
        
        .animate-width-expand-right {
          animation: width-expand-right 0.8s ease-out forwards;
          animation-delay: 0.8s;
        }
        
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  );
}
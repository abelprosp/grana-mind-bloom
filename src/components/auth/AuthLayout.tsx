
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      
      {/* Right side - Brand/Visual */}
      <div className="hidden md:block md:flex-1 bg-gradient-to-br from-orange-600 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="text-center p-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4 inline-block">
              <div className="text-white text-5xl font-bold">GM</div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">GranaMind</h2>
            <p className="text-white/80 text-xl max-w-md">
              Transforme seus hábitos financeiros e alcance seus objetivos com ciência e praticidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

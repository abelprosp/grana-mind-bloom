
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute left-1/4 bottom-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
      </div>
      <div className="container-content flex flex-col items-center text-center">
        <h1 className="gradient-text max-w-4xl mb-6">
          Domine sua mente. Controle seu dinheiro.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Uma nova forma de poupar, planejar e conquistar liberdade financeira com ciência e estilo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="text-md px-8 py-6">
            <Link to="/signup">Criar conta grátis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-md px-8 py-6">
            <Link to="/#how-it-works">Como funciona?</Link>
          </Button>
        </div>
        <div className="mt-12 md:mt-16 relative w-full max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=80" 
            alt="GranaMind Dashboard Preview" 
            className="w-full h-auto rounded-lg shadow-2xl border"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

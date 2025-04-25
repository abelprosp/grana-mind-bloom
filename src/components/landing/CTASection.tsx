
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container-content">
        <div className="bg-orange-600 text-white rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-white mb-4">Pronto para dominar suas finanças?</h2>
            <p className="text-white/80 text-lg mb-8">
              Junte-se a milhares de jovens que estão transformando seus hábitos financeiros e conquistando seus objetivos.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <Link to="/signup">Começar agora - é grátis!</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

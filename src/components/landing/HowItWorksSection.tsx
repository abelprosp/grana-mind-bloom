
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Registre-se em segundos',
    description: 'Crie sua conta gratuitamente e configure seu perfil financeiro inicial.'
  },
  {
    number: '02',
    title: 'Configure seus objetivos',
    description: 'Defina suas metas financeiras e os hábitos que deseja desenvolver.'
  },
  {
    number: '03',
    title: 'Acompanhe seu progresso',
    description: 'Visualize sua evolução e receba insights personalizados para melhorar.'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted">
      <div className="container-content">
        <div className="text-center mb-16">
          <h2 className="mb-4">Como funciona?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Três passos simples para transformar sua vida financeira.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative"
            >
              <div className="flex flex-col items-center md:items-start">
                <div className="text-4xl font-bold text-orange-600 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-center md:text-left">{step.description}</p>
              </div>
              
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-6 w-12 border-t-2 border-dashed border-orange-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

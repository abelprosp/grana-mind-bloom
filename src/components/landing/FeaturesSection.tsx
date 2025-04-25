
import React from 'react';
import { Wallet, Target, Trending, Heart } from 'lucide-react';

const features = [
  {
    icon: <Wallet className="h-8 w-8 text-orange-600" />,
    title: 'Controle seus gastos',
    description: 'Acompanhe e analise seus gastos diários, mensais e anuais de forma intuitiva e visual.'
  },
  {
    icon: <Target className="h-8 w-8 text-orange-600" />,
    title: 'Metas com propósito',
    description: 'Crie e alcance metas financeiras que fazem sentido para sua realidade e seus sonhos.'
  },
  {
    icon: <Trending className="h-8 w-8 text-orange-600" />,
    title: 'Hábitos financeiros',
    description: 'Desenvolva rotinas de economia e investimento de forma divertida e sustentável.'
  },
  {
    icon: <Heart className="h-8 w-8 text-orange-600" />,
    title: 'Dicas científicas',
    description: 'Receba insights personalizados baseados em psicologia comportamental e economia.'
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="mb-4">O que você vai conseguir?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas cientificamente desenvolvidas para transformar sua relação com dinheiro.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
            >
              <div className="p-3 rounded-full bg-orange-100 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

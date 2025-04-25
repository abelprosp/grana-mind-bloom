
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

// Sample financial tips
const tips = [
  {
    id: 1,
    title: "Regra dos 50/30/20 para seu orçamento",
    content: "Divida sua renda em 50% para necessidades básicas, 30% para desejos e 20% para poupança e investimentos.",
    source: "Economia Comportamental"
  },
  {
    id: 2,
    title: "Automação para poupar sem perceber",
    content: "Configure transferências automáticas para sua conta de poupança no dia do pagamento para criar o hábito sem esforço.",
    source: "Psicologia do Consumo"
  },
  {
    id: 3,
    title: "Avalie compras com a regra das 24h",
    content: "Espere 24 horas antes de realizar compras não essenciais acima de R$100 para evitar decisões impulsivas.",
    source: "Economia Comportamental"
  },
];

const FinancialTip: React.FC = () => {
  // For demo purposes, we'll just show a random tip
  const randomIndex = Math.floor(Math.random() * tips.length);
  const tip = tips[randomIndex];

  return (
    <Card className="bg-accent border-orange-200">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold mb-2">{tip.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{tip.content}</p>
            <div className="flex items-center">
              <div className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                {tip.source}
              </div>
            </div>
          </div>
          <button className="mt-1 p-1.5 rounded-full hover:bg-muted transition-colors">
            <Heart size={18} className="text-orange-600" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialTip;

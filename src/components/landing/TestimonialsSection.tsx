
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    content: "GranaMind mudou minha relação com dinheiro. Finalmente consegui economizar para minha primeira viagem internacional!",
    author: "Marina Silva",
    role: "Designer, 24 anos",
    avatar: "/placeholder.svg"
  },
  {
    content: "A gamificação da poupança me motivou a criar um fundo de emergência pela primeira vez. Simples e impactante.",
    author: "Paulo Mendes",
    role: "Desenvolvedor, 26 anos",
    avatar: "/placeholder.svg"
  },
  {
    content: "As dicas diárias baseadas em economia comportamental me ajudaram a reduzir gastos impulsivos. Recomendo!",
    author: "Juliana Costa",
    role: "Professora, 28 anos",
    avatar: "/placeholder.svg"
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="mb-4">O que dizem nossos usuários</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de pessoas que estão transformando suas finanças.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border bg-card flex flex-col h-full"
            >
              <div className="mb-4 flex-grow">
                <p className="italic text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
              </div>
              <div className="flex items-center mt-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback>{testimonial.author.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

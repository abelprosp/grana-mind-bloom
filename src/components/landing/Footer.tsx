
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-600 text-white p-1 rounded-md font-bold">GM</div>
              <span className="font-bold text-xl">GranaMind</span>
            </div>
            <p className="text-muted-foreground">
              Repensando a forma como a geração Z gerencia suas finanças.
            </p>
          </div>
          
          
          
         
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-foreground">Termos de Serviço</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground">Política de Privacidade</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GranaMind. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

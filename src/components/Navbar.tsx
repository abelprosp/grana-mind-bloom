
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b">
      <div className="container-content flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-orange-600 text-white p-1 rounded-md font-bold">GM</div>
          <span className="font-bold text-xl text-orange-600">GranaMind</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link to="/#features" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Features
          </Link>
          <Link to="/#how-it-works" className="text-sm font-medium hover:text-orange-600 transition-colors">
            How it Works
          </Link>
          <Link to="/#testimonials" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Testimonials
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Criar Conta Grátis</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t animate-fade-in">
          <div className="container-content py-4 flex flex-col space-y-4">
            <Link 
              to="/#features" 
              className="text-sm font-medium p-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/#how-it-works" 
              className="text-sm font-medium p-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              to="/#testimonials" 
              className="text-sm font-medium p-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link to="/signup">Criar Conta Grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

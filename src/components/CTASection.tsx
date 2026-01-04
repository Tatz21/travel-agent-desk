import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  transparent?: boolean;
}

const CTASection = ({ transparent = false }: CTASectionProps) => {
  const navigate = useNavigate();

  if (transparent) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div 
          className="bg-background/10 backdrop-blur-md border border-primary-foreground/20 rounded-2xl p-8 md:p-12 text-center animate-scale-in"
          style={{ animationDelay: '0.10s', animationFillMode: 'both' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif text-primary">
            Ready to Transform Your Travel Business?
          </h2>
          <p className="text-lg text-primary mb-6 max-w-2xl mx-auto">
            Join Phoenix Travelopedia today and start earning commissions on every booking.
          </p>
          <Button variant="default" size="sm" onClick={() => navigate('/register')} > Create Agent Account </Button>
          <p className="text-sm text-primary mt-4">
            No credit card required • Free to get started
          </p>
        </div>
      </div>
    );
  }
};

export default CTASection;

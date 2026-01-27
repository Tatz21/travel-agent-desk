import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, MapPin, Headphones } from "lucide-react";

const HeroContent = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-primary text-lg md:text-xl mb-4 font-serif font-bold italic tracking-[0.3em] animate-fade-in-down relative inline-block">
          WELCOME TO
        </p>
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground drop-shadow-lg animate-fade-in-up font-serif"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          Phoenix Travelopedia
        </h1>
        <p 
          className="text-3xl sm:text-4xl md:text-5xl font-script text-foreground mb-8 drop-shadow-md animate-fade-in"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          Discover Incredible India
        </p>
      </div>
      
      <p 
        className="text-lg md:text-xl text-black mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md animate-fade-in-up"
        style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
      >
        Your trusted travel booking platform across India. Book flights, buses, and hotels effortlessly while earning competitive commissions as a verified travel agent. Grow your travel business with Phoenix Travelopedia.
      </p>
      
      <div 
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up"
        style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
      >
        <Button variant="default" size="lg" onClick={() => navigate('/register')}
        > Start Your Journey </Button>
        <Button variant="default" size="lg" onClick={() => navigate('/about')}
        > Learn More </Button>
      </div>

      {/* Quick Stats */}
      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-background/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-border animate-scale-in"
        style={{ animationDelay: '1s', animationFillMode: 'both' }}
      >
        {/* Box 1 */}
        <div className="bg-white rounded-2xl shadow-md border border-border p-6 text-center hover:scale-110 transition-transform duration-300 flex flex-col items-center group">
          <Users className="w-8 h-8 text-primary mb-3 group-hover:animate-bounce transition-transform" />
          <p className="text-sm font-medium text-foreground/70">
            Extensive Agents Network
          </p>
        </div>

        {/* Box 2 */}
        <div 
          className="bg-white rounded-2xl shadow-md border border-border p-6 text-center hover:scale-110 transition-transform duration-300 flex flex-col items-center group"
          style={{ animationDelay: '0.1s' }}
        >
          <CreditCard className="w-8 h-8 text-primary mb-3 group-hover:animate-bounce transition-transform" />
          <p className="text-sm font-medium text-foreground/70">
            Fast & Reliable Transaction Processing
          </p>
        </div>

        {/* Box 3 */}
        <div 
          className="bg-white rounded-2xl shadow-md border border-border p-6 text-center hover:scale-110 transition-transform duration-300 flex flex-col items-center group"
          style={{ animationDelay: '0.2s' }}
        >
          <MapPin className="w-8 h-8 text-primary mb-3 group-hover:animate-bounce transition-transform" />
          <p className="text-sm font-medium text-foreground/70">
            Serving Multiple Destinations
          </p>
        </div>

        {/* Box 4 */}
        <div 
          className="bg-white rounded-2xl shadow-md border border-border p-6 text-center hover:scale-110 transition-transform duration-300 flex flex-col items-center group"
          style={{ animationDelay: '0.3s' }}
        >
          <Headphones className="w-8 h-8 text-primary mb-3 group-hover:animate-bounce transition-transform" />
          <p className="text-sm font-medium text-foreground/70">
            24/7 Dedicated Customer Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;

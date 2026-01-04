import { UserPlus, LayoutDashboard, CreditCard, CheckCircle, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register",
    description: "Begin by registering as an authorized travel partner with Phoenix Travelopedia. Complete a simple verification process to gain access to our advanced B2B travel booking platform.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Login",
    description: "Log in to your personalized and secure agent dashboard to manage bookings, view real-time B2B rates, track commissions, download MIS reports, and maintain customer records—all from a single interface.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Booking",
    description: " Search and book domestic and international flights, bus tickets, and hotels at competitive B2B pricing. Benefit from real-time availability, instant confirmations, and a seamless booking experience.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Earn",
    description: "Generate consistent income with attractive commissions on every confirmed booking. Enjoy complete transparency with detailed reports and timely payouts.",
    gradient: "from-amber-500 to-orange-600",
  },
];

const RoadmapSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #57ADC7 1%, hsl(var(--primary)) 100%)'
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary-foreground/10 text-primary-foreground rounded-full border border-primary-foreground/20 backdrop-blur-sm">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-foreground mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-primary-foreground/70 text-lg">
            Start your journey in four simple steps and unlock unlimited earning potential
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative group"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`
                  }}
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className="absolute top-16 left-[60%] w-[80%] h-[2px] hidden lg:block"
                      style={{
                        background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.3) 0%, hsla(0, 0%, 100%, 0.1) 100%)',
                        opacity: isVisible ? 1 : 0,
                        transition: `opacity 0.5s ease ${0.8 + index * 0.15}s`
                      }}
                    >
                      <ArrowRight 
                        className="absolute -right-3 -top-[11px] w-6 h-6 text-primary-foreground/40"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transition: `opacity 0.5s ease ${1 + index * 0.15}s`
                        }}
                      />
                    </div>
                  )}

                  {/* Card */}
                  <div className="relative bg-primary-foreground/5 backdrop-blur-xl rounded-3xl p-8 border border-primary-foreground/10 transition-all duration-500 hover:bg-primary-foreground/10 hover:border-primary-foreground/20 hover:-translate-y-2 hover:shadow-2xl group-hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-primary-foreground text-primary font-bold text-lg flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      {step.step}
                    </div>

                    {/* Icon Container */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold font-serif text-primary-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-primary-foreground text-sm leading-relaxed group-hover:text-primary-foreground transition-colors duration-300">
                      {step.description}
                    </p>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className="relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.12}s`
                }}
              >
                <div className="flex gap-6 items-start bg-primary-foreground/5 backdrop-blur-xl rounded-2xl p-6 border border-primary-foreground/10">
                  {/* Icon & Step */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs font-bold text-primary-foreground/40 tracking-wider">STEP</span>
                      <div className="text-xl font-bold text-primary-foreground">{step.step}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold font-serif text-primary-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed group-hover:text-primary-foreground transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Vertical Connector */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute left-[2.5rem] top-full w-[2px] h-6 bg-gradient-to-b from-primary-foreground/30 to-transparent"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.5s ease ${0.5 + index * 0.12}s`
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-primary-foreground/60 mb-6 text-lg">Ready to get started?</p>
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => navigate('/register')}>
            Begin Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
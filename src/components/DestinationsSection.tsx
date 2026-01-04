import { useState } from "react";
import { MapPin, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const categories = ["All", "Heritage", "Beach", "Hill Station", "Spiritual", "Wildlife", "Adventure"];

const destinations = [
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    tagline: "The Pink City",
    rating: 4.8,
    tours: 45,
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    tagline: "Sun, Sand & Sea",
    rating: 4.7,
    tours: 62,
  },
  {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    category: "Hill Station",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    tagline: "Valley of Gods",
    rating: 4.9,
    tours: 38,
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    tagline: "The Holy City",
    rating: 4.6,
    tours: 28,
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80",
    tagline: "City of Lakes",
    rating: 4.8,
    tours: 52,
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    state: "Kerala",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
    tagline: "God's Own Country",
    rating: 4.9,
    tours: 41,
  },
  {
    id: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    category: "Hill Station",
    image: "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&q=80",
    tagline: "Queen of Hills",
    rating: 4.5,
    tours: 33,
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
    tagline: "Yoga Capital",
    rating: 4.7,
    tours: 29,
  },
  {
    id: "ladakh",
    name: "Ladakh",
    state: "Ladakh",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tagline: "Land of High Passes",
    rating: 4.9,
    tours: 24,
  },
  {
    id: "ranthambore",
    name: "Ranthambore",
    state: "Rajasthan",
    category: "Wildlife",
    image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
    tagline: "Tiger Territory",
    rating: 4.6,
    tours: 18,
  },
  {
    id: "andaman",
    name: "Andaman Islands",
    state: "Andaman & Nicobar",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
    tagline: "Tropical Paradise",
    rating: 4.8,
    tours: 35,
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    tagline: "City of Taj",
    rating: 4.7,
    tours: 48,
  },
];

const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinations.filter((d) => {
    const matchesCategory = activeCategory === "All" || d.category === activeCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80')" }}        
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/50 to-background/90">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary-foreground/10 text-primary-foreground rounded-full border border-primary-foreground/20">
            Destinations
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary mb-6">
            Explore Incredible India
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Phoenix Travelopedia enables travel agents to book these high-demand routes instantly with real-time pricing and reliable airline partners.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 mt-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredDestinations.length}</span> destinations
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination, index) => (
              <Link 
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="group"
              >
                <Card 
                  className="overflow-hidden border-border/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 to-transparent" />
                    <span className="absolute top-4 left-4 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {destination.category}
                    </span>
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {destination.rating}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold font-serif text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      {destination.state}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-primary font-medium italic">
                        "{destination.tagline}"
                      </p>
                      <span className="text-xs text-muted-foreground">{destination.tours} tours</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No destinations found matching your criteria</p>
              <Button variant="outline" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            We have access to thousands more destinations. Contact our team for custom packages and special requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Contact Our Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary hover:bg-primary-foreground/10">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Destinations;

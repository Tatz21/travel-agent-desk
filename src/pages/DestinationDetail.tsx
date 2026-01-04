import { useParams, Link, Navigate } from "react-router-dom";
import { MapPin, ArrowRight, ArrowLeft, Calendar, Sun, CloudRain, Star, Users, Camera, Utensils, Hotel, Castle, Wind, Landmark, Mountain, LucideIcon, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import { useEffect } from "react";

const destinationsData: Record<string, {
  name: string;
  state: string;
  category: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  highlights: { title: string; icon: LucideIcon; description: string[] }[];
  bestTime: string;
  weather: { summer: string; winter: string; monsoon: string };
  attractions: { name: string; type: string; image: string }[];
  packages: { name: string; duration: string; price: string; highlights: string[] }[];
}> = {
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    tagline: "The Pink City",
    description: "Known as the Pink City of India, Jaipur is a majestic blend of royal grandeur, architectural brilliance, and vibrant culture. As the capital of Rajasthan, Jaipur showcases centuries of Rajputana legacy through its magnificent palaces, grand forts, colorful bazaars, and time-honored traditions.",
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80",
      "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=800&q=80"
    ],
    highlights: [
      {
        title: "Amber Fort – Symbol of Rajput Valor",
        icon: Castle,
        description: [
          "UNESCO World Heritage Site",
          "Massive fort overlooking Maota Lake",
          "Stunning blend of Hindu and Mughal architecture",
          "Famous Sheesh Mahal (Mirror Palace)"
        ]
      },
      {
        title: "Hawa Mahal – Palace of Winds",
        icon: Wind,
        description: [
          "Iconic pink sandstone façade",
          "Designed for royal women to observe city life",
          "900+ lattice windows ensuring natural ventilation",
          "One of India's most photographed landmarks"
        ]
      },
      {
        title: "City Palace – Heart of Jaipur Royalty",
        icon: Landmark,
        description: [
          "Former royal residence of the Maharajas",
          "Elegant courtyards, museums, and royal artifacts",
          "Showcases traditional Rajasthani and Mughal design",
          "Still home to the royal family"
        ]
      },
      {
        title: "Nahargarh Fort – Panoramic City Views",
        icon: Mountain,
        description: [
          "Located atop the Aravalli Hills",
          "Offers breathtaking sunset and night views of Jaipur",
          "Once served as a defense retreat for the city",
          "Popular for photography and evening visits"
        ]
      }
    ],
    bestTime: "October to March",
    weather: {
      summer: "35-45°C - Hot and dry",
      winter: "8-22°C - Pleasant and ideal",
      monsoon: "25-35°C - Moderate rainfall"
    },
    attractions: [
      { name: "Hawa Mahal", type: "Monument", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80" },
      { name: "Amber Fort", type: "Fort", image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400&q=80" },
      { name: "City Palace", type: "Palace", image: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=400&q=80" },
      { name: "Nahargarh Fort", type: "Fort", image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&q=80" }
    ],
    packages: [
      {
        name: "Royal Jaipur Explorer",
        duration: "3 Days / 2 Nights",
        price: "₹8,999",
        highlights: ["Amber Fort Visit", "City Palace Tour", "Traditional Dinner", "Shopping Tour"]
      },
      {
        name: "Heritage & Culture Tour",
        duration: "5 Days / 4 Nights",
        price: "₹15,999",
        highlights: ["All Major Forts", "Cooking Class", "Village Safari", "Elephant Ride"]
      }
    ]
  },
  goa: {
    name: "Goa",
    state: "Goa",
    category: "Beach",
    tagline: "Endless Waves & Night Beats",
    description: "Goa is India's ultimate beach paradise, celebrated for its sun-drenched shores, laid-back tropical vibes, and legendary nightlife. Located along the Arabian Sea, Goa blends Portuguese heritage, vibrant beach culture, thrilling water sports, and buzzing party scenes into one unforgettable destination. From serene sunsets and palm-lined beaches to lively shacks, music festivals, and nightlife hotspots, Goa offers a perfect balance of relaxation and excitement for every traveler. Every beach in Goa has its own personality—making it one of India's most diverse and dynamic coastal destinations.",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
      "https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80"
    ],
    highlights: [
      {
        title: "Baga & Calangute – Lively Beach Vibes",
        icon: Users,
        description: [
          "Explore famous beaches like Baga, Calangute, and Palolem",
          "Known as the most happening beaches in North Goa",
          "Water sports like parasailing, jet skiing, and banana rides",
          "Beach shacks, clubs, and nightlife hubs",
          "Perfect for fun-loving and first-time visitors"
        ]
      },
      {
        title: "Anjuna & Vagator – Bohemian & Scenic",
        icon: Camera,
        description: [
          "Famous for cliffside views and stunning sunsets",
          "Popular among backpackers and party lovers",
          "Iconic Anjuna Flea Market and Vagator viewpoints",
          "Home to trance parties and beach festivals"
        ]
      },
      {
        title: "Palolem & Colva – Peaceful South Goa",
        icon: Moon,
        description: [
          "Calm waters and crescent-shaped shorelines",
          "Ideal for couples and relaxation seekers",
          "Kayaking, dolphin spotting, and yoga retreats",
          "Quiet beaches with fewer crowds"
        ]
      },
      {
        title: "Candolim & Morjim – Elegant & Serene",
        icon: Moon,
        description: [
          "Calm waters and crescent-shaped shorelines",
          "Ideal for couples and relaxation seekers",
          "Kayaking, dolphin spotting, and yoga retreats",
          "Quiet beaches with fewer crowds"
        ]
      },

{
        title: "Adventure & Water Experiences",
        icon: Moon,
        description: [
          "Scuba diving and snorkeling",
          "Parasailing and jet skiing",
          "Dolphin cruises",
          "Sunset boat rides on the Mandovi River"
        ]
      },

      {
        title: "Water Sports",
        icon: Star,
        description: ["Parasailing, jet skiing, scuba diving, and banana rides"]
      },
      {
        title: "Old Goa Churches",
        icon: Landmark,
        description: ["UNESCO World Heritage Portuguese architecture"]
      },
      {
        title: "Spice Plantations",
        icon: Utensils,
        description: ["Aromatic tours through lush tropical spice gardens"]
      }
    ],
    bestTime: "November to February",
    weather: {
      summer: "30–35°C - Hot and humid",
      winter: "20–32°C - Perfect beach weather",
      monsoon: "25–30°C - Heavy rainfall, lush greenery"
    },
    attractions: [
      { name: "Baga Beach", type: "Beach", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80" },
      { name: "Basilica of Bom Jesus", type: "Church", image: "https://images.unsplash.com/photo-1587922546307-776227941871?w=400&q=80" },
      { name: "Dudhsagar Falls", type: "Waterfall", image: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&q=80" },
      { name: "Fort Aguada", type: "Fort", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80" }
    ],
    packages: [
      {
        name: "Beach Bliss Package",
        duration: "4 Days / 3 Nights",
        price: "₹12,999",
        highlights: ["Beach Resort Stay", "Water Sports", "Cruise Dinner", "North Goa Tour"]
      },
      {
        name: "Complete Goa Experience",
        duration: "6 Days / 5 Nights",
        price: "₹22,999",
        highlights: ["North & South Goa", "Spice Plantation", "Beach Activities", "Cultural Tours"]
      }
    ]
  }
};

const defaultDestination = {
  name: "Destination",
  state: "India",
  category: "Travel",
  tagline: "Discover India",
  description: "Explore this amazing destination and create unforgettable memories.",
  heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  gallery: [],
  highlights: [],
  bestTime: "Year-round",
  weather: { summer: "Varies", winter: "Varies", monsoon: "Varies" },
  attractions: [],
  packages: []
};

const DestinationDetail = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { destinationId } = useParams();
  const destination = destinationsData[destinationId as string] || defaultDestination;

  if (!destinationId) {
    return <Navigate to="/destinations" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollToTop />

      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto pt-16">
          <Link to="/destinations">
            <Button variant="outline" className="inline-flex items-center gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Destinations
            </Button>
          </Link>

          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/90 text-primary-foreground rounded-full">
              {destination.category}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-primary mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-primary text-lg mb-6">
              <MapPin className="w-5 h-5" />
              {destination.state}, India
            </div>
            <p className="text-xl text-primary italic font-serif">
              "{destination.tagline}"
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border/50 shadow-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                  <p className="font-semibold text-foreground">{destination.bestTime}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 shadow-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Summer</p>
                  <p className="font-semibold text-foreground">{destination.weather.summer}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 shadow-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <CloudRain className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Winter</p>
                  <p className="font-semibold text-foreground">{destination.weather.winter}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-6">
                About {destination.name}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {destination.description}
              </p>
              <h3 className="text-xl font-bold font-serif text-foreground mb-4">Highlights</h3>

              {destination.highlights.length > 0 && (
                <div className="space-y-6">
                  {destination.highlights.map((highlight) => {
                    const Icon = highlight.icon;
                    return (
                      <div key={highlight.title} className="flex gap-4">
                        <Icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground">{highlight.title}</h4>
                          <ul className="list-disc pl-5 mt-2 text-muted-foreground text-sm space-y-1">
                            {highlight.description.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {destination.gallery.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={destination.gallery[0]}
                  alt={`${destination.name} gallery 1`}
                  className="col-span-2 rounded-2xl h-48 object-cover w-full"
                />
                {destination.gallery.slice(1, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${destination.name} gallery ${idx + 2}`}
                    className="rounded-2xl h-40 object-cover w-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {destination.attractions.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-8 text-center">
              Top Attractions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destination.attractions.map((attraction) => (
                <Card key={attraction.name} className="overflow-hidden border-border/50 group hover:shadow-xl transition-all duration-300">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <span className="text-xs text-primary font-medium">{attraction.type}</span>
                    <h3 className="font-bold text-foreground">{attraction.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {destination.packages.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-8 text-center">
              Popular Packages
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {destination.packages.map((pkg) => (
                <Card key={pkg.name} className="border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-foreground">{pkg.name}</h3>
                        <p className="text-muted-foreground text-sm">{pkg.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      {pkg.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {h}
                        </div>
                      ))}
                    </div>
                    <Link to="/contact">
                      <Button className="w-full">
                        Enquire Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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

      <Footer />
    </div>
  );
};

export default DestinationDetail;
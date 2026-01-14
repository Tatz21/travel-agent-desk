import { useParams, Link } from "react-router-dom";
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import FeedbackSection from "@/components/FeedbackSection";
import { useEffect } from "react";

const blogPosts = {
  "top-10-destinations-india": {
    title: "Top 10 Must-Visit Destinations in India for 2024",
    excerpt: "Discover the most breathtaking destinations across India that should be on every traveler's bucket list this year.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
    category: "Travel Guide",
    author: "Priya Sharma",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    date: "January 15, 2024",
    readTime: "5 min read",
    content: `
      <p>India, a land of diverse cultures, breathtaking landscapes, and rich history, offers travelers an unparalleled experience. From the snow-capped peaks of the Himalayas to the serene backwaters of Kerala, every corner of this incredible country has something unique to offer.</p>

      <h2>1. Taj Mahal, Agra</h2>
      <p>No list of Indian destinations would be complete without the iconic Taj Mahal. This UNESCO World Heritage site, built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, is a testament to eternal love and Mughal architecture at its finest.</p>

      <h2>2. Jaipur, Rajasthan</h2>
      <p>Known as the Pink City, Jaipur captivates visitors with its stunning palaces, vibrant bazaars, and rich cultural heritage. Don't miss the Amber Fort, City Palace, and the iconic Hawa Mahal.</p>

      <h2>3. Kerala Backwaters</h2>
      <p>Experience tranquility like never before as you cruise through the serene backwaters of Kerala on a traditional houseboat. The lush green landscapes and peaceful waters make this a perfect retreat.</p>

      <h2>4. Varanasi, Uttar Pradesh</h2>
      <p>One of the world's oldest continuously inhabited cities, Varanasi offers a profound spiritual experience. Witness the mesmerizing Ganga Aarti ceremony and explore the ancient ghats along the sacred Ganges River.</p>

      <h2>5. Ladakh</h2>
      <p>For adventure seekers, Ladakh offers breathtaking landscapes, ancient monasteries, and some of the most challenging mountain passes in the world. The Pangong Lake and Nubra Valley are must-visit destinations.</p>

      <h2>6. Goa</h2>
      <p>India's smallest state packs a punch with its beautiful beaches, Portuguese heritage, vibrant nightlife, and delicious seafood. Whether you seek relaxation or adventure, Goa has it all.</p>

      <h2>7. Udaipur, Rajasthan</h2>
      <p>The City of Lakes enchants visitors with its romantic ambiance, stunning palaces reflected in tranquil waters, and rich Rajput heritage. The City Palace and Lake Pichola are iconic landmarks.</p>

      <h2>8. Darjeeling, West Bengal</h2>
      <p>Nestled in the foothills of the Himalayas, Darjeeling offers stunning views of Kanchenjunga, world-famous tea gardens, and the historic toy train. A perfect escape from the summer heat.</p>

      <h2>9. Hampi, Karnataka</h2>
      <p>Step back in time at this UNESCO World Heritage site, where the ruins of the Vijayanagara Empire stand testament to India's glorious past. The boulder-strewn landscape adds to its mystical charm.</p>

      <h2>10. Andaman Islands</h2>
      <p>For beach lovers and diving enthusiasts, the Andaman Islands offer pristine beaches, crystal-clear waters, and vibrant coral reefs. Havelock Island and Neil Island are particularly popular.</p>

      <h2>Planning Your Trip</h2>
      <p>When planning your Indian adventure, consider the best time to visit each destination. India's diverse climate means that different regions are best visited at different times of the year. October to March is generally considered the best time for most destinations.</p>

      <p>Book your journey with Phoenix Travelopedia for curated experiences and expert guidance throughout your Indian adventure. Our team of experienced travel consultants will help you create memories that last a lifetime.</p>
    `,
  },
  "kerala-backwaters-guide": {
    title: "A Complete Guide to Kerala Backwaters",
    excerpt: "Experience the serene beauty of Kerala's backwaters with our comprehensive travel guide.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80",
    category: "Destinations",
    author: "Rahul Menon",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    date: "January 10, 2024",
    readTime: "7 min read",
    content: `
      <p>Kerala's backwaters are one of India's most unique and enchanting travel experiences. This network of interconnected canals, rivers, lakes, and inlets stretches along the coast of Kerala, offering visitors a glimpse into a way of life that has remained unchanged for centuries.</p>

      <h2>What are the Kerala Backwaters?</h2>
      <p>The backwaters of Kerala comprise over 900 kilometers of waterways, formed by the convergence of freshwater from rivers and saltwater from the Arabian Sea. Five large lakes are connected by a network of canals, both natural and man-made.</p>

      <h2>Best Time to Visit</h2>
      <p>The ideal time to visit the Kerala backwaters is from November to February when the weather is pleasant with minimal rainfall. September and October are also good months, though occasional showers may occur.</p>

      <h2>Houseboat Experience</h2>
      <p>A houseboat cruise is the quintessential backwater experience. These traditional boats, known as 'kettuvallams', have been converted into floating hotels with modern amenities. Spend a night or two cruising through the serene waters while enjoying traditional Kerala cuisine.</p>

      <h2>Popular Backwater Destinations</h2>
      <p><strong>Alleppey (Alappuzha):</strong> Known as the Venice of the East, Alleppey is the most popular starting point for houseboat cruises.</p>
      <p><strong>Kumarakom:</strong> A cluster of islands on Vembanad Lake, known for its bird sanctuary and luxury resorts.</p>
      <p><strong>Kollam:</strong> Offers longer backwater routes and is less crowded than Alleppey.</p>

      <p>Let Phoenix Travelopedia help you plan the perfect Kerala backwater experience with carefully curated packages that showcase the best of God's Own Country.</p>
    `,
  },
  "rajasthan-royal-heritage": {
    title: "Exploring Rajasthan's Royal Heritage",
    excerpt: "Step back in time and explore the magnificent palaces, forts, and rich cultural heritage of Rajasthan.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80",
    category: "Culture",
    author: "Amit Singh",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    date: "January 5, 2024",
    readTime: "6 min read",
    content: `
      <p>Rajasthan, the Land of Kings, is a treasure trove of magnificent forts, opulent palaces, and a rich cultural heritage that continues to captivate travelers from around the world.</p>

      <h2>The Golden Triangle and Beyond</h2>
      <p>While Jaipur forms part of India's famous Golden Triangle, Rajasthan offers much more than just the Pink City. From the blue streets of Jodhpur to the golden dunes of Jaisalmer, each city tells its own royal story.</p>

      <h2>Must-Visit Forts and Palaces</h2>
      <p>The state is home to some of India's most impressive architectural marvels, including the Mehrangarh Fort in Jodhpur, the Amber Fort in Jaipur, and the Udaipur City Palace.</p>

      <p>Experience the royal heritage of Rajasthan with Phoenix Travelopedia's specially designed heritage tours.</p>
    `,
  },
  "himalayan-trekking-tips": {
    title: "Essential Tips for Himalayan Trekking",
    excerpt: "Planning a trek in the Himalayas? Here's everything you need to know about preparation, gear, and safety.",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
    category: "Adventure",
    author: "Vikram Thapa",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    date: "December 28, 2023",
    readTime: "8 min read",
    content: `
      <p>Trekking in the Himalayas is a dream for many adventure enthusiasts. The world's highest mountain range offers trails for every skill level, from easy walks to challenging expeditions.</p>

      <h2>Choosing the Right Trek</h2>
      <p>The Himalayas offer treks ranging from easy beginner trails to challenging high-altitude expeditions. Popular options include the Valley of Flowers, Roopkund, and the Markha Valley trek.</p>

      <h2>Physical Preparation</h2>
      <p>Start training at least 2-3 months before your trek. Focus on cardiovascular exercises, strength training, and practice hikes with a weighted backpack.</p>

      <h2>Essential Gear</h2>
      <p>Invest in quality trekking boots, layered clothing, a good sleeping bag, and don't forget essentials like sunscreen, sunglasses, and a first-aid kit.</p>

      <p>Join one of Phoenix Travelopedia's guided Himalayan treks for a safe and memorable adventure experience.</p>
    `,
  },
  "goa-beyond-beaches": {
    title: "Goa Beyond Beaches: Hidden Gems to Explore",
    excerpt: "While Goa is famous for its beaches, there's so much more to discover.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80",
    category: "Destinations",
    author: "Sneha Fernandes",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    date: "December 20, 2023",
    readTime: "5 min read",
    content: `
      <p>While Goa's beaches are world-famous, this small state has so much more to offer. From Portuguese heritage sites to spice plantations and wildlife sanctuaries, discover Goa's hidden treasures.</p>

      <h2>Old Goa's Churches</h2>
      <p>Explore the UNESCO World Heritage churches of Old Goa, including the Basilica of Bom Jesus, which houses the remains of St. Francis Xavier.</p>

      <h2>Spice Plantations</h2>
      <p>Visit the aromatic spice plantations in the hinterlands of Goa. Learn about various spices, enjoy traditional Goan meals, and take a refreshing elephant bath.</p>

      <p>Discover the unexplored side of Goa with Phoenix Travelopedia's comprehensive Goa packages.</p>
    `,
  },
  "indian-street-food-journey": {
    title: "A Culinary Journey Through Indian Street Food",
    excerpt: "From Mumbai's vada pav to Delhi's chaat, embark on a flavorful journey through India's diverse street food culture.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1920&q=80",
    category: "Food & Culture",
    author: "Ananya Gupta",
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    date: "December 15, 2023",
    readTime: "6 min read",
    content: `
      <p>Indian street food is a culinary adventure like no other. Each region boasts its own unique flavors, techniques, and specialties that have been perfected over generations.</p>

      <h2>Mumbai's Street Food Scene</h2>
      <p>From the iconic vada pav to pav bhaji and bhel puri, Mumbai's street food is legendary. The city's diverse population has created a melting pot of flavors.</p>

      <h2>Delhi's Chaat Culture</h2>
      <p>Delhi is the chaat capital of India. Golgappas, aloo tikki, and papdi chaat are just a few of the tangy, spicy delights you'll find on every street corner.</p>

      <p>Add a food tour to your India trip with Phoenix Travelopedia and taste the authentic flavors of India.</p>
    `,
  },
};

const relatedPosts = [
  {
    id: "kerala-backwaters-guide",
    title: "A Complete Guide to Kerala Backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80",
    category: "Destinations",
  },
  {
    id: "rajasthan-royal-heritage",
    title: "Exploring Rajasthan's Royal Heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80",
    category: "Culture",
  },
  {
    id: "himalayan-trekking-tips",
    title: "Essential Tips for Himalayan Trekking",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&q=80",
    category: "Adventure",
  },
];

const BlogDetail = () => {
  const { blogId } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [blogId]);
  
  const post = blogPosts[blogId as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <FeedbackSection />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        <div className="relative h-[50vh] md:h-[60vh]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background rounded-2xl shadow-xl p-8 md:p-12">
            {/* Back Link */}
            <Link 
              to="/blogs" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category Badge */}
            <Badge className="mb-4 bg-primary text-primary-foreground">
              {post.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Article Content */}
            <article 
              className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <Separator className="my-8" />

            {/* Share Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Share this article:</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts
              .filter((p) => p.id !== blogId)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                  <div className="group relative rounded-xl overflow-hidden h-64">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge className="mb-2 bg-primary/80 text-primary-foreground">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;

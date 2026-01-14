import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import FeedbackSection from "@/components/FeedbackSection";

const blogPosts = [
  {
    id: "top-10-destinations-india",
    title: "Top 10 Must-Visit Destinations in India for 2024",
    excerpt: "Discover the most breathtaking destinations across India that should be on every traveler's bucket list this year.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    category: "Travel Guide",
    author: "Priya Sharma",
    date: "January 15, 2024",
    readTime: "5 min read",
  },
  {
    id: "kerala-backwaters-guide",
    title: "A Complete Guide to Kerala Backwaters",
    excerpt: "Experience the serene beauty of Kerala's backwaters with our comprehensive travel guide covering houseboats, best times to visit, and hidden gems.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    category: "Destinations",
    author: "Rahul Menon",
    date: "January 10, 2024",
    readTime: "7 min read",
  },
  {
    id: "rajasthan-royal-heritage",
    title: "Exploring Rajasthan's Royal Heritage",
    excerpt: "Step back in time and explore the magnificent palaces, forts, and rich cultural heritage of Rajasthan.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
    category: "Culture",
    author: "Amit Singh",
    date: "January 5, 2024",
    readTime: "6 min read",
  },
  {
    id: "himalayan-trekking-tips",
    title: "Essential Tips for Himalayan Trekking",
    excerpt: "Planning a trek in the Himalayas? Here's everything you need to know about preparation, gear, and safety.",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    category: "Adventure",
    author: "Vikram Thapa",
    date: "December 28, 2023",
    readTime: "8 min read",
  },
  {
    id: "goa-beyond-beaches",
    title: "Goa Beyond Beaches: Hidden Gems to Explore",
    excerpt: "While Goa is famous for its beaches, there's so much more to discover. Explore the lesser-known attractions of this vibrant state.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    category: "Destinations",
    author: "Sneha Fernandes",
    date: "December 20, 2023",
    readTime: "5 min read",
  },
  {
    id: "indian-street-food-journey",
    title: "A Culinary Journey Through Indian Street Food",
    excerpt: "From Mumbai's vada pav to Delhi's chaat, embark on a flavorful journey through India's diverse street food culture.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    category: "Food & Culture",
    author: "Ananya Gupta",
    date: "December 15, 2023",
    readTime: "6 min read",
  },
];

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <FeedbackSection />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        
        {/* Decorative blur elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-4 h-[2px] bg-primary" />
            <span className="text-primary font-serif italic tracking-[0.3em] text-sm uppercase">
              Our Blog
            </span>
            <div className="w-4 h-[2px] bg-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Travel Stories & Tips
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover inspiring travel stories, expert tips, and comprehensive guides to help you plan your perfect Indian adventure.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

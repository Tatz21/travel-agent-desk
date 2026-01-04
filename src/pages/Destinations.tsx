import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import DestinationsSection from "@/components/DestinationsSection";


const Destinations = () => {


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollToTop />
      <DestinationsSection />

      <Footer />
    </div>
  );
};

export default Destinations;

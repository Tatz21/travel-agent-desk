import { useState } from "react";
import { MessageSquarePlus, Send, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ratingCategories = [
  { key: "websiteExperience", label: "Website Experience" },
  { key: "customerSupport", label: "Customer Support" },
  { key: "bookingProcess", label: "Booking Process" },
  { key: "overallSatisfaction", label: "Overall Satisfaction" },
];

const FeedbackSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    websiteExperience: 0,
    customerSupport: 0,
    bookingProcess: 0,
    overallSatisfaction: 0,
    suggestion: "",
  });
  const { toast } = useToast();

  const handleRatingChange = (category: string, rating: number) => {
    setFormData({ ...formData, [category]: rating });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      websiteExperience: 0,
      customerSupport: 0,
      bookingProcess: 0,
      overallSatisfaction: 0,
      suggestion: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feedback").insert({
        name: formData.name.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        website_experience: formData.websiteExperience || null,
        customer_support: formData.customerSupport || null,
        booking_process: formData.bookingProcess || null,
        overall_satisfaction: formData.overallSatisfaction || null,
        suggestion: formData.suggestion.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your valuable input and will use it to improve our services.",
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category, value }: { category: string; value: number }) => (
    <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingChange(category, star)}
          className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded touch-manipulation"
        >
          <Star
            size={20}
            className={`xs:w-5 xs:h-5 sm:w-6 sm:h-6 transition-colors ${
              star <= value
                ? "fill-primary text-primary"
                : "fill-transparent text-muted-foreground/40 hover:text-primary/60"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 group touch-manipulation"
        aria-label="Open feedback form"
      >
        <div className="flex items-center bg-primary text-primary-foreground rounded-l-xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:pr-2">
          <div 
            className="flex items-center gap-2 px-2 py-3 xs:px-2.5 xs:py-4 sm:px-3 sm:py-5"
            style={{ 
              writingMode: "vertical-rl",
              textOrientation: "mixed"
            }}
          >
            <MessageSquarePlus size={18} className="rotate-90 xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
            <span className="text-xs xs:text-sm font-semibold tracking-wide">Feedback</span>
          </div>
        </div>
      </button>

      {/* Feedback Modal using Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-none">
          {/* Custom Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 xs:p-5 sm:p-6 rounded-t-lg">
            <DialogHeader>
              <DialogTitle className="text-lg xs:text-xl sm:text-2xl font-bold text-primary-foreground text-center">
                Share Your Experience
              </DialogTitle>
              <p className="text-primary-foreground/90 text-center text-xs xs:text-sm sm:text-base mt-1 sm:mt-2">
                Help us serve you better with your valuable feedback
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-4 xs:p-5 sm:p-6 space-y-4 sm:space-y-6 bg-background">
            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-bold">1</span>
                Contact Information
              </h3>
              
              <div className="grid gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs sm:text-sm text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 text-sm sm:text-base h-9 sm:h-10 border-border focus:border-primary focus:ring-primary"
                    maxLength={100}
                  />
                </div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="email" className="text-xs sm:text-sm text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 text-sm sm:text-base h-9 sm:h-10 border-border focus:border-primary focus:ring-primary"
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs sm:text-sm text-muted-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 text-sm sm:text-base h-9 sm:h-10 border-border focus:border-primary focus:ring-primary"
                      maxLength={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-bold">2</span>
                Rate Your Experience
              </h3>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                {ratingCategories.map((category) => (
                  <div 
                    key={category.key}
                    className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <Label className="text-xs sm:text-sm font-medium text-foreground block mb-2">
                      {category.label}
                    </Label>
                    <StarRating 
                      category={category.key} 
                      value={formData[category.key as keyof typeof formData] as number} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-bold">3</span>
                Your Suggestions
              </h3>
              
              <Textarea
                placeholder="Tell us how we can improve our services..."
                value={formData.suggestion}
                onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base border-border focus:border-primary focus:ring-primary resize-none"
                maxLength={1000}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin sm:w-5 sm:h-5" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2 sm:w-5 sm:h-5" />
                  Submit Feedback
                </>
              )}
            </Button>

            {/* Privacy Note */}
            <p className="text-[10px] xs:text-xs text-muted-foreground text-center">
              Your feedback is confidential and helps us improve our services.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackSection;

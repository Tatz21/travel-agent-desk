import { useState } from "react";
import { MessageSquare, Send, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ratingCategories = [
  { key: "websiteExperience", label: "Website Experience" },
  { key: "customerSupport", label: "Customer Support" },
  { key: "bookingProcess", label: "Booking Process" },
  { key: "overallSatisfaction", label: "Overall Satisfaction" },
];

export default function FeedbackSection() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    websiteExperience: 0,
    customerSupport: 0,
    bookingProcess: 0,
    overallSatisfaction: 0,
    suggestion: "",
  });

  const setRating = (key: string, value: number) => {
    setForm({ ...form, [key]: value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Rating validation
    if (
      form.websiteExperience === 0 ||
      form.customerSupport === 0 ||
      form.bookingProcess === 0 ||
      form.overallSatisfaction === 0
    ) {
      toast({
        title: "Rating required",
        description: "Please rate all experience categories before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("feedback").insert({
      name: form.name || null,
      email: form.email || null,
      phone: form.phone || null,
      website_experience: form.websiteExperience || null,
      customer_support: form.customerSupport || null,
      booking_process: form.bookingProcess || null,
      overall_satisfaction: form.overallSatisfaction || null,
      suggestion: form.suggestion || null,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted successfully",
    });

    setOpen(false);
    setForm({
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

  const Stars = ({ value, onChange }: any) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="transition hover:scale-110"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              i <= value
                ? "fill-[#F5B301] text-[#F5B301]"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 group touch-manipulation" aria-label="Open Feedback Form"
      >
        <div className="flex items-center bg-primary text-primary-foreground rounded-l-xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:pr-2">
          <div className="flex items-center gap-2 px-2 py-3 xs:px-2.5 xs:py-4 sm:px-3 sm:py-5"
            style={{ 
              writingMode: "vertical-rl",
              textOrientation: "mixed"
            }} >
          <MessageSquare className="rotate-90 xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
          <span className="text-xs xs:text-sm font-semibold tracking-wide">Feedback</span>
          </div>
        </div>
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
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
          <form
            onSubmit={submit}
            className="bg-[#FBF9F6] p-4 sm:p-6 space-y-6"
          >
            {/* STEP 1 */}
            <section className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Contact Information
              </h3>

              <Input
                placeholder="Enter your name"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="your@email.com"
                  value={form.email}
                  required
                  type="email"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
                <Input
                  placeholder="96XXX XXXXX"
                  value={form.phone}
                  required
                  type="tel"
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  maxLength={10}
                  onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                />
              </div>
            </section>

            {/* STEP 2 */}
            <section className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Rate Your Experience
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ratingCategories.map((c) => (
                  <div
                    key={c.key}
                    className="bg-white rounded-xl border p-4 space-y-2"
                  >
                    <Label className="font-medium">{c.label}</Label>
                    <span className="text-red-500 text-sm"> *</span>
                    <Stars
                      value={form[c.key as keyof typeof form]}
                      onChange={(v: number) => setRating(c.key, v)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* STEP 3 */}
            <section className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Your Suggestions
              </h3>

              <Textarea
                placeholder="Tell us how we can improve our services..."
                className="min-h-[100px]"
                value={form.suggestion}
                onChange={(e) =>
                  setForm({ ...form, suggestion: e.target.value })
                }
              />
            </section>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your feedback is confidential and helps us improve our services.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

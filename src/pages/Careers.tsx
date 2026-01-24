import { useEffect, useState, useRef } from "react";
import { Briefcase, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import heroCareerImage from "@/assets/52_generated.jpg";
import ScrollToTop from "@/components/ScrollToTop";

const Careers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applicationCode, setApplicationCode] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvFile) {
      toast({ title: "CV is required", variant: "destructive" });
      return;
    }

    if (cvFile.size > 5_000_000) {
      toast({
        title: "File too large",
        description: "CV must be under 5 MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("position", form.position);
      formData.append("message", form.message);
      formData.append("cv", cvFile);

      const res = await supabase.functions.invoke("career-application", {
        body: formData,
      });

      if (res.error) throw res.error;

      if (!res.data) {
        throw new Error("Invalid response from server");
      }

      // Normalize response
      const appCode = res.data?.code || res.data?.applicationCode || "N/A";

      console.log("FINAL APP CODE 👉", appCode);

      // Assuming the function returns an applicationCode
      //setApplicationCode(appCode);
      setApplicationCode(String(appCode));
      setSubmitted(true);

      toast({
        title: "Application Submitted",
        description: "Thank you for applying! We will review your application and get back to you soon.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
      });
      
      setCvFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err: any) {
      console.error("Submission error:", err);
      toast({
        title: "Submission Failed",
        description: err.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />

      <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCareerImage})` }}
        />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-xl text-black max-w-3xl mx-auto mb-8 px-4 py-24 rounded-lg animate-fade-in-up delay-100">
            Join our team & build the future of travel
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              {!submitted ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase /> Apply Now
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input placeholder="Full Name" required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />

                    <Input type="email" placeholder="Email" required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />

                    <Input placeholder="Phone" required
                      value={form.phone}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setForm({ ...form, phone: digitsOnly });
                      }}
                    />
                    <div>
                      <select
                        required
                        value={form.position}
                        onChange={e => setForm({ ...form, position: e.target.value })}
                        className="w-full rounded-md border px-3 py-2"
                      >
                        <option value="">Select Position</option>
                        <option>Field Sales Executive</option>
                        <option>Accountant</option>
                        <option>Senior Sales Executive</option>
                      </select>
                    </div>

                    <Input type="file" ref={fileInputRef} required accept=".pdf,.doc,.docx"
                      onChange={e => setCvFile(e.target.files?.[0] || null)}
                    />

                    <Textarea placeholder="Why should we hire you?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />

                    <Button disabled={loading} className="w-full">
                      {loading ? "Submitting..." : "Submit"}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                  <p className="mb-2">Your application has been submitted successfully.</p>
                  <Button variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
                    Submit Another Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main >
  );
};

export default Careers;

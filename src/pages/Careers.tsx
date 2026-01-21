import { useEffect, useState } from "react";
import { Briefcase, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import heroContactImage from "@/assets/hero-contact.jpg";

const Careers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      toast({ title: "Please upload CV", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const fileBase64 = await fileToBase64(cvFile);

      const { error } = await supabase.functions.invoke("send-career-application", {
        body: {
          ...form,
          fileName: cvFile.name,
          fileType: cvFile.type,
          fileBase64,
        },
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Our HR team will contact you shortly.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
      });
      setCvFile(null);
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative py-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroContactImage})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">Careers</h1>
          <p className="mt-4 text-lg">Join our growing travel technology team</p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase /> Apply for a Position
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input id="name" placeholder="Full Name" required value={form.name} onChange={handleChange} />
                  <Input id="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Input id="phone" placeholder="Phone Number" required value={form.phone} onChange={handleChange} />
                  <Input id="position" placeholder="Position Applying For" required value={form.position} onChange={handleChange} />
                </div>

                <Textarea
                  id="message"
                  placeholder="Cover letter / Message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                />

                <div>
                  <Label>Upload CV (PDF/DOC)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Submitting..." : "Submit Application"}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Careers;

/* UTIL */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

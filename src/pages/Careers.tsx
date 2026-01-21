import { useEffect, useState } from "react";
import { Briefcase, Send } from "lucide-react";
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
      toast({ title: "CV Required", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const base64 = await cvFile.arrayBuffer().then((b) =>
        Buffer.from(b).toString("base64")
      );

      const { error } = await supabase.functions.invoke("send-career-application", {
        body: {
          ...form,
          cv: {
            name: cvFile.name,
            type: cvFile.type,
            content: base64,
          },
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
        title: "Submission Failed",
        description: "Please try again later.",
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
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroContactImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">Careers</h1>
          <p className="mt-4 text-lg">
            Join our team & build the future of travel
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase /> Apply Now
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input id="name" placeholder="Full Name" required value={form.name} onChange={handleChange} />
                <Input id="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
                <Input id="phone" placeholder="Phone" required value={form.phone} onChange={handleChange} />
                <Input id="position" placeholder="Position Applied For" required value={form.position} onChange={handleChange} />

                <div>
                  <Label>Upload CV (PDF / DOC)</Label>
                  <Input type="file" accept=".pdf,.doc,.docx" required onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
                </div>

                <Textarea id="message" placeholder="Why should we hire you?" value={form.message} onChange={handleChange} />

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

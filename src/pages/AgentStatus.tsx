import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type Agent = {
  company_name: string;
  contact_person: string;
  status: "pending" | "active" | "rejected";
  agent_code: string | null;
};

const AgentStatus = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [notFound, setNotFound] = useState(false);

  const checkStatus = async () => {
    if (!value.trim()) {
      toast({ title: "Please enter email or phone" });
      return;
    }

    setLoading(true);
    setAgent(null);

    const input = value.trim().toLowerCase();
    const isEmail = input.includes("@");
    
    let query = supabase
      .from("agents")
      .select("company_name, contact_person, status, agent_code");

    if (isEmail) {
      query = query.eq("email", input);
    } else {
      const phone = input.replace(/\D/g, "").slice(-10);
      query = query.eq("phone", phone);
    }

    const { data, error } = await query.maybeSingle();
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message });
      return;
    }

    if (!data) {
      toast({ title: "No registration found", description: "Please register first" });
      return;
    }

    setAgent(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Registration Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email or Phone</Label>
            <Input
              placeholder="Enter registered email or phone"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <Button onClick={checkStatus} disabled={loading} className="w-full">
            {loading ? "Checking..." : "Check Status"}
          </Button>

          {agent && (
            <div className="border rounded-md p-4 space-y-2 bg-background">
              <p><strong>Company:</strong> {agent.company_name}</p>
              <p><strong>Contact:</strong> {agent.contact_person}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    agent.status === "active"
                      ? "text-green-600"
                      : agent.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {agent.status.toUpperCase()}
                </span>
              </p>

              {agent.status === "active" && (
                <p className="text-sm text-green-700">
                  Agent Code: <strong>{agent.agent_code}</strong><br />
                  Login credentials have been sent to your email.
                </p>
              )}

              {agent.status === "pending" && (
                <p className="text-sm text-yellow-600">
                  Your application is under admin review.
                </p>
              )}

              {agent.status === "rejected" && (
                <p className="text-sm text-red-600">
                  Your application was rejected. Please contact support.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStatus;

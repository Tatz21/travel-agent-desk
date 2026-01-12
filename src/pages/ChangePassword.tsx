import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import AgentHeader from '@/components/AgentHeader';
import { toast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };
    checkSession();
  }, [navigate]);

  /* ---------------- SUBMIT ---------------- */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: user } = await supabase.auth.getUser();

    await supabase.auth.updateUser({
    password: newPassword,
    });

    await supabase
    .from("agents")
    .update({
        updated_at: new Date().toISOString(),
        password: newPassword,
    })
    .eq("user_id", user.user.id);

    setLoading(false);

    toast({
      title: "Password Changed",
      description: "Please login again with your new password",
    });

    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
    <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <AgentHeader />

          {/* Main Content */}
          <div className="p-3 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Change Password</h1>
              </div>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your account password securely
                </CardDescription>
                </CardHeader>

                <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">

                    {/* New Password */}
                    <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                        <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                        <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        />
                        <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                        {showConfirmPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                        </button>
                    </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                    </Button>
                </form>
                </CardContent>
            </Card>
          </div>
        </main>
    </div>
    </SidebarProvider>
  );
};

export default ChangePassword;

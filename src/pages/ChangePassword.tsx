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
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AgentHeader from "@/components/AgentHeader";
import { toast } from "@/hooks/use-toast";

const OTP_TIMER = 60;

const ChangePassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"password" | "otp">("password");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailOtp, setEmailOtp] = useState("");
  const [smsOtp, setSmsOtp] = useState("");

  const [emailTimer, setEmailTimer] = useState(0);
  const [smsTimer, setSmsTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return navigate("/auth");

      setUserId(data.session.user.id);
      setEmail(data.session.user.email || "");

      const { data: agent } = await supabase
        .from("agents")
        .select("phone")
        .eq("user_id", data.session.user.id)
        .single();

      setPhone(agent?.phone || "");
    })();
  }, [navigate]);

  /* ---------- TIMERS ---------- */
  useEffect(() => {
    if (emailTimer > 0) setTimeout(() => setEmailTimer(emailTimer - 1), 1000);
  }, [emailTimer]);

  useEffect(() => {
    if (smsTimer > 0) setTimeout(() => setSmsTimer(smsTimer - 1), 1000);
  }, [smsTimer]);

  /* ---------- STEP 1 ---------- */
  const sendOtp = async () => {
    if (newPassword.length < 8)
      return toast({ title: "Password must be at least 8 characters", variant: "destructive" });

    if (newPassword !== confirmPassword)
      return toast({ title: "Passwords do not match", variant: "destructive" });

    try {
      setLoading(true);

      await supabase.functions.invoke("change-password", {
        body: {
          action: "send_otp",
          user_id: userId,
          email,
          phone,
        },
      });

      setEmailTimer(OTP_TIMER);
      setSmsTimer(OTP_TIMER);
      setStep("otp");

      toast({ title: "OTP sent to Email & Mobile" });
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- STEP 2 ---------- */
  const verifyAndChangePassword = async () => {
    try {
      setLoading(true);

      await supabase.functions.invoke("change-password", {
        body: {
          action: "verify_otp_and_change_password",
          user_id: userId,
          email_otp: emailOtp,
          sms_otp: smsOtp,
          new_password: newPassword,
        },
      });

      toast({ title: "Password changed successfully" });
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND EMAIL OTP ---------- */
  const resendEmailOtp = async () => {
    try {
      setLoading(true);

      await supabase.functions.invoke("change-password", {
        body: {
          action: "resend_email_otp",
          user_id: userId,          
          email,
        },
      });

      setEmailTimer(OTP_TIMER);
      setStep("otp");

      toast({ title: "Email OTP resent successfully" });
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND SMS OTP ---------- */
  const resendSmsOtp = async () => {
    try {
      setLoading(true);

      await supabase.functions.invoke("change-password", {
        body: {
          action: "resend_sms_otp",
          user_id: userId,          
          phone,
        },
      });

      setSmsTimer(OTP_TIMER);
      setStep("otp");

      toast({ title: "Mobile OTP resent successfully" });
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <AgentHeader />

          <div className="p-3  md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Change Password</h1>
              </div>
            </div>
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>OTP verification required</CardDescription>
              </CardHeader>

              <CardContent>
                {step === "password" && (
                  <>
                    <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input type={showNew ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                      <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3">
                        {showNew ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    </div>
                    {/* confirm password */}
                    <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                      <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3">
                        {showConfirm ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    </div>
                    <div className="mb-4" />
                    <Button className="w-full" onClick={sendOtp} disabled={loading}>
                      {loading ? "Sending OTP..." : "Change Password"}
                    </Button>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <Label>Email OTP</Label>
                    <div className="relative">
                      <Input value={emailOtp} onChange={e => setEmailOtp(e.target.value)} />

                      <Button variant="link" disabled={emailTimer > 0} onClick={resendEmailOtp}>
                        {emailTimer ? `Resend in ${emailTimer}s` : "Resend Email OTP"}
                      </Button>
                    </div>

                    <Label>Mobile OTP</Label>
                    <div className="relative">
                      <Input value={smsOtp} onChange={e => setSmsOtp(e.target.value)} />

                      <Button variant="link" disabled={smsTimer > 0} onClick={resendSmsOtp}>
                        {smsTimer ? `Resend in ${smsTimer}s` : "Resend SMS OTP"}
                      </Button>
                    </div>

                    <Button className="w-full" onClick={verifyAndChangePassword} disabled={loading}>
                      {loading ? "Updating..." : "Submit"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ChangePassword;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AgentHeader from "@/components/AgentHeader";
import { useAgent } from "@/hooks/useAgent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Lock,
  FileText,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ---------- FILE PREVIEW HELPERS ---------- */
const isImage = (url: string) =>
  /\.(jpg|jpeg|png|webp)$/i.test(url);

const isPdf = (url: string) =>
  /\.pdf$/i.test(url);

const Profile = () => {
  const navigate = useNavigate();
  const { agent } = useAgent();

  /* ---------- MODAL STATE ---------- */
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const openPreview = (url: string, title: string) => {
    setFileUrl(url);
    setTitle(title);
    setOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />

        <main className="flex-1 overflow-auto">
          <AgentHeader />

          {/* Main Content */}
          <div className="p-3 md:p-6 lg:p-8 space-y-6">
            {/* Page Title + Agent Code */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl md:text-3xl font-bold">
                  My Profile
                </h1>
              </div>

              {agent?.agent_code && (
                <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg text-sm font-medium">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Agent Code:
                  <span className="font-semibold">
                    {agent.agent_code}
                  </span>
                </div>
              )}
            </div>

            {/* PROFILE SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* PERSONAL INFO */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal and contact details
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{agent?.contact_person || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{agent?.email || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{agent?.phone || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>Aadhaar: {agent?.aadhaar || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {agent?.address}, {agent?.city},{" "}
                      {agent?.state}, {agent?.country} -{" "}
                      {agent?.pincode}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* BUSINESS INFO */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Your registered business & KYC details
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{agent?.company_name || "-"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Agent Code: {agent?.agent_code || "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Trade Licence: {agent?.trade_licence || "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>PAN: {agent?.pan || "-"}</span>
                  </div>

                  {/* DOCUMENT VIEW LINKS */}
                  <div className="pt-2 space-y-2">
                    {agent?.trade_licence_file && (
                      <button
                        onClick={() =>
                          openPreview(
                            agent.trade_licence_file,
                            "Trade Licence"
                          )
                        }
                        className="text-primary text-sm hover:underline block"
                      >
                        View Trade Licence File
                      </button>
                    )}

                    {agent?.pan_file && (
                      <button
                        onClick={() =>
                          openPreview(agent.pan_file, "PAN Card")
                        }
                        className="text-primary text-sm hover:underline block"
                      >
                        View PAN File
                      </button>
                    )}

                    {agent?.aadhaar_front_file && (
                      <button
                        onClick={() =>
                          openPreview(
                            agent.aadhaar_front_file,
                            "Aadhaar Front"
                          )
                        }
                        className="text-primary text-sm hover:underline block"
                      >
                        View Aadhaar Front
                      </button>
                    )}

                    {agent?.aadhaar_back_file && (
                      <button
                        onClick={() =>
                          openPreview(
                            agent.aadhaar_back_file,
                            "Aadhaar Back"
                          )
                        }
                        className="text-primary text-sm hover:underline block"
                      >
                        View Aadhaar Back
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-start">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/change-password")}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* ---------- FILE PREVIEW MODAL ---------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-auto border rounded-md">
            {fileUrl && isImage(fileUrl) && (
              <img
                src={fileUrl}
                alt={title}
                className="w-full object-contain"
              />
            )}

            {fileUrl && isPdf(fileUrl) && (
              <iframe
                src={fileUrl}
                className="w-full h-[70vh]"
                title={title}
              />
            )}

            {fileUrl &&
              !isImage(fileUrl) &&
              !isPdf(fileUrl) && (
                <div className="p-4 text-sm">
                  Unsupported file type.{" "}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Open in new tab
                  </a>
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Profile;

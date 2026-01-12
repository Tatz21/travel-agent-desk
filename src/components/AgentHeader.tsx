import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import WalletComponent from "@/components/Wallet";
import logo from "@/assets/logo.gif";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserCircle, LogOut, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useAgent } from "@/hooks/useAgent";
import AccountManagerFloat from "@/components/AccountManagerFloat";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "suspended":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const DashboardHeader = () => {
  const { signOut } = useAuth();
  const { agent } = useAgent();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border sticky top-0 bg-background z-10">
      <div className="flex items-center justify-between h-16 px-3 md:px-6">
        {/* Left */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SidebarTrigger />
          <img
            src={logo}
            alt="Travelopedia"
            className="w-40 object-contain bg-white"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile wallet icon */}
          <div className="sm:hidden">
            <WalletComponent />
          </div>

          {/* Desktop full wallet */}
          <div className="hidden sm:block">
            <WalletComponent />
          </div>

          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <div
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {agent?.contact_person?.[0] ?? "U"}
                </div>

                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {agent?.contact_person}
                  </span>
                  <Badge className={getStatusColor(agent?.status || "pending")}>
                    {agent?.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <DropdownMenuItem className="gap-2">
                <UserCircle className="w-4 h-4" />
                {agent?.agent_code}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2">
                <User className="w-4 h-4" />
                {agent?.contact_person}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/dashboard/change-password")}
                className="gap-2"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/dashboard/profile")}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AccountManagerFloat
            accountManager={
              agent?.account_manager
                ? {
                    account_manager_name: agent.account_manager.account_manager_name ?? "",
                    phone: agent.account_manager.phone ?? "",
                    email: agent.account_manager.email ?? "",
                  }
                : null
            }
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

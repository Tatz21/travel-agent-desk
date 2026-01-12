import { Phone, Mail, Headset } from "lucide-react";
import { useState } from "react";

interface Props {
  accountManager: {
    account_manager_name: string;
    phone: string;
    email: string;
  };
}

const AccountManagerFloat = ({ accountManager }: Props) => {
  if (!accountManager) return null;

  const { account_manager_name, phone, email } = accountManager;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="px-2 py-4 rounded-l-lg bg-primary text-white shadow-lg"
        >
          <Headset className="w-5 h-5" />
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed right-16 top-1/2 -translate-y-1/2 z-50 w-72 bg-white border rounded-xl shadow-xl">
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">
              {account_manager_name || "Account Manager"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Account Manager
            </p>
          </div>

          <div className="p-4 space-y-3">
            {phone && (
              <a
                href={`tel:+91${phone}`}
                className="flex gap-3 p-3 rounded-lg bg-green-50 text-green-700"
              >
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-xs">{phone}</p>
                </div>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex gap-3 p-3 rounded-lg bg-blue-50 text-blue-700"
              >
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-xs">{email}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AccountManagerFloat;


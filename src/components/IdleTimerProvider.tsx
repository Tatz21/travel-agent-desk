import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const IDLE_TIME = 10 * 60 * 1000; // 10 minutes
const WARNING_TIME = 30; // 30 seconds

export const IdleTimerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, signOut } = useAuth();

  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_TIME);

  /* ---------------- CLEAR ALL TIMERS ---------------- */
  const clearTimers = () => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    idleTimeoutRef.current = null;
    countdownRef.current = null;
  };

  /* ---------------- RESET IDLE TIMER ---------------- */
  const resetTimer = () => {
    if (!user) return;

    clearTimers();
    setShowWarning(false);
    setSecondsLeft(WARNING_TIME);

    idleTimeoutRef.current = setTimeout(startCountdown, IDLE_TIME);
  };

  /* ---------------- START COUNTDOWN ---------------- */
  const startCountdown = () => {
    setShowWarning(true);

    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimers();
          setShowWarning(false);
          signOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ---------------- MANUAL LOGOUT (NO POPUP) ---------------- */
  const forceLogout = async () => {
    clearTimers();
    setShowWarning(false);
    setSecondsLeft(WARNING_TIME);
    await signOut();
  };

  /* ---------------- ACTIVITY TRACKING ---------------- */
  useEffect(() => {
    if (!user) return;

    const events = ["click"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimers();
    };
  }, [user]);

  /* ---------------- SAFETY: USER LOGGED OUT ---------------- */
  useEffect(() => {
    if (!user) {
      clearTimers();
      setShowWarning(false);
    }
  }, [user]);

  return (
    <>
      {children}

      {/* -------- IDLE WARNING MODAL -------- */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-2">
              Session Expiring
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              You will be logged out in{" "}
              <span className="text-red-600 font-bold">
                {secondsLeft}s
              </span>
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={resetTimer}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Stay Logged In
              </button>

              <button
                onClick={forceLogout}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};







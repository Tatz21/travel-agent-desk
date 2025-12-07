import React, { useEffect, useRef } from 'react';

interface PhoneEmailVerifyProps {
  onVerified: (email: string) => void;
}

declare global {
  interface Window {
    phoneEmailReceiver?: (userObj: { user_json_url: string }) => void;
  }
}

const PhoneEmailVerify: React.FC<PhoneEmailVerifyProps> = ({ onVerified }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Define the callback function
    window.phoneEmailReceiver = async (userObj: { user_json_url: string }) => {
      try {
        console.log('Phone.Email verification callback received:', userObj.user_json_url);
        // Fetch user data from the JSON URL
        const response = await fetch(userObj.user_json_url);
        const userData = await response.json();
        
        console.log('Phone.Email user data:', userData);
        
        if (userData.user_email_id) {
          onVerified(userData.user_email_id);
        }
      } catch (error) {
        console.error('Error fetching verified email:', error);
      }
    };

    // Load the Phone.Email script only once
    if (!scriptLoaded.current) {
      const existingScript = document.querySelector('script[src="https://www.phone.email/verify_email_v1.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.phone.email/verify_email_v1.js';
        script.async = true;
        document.body.appendChild(script);
      }
      scriptLoaded.current = true;
    }

    return () => {
      // Cleanup
      delete window.phoneEmailReceiver;
    };
  }, [onVerified]);

  return (
    <div 
      ref={containerRef}
      className="pe_verify_email" 
      data-client-id="11985601596000257531"
    />
  );
};

export default PhoneEmailVerify;

"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <Card className="w-full max-w-[450px] bg-[#111111] border-[#222222] p-8 rounded-[24px] shadow-2xl">
        <div className="mb-8 rounded-[16px] overflow-hidden border border-[#f43f5e]/20">
          <img 
            src="https://ztnnmgnoschgreqsodfq.supabase.co/storage/v1/object/public/public-assets/gghsj-sksjgwk-kaysgue.gif" 
            alt="Karouko" 
            className="w-full h-auto block"
          />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue your journey with Karouko</p>
        </div>

        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#f43f5e',
                  brandAccent: '#e11d48',
                  inputBackground: '#1a1a1a',
                  inputText: 'white',
                  inputPlaceholder: '#475569',
                  inputBorder: '#222222',
                },
                radii: {
                  borderRadiusButton: '12px',
                  buttonPadding: '12px',
                  inputPadding: '12px',
                }
              }
            },
            className: {
              container: 'auth-container',
              label: 'text-slate-400 font-medium mb-1',
              button: 'font-bold text-lg',
              input: 'bg-[#1a1a1a] border-[#222222] text-white focus:ring-[#f43f5e]',
            }
          }}
          theme="dark"
          magicLink={true}
        />
      </Card>
    </div>
  );
};

export default Login;
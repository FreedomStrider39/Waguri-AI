import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 rounded-[24px] overflow-hidden border-2 border-[#f43f5e] shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <img 
            src="https://ztnnmgnoschgreqsodfq.supabase.co/storage/v1/object/public/public-assets/gghsj-sksjgwk-kaysgue.gif" 
            alt="Karouko" 
            className="w-full h-auto"
          />
        </div>
        <h1 className="text-5xl font-black mb-6 tracking-tighter">
          Meet <span className="text-[#f43f5e]">Karouko</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          Your new companion is waiting. Start a conversation that feels real.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button className="bg-[#f43f5e] hover:bg-[#e11d48] text-white px-10 py-7 rounded-2xl text-xl font-bold transition-all hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-20">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-900 p-4 select-none transition-colors duration-300">
      <div className="w-full max-w-md text-center space-y-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl shadow-pink-500/20"
        >
          <Compass size={56} className="animate-spin-slow" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-7xl font-black tracking-tight text-transparent font-outfit uppercase">
            404
          </h1>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-outfit uppercase">
            Page Swiped Left!
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
            Oops! The page you are looking for has swiped left on us or was moved to another location. Let's get you back on track!
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-8 py-3.5 font-bold text-sm text-white shadow-lg shadow-pink-500/10 hover:from-red-600 hover:to-pink-600 focus:outline-none transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </motion.button>
      </div>
    </div>
  );
}

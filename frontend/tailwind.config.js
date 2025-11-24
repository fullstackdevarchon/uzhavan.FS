/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* -----------------------------------------------------
         🌐 CUSTOM FONT FAMILIES — CLEAN + PROFESSIONAL
      ------------------------------------------------------*/
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        lexend: ["Lexend Exa", "sans-serif"],
        momo: ["Momo Trust Display", "sans-serif"],
      },

      /* -----------------------------------------------------
         🎨 PREMIUM ANIMATIONS (Hero + Buttons + UI)
      ------------------------------------------------------*/
      keyframes: {
        bgZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },

        floatSlow: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0)" },
        },

        floatSlow2: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(25px)" },
          "100%": { transform: "translateY(0)" },
        },

        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        glowButton: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(34,197,94,0.6)" },
          "50%": { boxShadow: "0 0 30px rgba(34,197,94,1)" },
        },

        /* -----------------------------------------------------
           🟢 SUCCESS POPPER FOR ORDER PLACED (Bounce + Scale)
        ------------------------------------------------------*/
        popSuccess: {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },

        popBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },

        pulseGlow: {
          "0%": { boxShadow: "0 0 0px rgba(34,197,94,0.8)" },
          "100%": { boxShadow: "0 0 25px rgba(34,197,94,0)" },
        },

        /* -----------------------------------------------------
           🔄 TOAST / POPUP SLIDE-IN ANIMATION
        ------------------------------------------------------*/
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },

        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },

        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },

      /* -----------------------------------------------------
         ⚡ APPLY ANIMATIONS
      ------------------------------------------------------*/
      animation: {
        bgZoom: "bgZoom 12s ease-in-out infinite alternate",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        floatSlow2: "floatSlow2 8s ease-in-out infinite",
        fadeIn: "fadeIn 1.2s ease-out forwards",
        glowButton: "glowButton 2.5s ease-in-out infinite",

        /* Success Popper Animations */
        popSuccess: "popSuccess 0.45s ease-out forwards",
        popBounce: "popBounce 1s ease-in-out infinite",
        pulseGlow: "pulseGlow 1.4s ease-out infinite",

        /* Toast / popup */
        slideUp: "slideUp 0.4s ease-out forwards",
        slideDown: "slideDown 0.4s ease-out forwards",

        shimmer: "shimmer 2s linear infinite",
      },

      /* -----------------------------------------------------
         Extra utilities
      ------------------------------------------------------*/
      backgroundSize: {
        shimmer: "1000px 100%",
      },

      boxShadow: {
        glow: "0 0 18px rgba(34,197,94,0.7)",
      },
    },
  },

  plugins: [],
};

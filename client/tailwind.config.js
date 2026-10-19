/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manga: {
          bg: '#080808',
          surface: '#111111',
          elevated: '#191919',
          card: '#141414',
          border: 'rgba(255, 255, 255, 0.14)',
          borderStrong: 'rgba(255, 255, 255, 0.28)',
          text: '#F5F3EF',
          muted: '#A5A5A5',
          dim: '#747474',
          accent: '#E63946',
          accentGlow: '#FF4D5E',
          gold: '#E5A93C',
          ink: '#030303',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
        display: ['"Cinzel"', '"Bebas Neue"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'Menlo', 'monospace'],
        hindi: ['"Amita"', '"Rozha One"', 'serif'],
        japanese: ['"Noto Serif JP"', '"Yu Mincho"', 'serif'],
      },
      boxShadow: {
        'panel': '0 0 0 1px rgba(255, 255, 255, 0.14), 4px 4px 0px 0px #000000',
        'panel-accent': '0 0 0 1px #E63946, 4px 4px 0px 0px #E63946',
        'panel-lg': '0 0 0 2px rgba(255, 255, 255, 0.2), 8px 8px 0px 0px #000000',
        'glow-red': '0 0 25px -5px rgba(230, 57, 70, 0.5)',
      },
      backgroundImage: {
        'screentone': 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
        'speed-lines': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.04) 10px, rgba(255, 255, 255, 0.04) 20px)',
      },
      backgroundSize: {
        'screentone-sm': '6px 6px',
        'screentone-md': '10px 10px',
      },
      keyframes: {
        'panel-wipe': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sfx-pop': {
          '0%': { transform: 'scale(0.8) rotate(-5deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        }
      },
      animation: {
        'panel-wipe': 'panel-wipe 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'sfx-pop': 'sfx-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}

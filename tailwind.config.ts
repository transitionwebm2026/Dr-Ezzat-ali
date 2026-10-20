import type { Config } from 'tailwindcss';

/**
 * Brand design tokens — Dr. Ezzat Ali
 *   primary   #269AC8  Soft Cyan Blue  → CTAs, highlights, active states
 *   secondary #07508C  Deep Navy Blue  → structure, headings, dark surfaces, footer
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#269AC8',
          50: '#EFF9FD',
          100: '#DDF1FA',
          200: '#B6E2F3',
          300: '#82CDEA',
          400: '#4DB4DD',
          500: '#269AC8',
          600: '#1C7DA6',
          700: '#186487',
          800: '#17536F',
          900: '#17465D',
        },
        secondary: {
          DEFAULT: '#07508C',
          50: '#EEF6FC',
          100: '#D8EAF8',
          200: '#B3D4F0',
          300: '#7FB5E3',
          400: '#3F8CCF',
          500: '#146BB0',
          600: '#0A5C9E',
          700: '#07508C',
          800: '#064273',
          900: '#05355C',
          950: '#03243F',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          tint: '#F0F9FF',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1EBE5A',
        },
      },
      fontFamily: {
        // Resolved per-locale through CSS variables (see globals.css):
        // Arabic → al-fares (headings) / ae_Hor (body); English → Plus Jakarta Sans.
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(7, 80, 140, 0.04), 0 4px 12px rgba(7, 80, 140, 0.05), 0 16px 32px -12px rgba(7, 80, 140, 0.10)',
        elevated:
          '0 2px 4px rgba(7, 80, 140, 0.04), 0 12px 24px rgba(7, 80, 140, 0.08), 0 32px 64px -16px rgba(7, 80, 140, 0.22)',
        glow: '0 0 0 1px rgba(38, 154, 200, 0.18), 0 10px 30px -6px rgba(38, 154, 200, 0.45)',
        'glow-lg': '0 0 0 1px rgba(38, 154, 200, 0.22), 0 20px 50px -10px rgba(38, 154, 200, 0.55)',
        whatsapp: '0 10px 30px -6px rgba(37, 211, 102, 0.55)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #269AC8 0%, #07508C 100%)',
        'navy-gradient': 'linear-gradient(160deg, #07508C 0%, #05355C 55%, #03243F 100%)',
        'radial-fade': 'radial-gradient(closest-side, var(--tw-gradient-stops))',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '80%, 100%': { transform: 'scale(1.75)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Lens "pulling into focus": blurred & slightly magnified → sharp.
        'focus-in': {
          '0%': { opacity: '0', filter: 'blur(18px)', transform: 'scale(1.06)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
        },
        // Eyelid blink — a quick squeeze every few seconds.
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '94%': { transform: 'scaleY(0.1)' },
        },
        progress: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        // Retinal-scanner line sweeping down the technique preview, then resting off-frame.
        'scan-sweep': {
          '0%': { transform: 'translateY(-100%)' },
          '40%, 100%': { transform: 'translateY(100%)' },
        },
        // ── Technique scenes (SVG: px values are viewBox units) ──
        'scene-flow': {
          to: { strokeDashoffset: '-20' },
        },
        'scene-draw': {
          '0%': { strokeDashoffset: '100', opacity: '1' },
          '55%': { strokeDashoffset: '0', opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '0' },
        },
        'scene-flash': {
          '0%, 45%, 100%': { opacity: '0' },
          '10%': { opacity: '1' },
        },
        'scene-ripple': {
          '0%': { opacity: '0.9', transform: 'scale(0.2)' },
          '100%': { opacity: '0', transform: 'scale(1.8)' },
        },
        'scene-pulse': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        'scene-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.93)' },
        },
        // Runs `alternate`; set --dx / --dy / --rot on the element.
        'scene-move': {
          to: { transform: 'translate(var(--dx, 0px), var(--dy, 0px)) rotate(var(--rot, 0deg))' },
        },
        'scene-absorb': {
          '0%': { opacity: '0', transform: 'translate(0px, 0px) scale(1)' },
          '20%': { opacity: '0.9' },
          '100%': { opacity: '0', transform: 'translate(var(--dx, 0px), var(--dy, 0px)) scale(0.3)' },
        },
        'scene-fall': {
          '0%': { opacity: '0', transform: 'translateY(0px)' },
          '12%': { opacity: '1' },
          '55%': { opacity: '1', transform: 'translateY(var(--dy, 0px))' },
          '60%, 100%': { opacity: '0', transform: 'translateY(var(--dy, 0px))' },
        },
        'scene-splash': {
          '0%, 55%': { opacity: '0', transform: 'scale(0.2)' },
          '60%': { opacity: '0.9' },
          '100%': { opacity: '0', transform: 'scale(1.7)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'spin-slow': 'spin 40s linear infinite',
        'spin-slower': 'spin 70s linear infinite reverse',
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'focus-in': 'focus-in 1.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        blink: 'blink 4.5s ease-in-out infinite',
        'certificate-progress': 'progress 6s linear both',
        'scan-sweep': 'scan-sweep 8s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'scene-flow': 'scene-flow 1.2s linear infinite',
        'scene-draw': 'scene-draw 5s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'scene-flash': 'scene-flash 1.8s ease-out infinite',
        'scene-ripple': 'scene-ripple 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'scene-pulse': 'scene-pulse 3s ease-in-out infinite',
        'scene-breathe': 'scene-breathe 4s ease-in-out infinite',
        'scene-move': 'scene-move 2.8s ease-in-out infinite alternate',
        'scene-absorb': 'scene-absorb 3s ease-in infinite',
        'scene-fall': 'scene-fall 2.8s ease-in infinite',
        'scene-splash': 'scene-splash 2.8s ease-out infinite',
      },
      transitionTimingFunction: {
        optical: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;

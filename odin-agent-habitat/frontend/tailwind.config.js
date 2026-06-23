/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        odin: {
          bg:      '#0a0a0f',
          surface: '#1a1a2e',
          border:  '#2a2a4a',
          green:   '#00ff88',
          cyan:    '#00d4ff',
          purple:  '#9b30ff',
          red:     '#ff3366',
          yellow:  '#ffcc00',
          dim:     '#4a4a6a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        glitch:      'glitch 3s infinite',
        pulse2:      'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scanline:    'scanline 8s linear infinite',
        blink:       'blink 1s step-end infinite',
        flicker:     'flicker 4s infinite',
        'ring-pulse': 'ring-pulse 1.5s ease-out infinite',
        sweep:       'sweep 4s linear infinite',
        'card-scan': 'card-scan 2s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(90deg)' },
          '94%': { transform: 'translate(2px, -1px)', filter: 'hue-rotate(-90deg)' },
          '96%': { transform: 'translate(-1px, 2px)' },
          '98%': { transform: 'translate(1px, -2px)', filter: 'hue-rotate(45deg)' },
        },
        scanline: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        flicker: {
          '0%, 93%, 100%': { opacity: '1' },
          '94%': { opacity: '0.6' },
          '95%': { opacity: '1' },
          '97%': { opacity: '0.75' },
          '98%': { opacity: '1' },
        },
        'ring-pulse': {
          '0%':   { transform: 'scale(1)',   opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        sweep: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'card-scan': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
    },
  },
  plugins: [],
}

import { motion } from 'framer-motion';

export function HudPanel({ className = '', children, delay = 0 }) {
  return (
    <motion.div
      className={`panel-cut pointer-events-auto border border-cyan-300/20 bg-[#08090c]/70 shadow-[0_0_42px_rgba(0,240,255,0.08)] backdrop-blur-md ${className}`}
      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ eyebrow, title }) {
  return (
    <div className="mb-4 flex items-end justify-between border-b border-cyan-300/10 pb-3">
      <div>
        <p className="text-[0.62rem] uppercase tracking-[0.34em] text-slate-500">{eyebrow}</p>
        <h2 className="text-sm font-black uppercase tracking-[0.24em] text-cyan-100">{title}</h2>
      </div>
      <div className="h-2 w-2 bg-[#00f0ff] shadow-[0_0_18px_#00f0ff]" />
    </div>
  );
}

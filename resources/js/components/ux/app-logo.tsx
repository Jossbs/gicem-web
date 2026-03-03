import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
    return (
        <svg
            viewBox="0 0 240 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('shrink-0', className)}
            aria-label="GICEM"
        >
            {/* ── Top triangle (teal/green) ── */}
            <path
                d="M120 8 L168 72 L72 72 Z"
                className="fill-[#2D5E4B] dark:fill-[#3D8068]"
            />

            {/* ── Middle row: 3 puzzle pieces ── */}
            {/* Left piece (beige/khaki) */}
            <path
                d="M72 72 L48 108 L24 108 L56 72 Z"
                className="fill-[#B8A98A] dark:fill-[#C4B89E]"
            />
            {/* Center piece (maroon/primary) */}
            <path
                d="M72 72 L168 72 L156 108 L84 108 Z"
                className="fill-[#7A1D3E] dark:fill-[#A03358]"
            />
            {/* Right piece (silver/gray) */}
            <path
                d="M168 72 L184 72 L216 108 L192 108 Z"
                className="fill-[#A8A9AD] dark:fill-[#B8B9BD]"
            />

            {/* ── Puzzle connectors (top row) ── */}
            <circle cx="96" cy="72" r="7"  className="fill-[#7A1D3E] dark:fill-[#A03358]" />
            <circle cx="144" cy="72" r="7" className="fill-[#7A1D3E] dark:fill-[#A03358]" />
            <circle cx="72" cy="90" r="6"  className="fill-[#B8A98A] dark:fill-[#C4B89E]" />
            <circle cx="168" cy="90" r="6" className="fill-[#A8A9AD] dark:fill-[#B8B9BD]" />

            {/* ── Text: GICEM ── */}
            <text
                x="120"
                y="152"
                textAnchor="middle"
                className="fill-[#2D5E4B] dark:fill-[#D5D0C8]"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="48"
                fontWeight="bold"
                letterSpacing="5"
            >
                GICEM
            </text>

            {/* ── Gold arc ── */}
            <path
                d="M52 168 Q120 198 188 168"
                className="stroke-[#B8963E] dark:stroke-[#C8A650]"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            />

            {/* ── Bottom diamond: 4 puzzle pieces ── */}
            {/* Bottom-left (gold) */}
            <path
                d="M84 180 L120 250 L58 204 Z"
                className="fill-[#B8963E] dark:fill-[#C8A650]"
            />
            {/* Bottom center-left (maroon) */}
            <path
                d="M84 180 L120 180 L120 250 Z"
                className="fill-[#7A1D3E] dark:fill-[#A03358]"
            />
            {/* Bottom center-right (silver) */}
            <path
                d="M120 180 L156 180 L120 250 Z"
                className="fill-[#A8A9AD] dark:fill-[#B8B9BD]"
            />
            {/* Bottom-right (dark gray) */}
            <path
                d="M156 180 L182 204 L120 250 Z"
                className="fill-[#6B6B6B] dark:fill-[#858585]"
            />

            {/* ── Puzzle connectors (bottom) ── */}
            <circle cx="120" cy="180" r="6" className="fill-[#7A1D3E] dark:fill-[#A03358]" />
            <circle cx="102" cy="215" r="5" className="fill-[#B8963E] dark:fill-[#C8A650]" />
            <circle cx="138" cy="215" r="5" className="fill-[#A8A9AD] dark:fill-[#B8B9BD]" />
        </svg>
    );
}

import { Button } from '@/components/ui/button';
import { AppearanceToggle } from '@/components/ux/appearance-toggle';
import { AppLogo } from '@/components/ux/app-logo';
import { CubePatternBg } from '@/components/ux/cube-pattern-bg';
import { Link, Head } from '@inertiajs/react';
import { FileText, LogIn, ShieldCheck, Users } from 'lucide-react';

const features = [
    {
        icon: FileText,
        title: 'Expediente Digital',
        description: 'Historial clínico centralizado y seguro.',
    },
    {
        icon: Users,
        title: 'Control de Grupos',
        description: 'Gestión inteligente de aulas y docentes.',
    },
    {
        icon: ShieldCheck,
        title: 'Privacidad Total',
        description: 'Protección de información sensible.',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="GICEM — Gestión Integral para Centros de Educación Múltiple" />

            <div className="relative flex h-screen flex-col overflow-hidden bg-background">
                <CubePatternBg />

                {/* Appearance toggle — top right */}
                <div className="absolute top-4 right-6 z-20">
                    <AppearanceToggle />
                </div>

                {/* Centered content */}
                <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
                    <div className="flex flex-col items-center text-center">
                        {/* Logo */}
                        <AppLogo className="mb-6 h-28 w-28 drop-shadow-lg" />

                        {/* Title */}
                        <h1 className="text-4xl leading-tight font-medium tracking-tight text-primary lg:text-5xl">
                            Gestión Integral para
                        </h1>
                        <p className="mt-1 text-4xl leading-tight font-bold tracking-tight text-foreground lg:text-5xl">
                            Centros de Educación Múltiple
                        </p>

                        {/* Subtitle */}
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                            Administra expedientes, grupos y procesos académicos de tu centro de atención múltiple con
                            una plataforma segura y pensada para tu equipo.
                        </p>

                        {/* CTA */}
                        <div className="mt-8">
                            <Button size="lg" className="gap-2 px-6" asChild>
                                <Link href="/login">
                                    <LogIn className="h-4 w-4" />
                                    Iniciar Sesión
                                </Link>
                            </Button>
                        </div>

                        {/* Feature pills */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="flex items-center gap-2.5 rounded-full border border-border/60 bg-card/70 px-4 py-2 shadow-sm backdrop-blur-sm"
                                >
                                    <feature.icon className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">{feature.title}</span>
                                    <span className="hidden text-sm text-muted-foreground sm:inline">
                                        — {feature.description}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 py-3 text-center">
                    <p className="text-xs tracking-wide text-muted-foreground/60">© 2026 SISTEMA GICEM V1.0</p>
                </footer>
            </div>
        </>
    );
}

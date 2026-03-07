import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppearanceToggle } from '@/components/ux/appearance-toggle';
import { AppLogo } from '@/components/ux/app-logo';
import { CubePatternBg } from '@/components/ux/cube-pattern-bg';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { type FormEvent } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/forgot-password');
    }

    return (
        <>
            <Head title="Recuperar Contraseña" />

            <div className="relative flex min-h-screen flex-col bg-background">
                <CubePatternBg />

                {/* Top bar */}
                <div className="relative z-10 flex items-center justify-between px-6 py-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        VOLVER AL INICIO DE SESION
                    </Link>
                    <AppearanceToggle />
                </div>

                {/* Centered card */}
                <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
                    {status && (
                        <div className="absolute top-0 left-1/2 w-full max-w-2xl -translate-x-1/2 px-4">
                            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                                {status}
                            </div>
                        </div>
                    )}

                    <div className="w-full max-w-[780px] overflow-hidden rounded-2xl bg-card shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left panel (guinda/primary) */}
                            <div className="flex flex-col items-center justify-center bg-primary px-8 py-12 text-center dark:bg-[oklch(0.28_0.06_9.01)] md:px-10 md:py-16">
                                <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-lg dark:bg-white/10 dark:shadow-none">
                                    <AppLogo className="size-16" />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold tracking-tight text-primary-foreground">
                                    Recuperar Acceso
                                </h2>
                                <p className="mt-1.5 text-[10px] font-semibold tracking-[0.2em] text-primary-foreground/50">
                                    SISTEMA GICEM
                                </p>

                                <div className="mt-6 h-px w-12 bg-primary-foreground/20" />

                                <p className="mt-6 max-w-[220px] text-sm leading-relaxed text-primary-foreground/60">
                                    Te enviaremos un enlace seguro a tu correo para que puedas restablecer tu contraseña.
                                </p>
                            </div>

                            {/* Right panel (form) */}
                            <div className="flex flex-col justify-center px-8 py-10 md:px-10 md:py-12">
                                <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                                    Recuperar Contraseña
                                </h1>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Ingresa tu correo electrónico registrado.
                                </p>

                                <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                                            CORREO ELECTRONICO
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/50" />
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="ejemplo@gicem.gob.mx"
                                                autoComplete="email"
                                                autoFocus
                                                className="h-11 pl-10"
                                                aria-invalid={!!errors.email}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 h-12 gap-2 text-xs font-semibold tracking-[0.12em]"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Mail className="size-4" />
                                        )}
                                        ENVIAR ENLACE DE RECUPERACION
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.05em] text-primary hover:underline"
                                        >
                                            <ArrowLeft className="size-3" />
                                            VOLVER AL INICIO DE SESION
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 py-4 text-center">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/40">
                        GICEM &middot; 2026 &middot;
                    </p>
                </footer>
            </div>
        </>
    );
}

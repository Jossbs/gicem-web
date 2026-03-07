import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppearanceToggle } from '@/components/ux/appearance-toggle';
import { AppLogo } from '@/components/ux/app-logo';
import { CubePatternBg } from '@/components/ux/cube-pattern-bg';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { type FormEvent } from 'react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/reset-password');
    }

    return (
        <>
            <Head title="Restablecer Contraseña" />

            <div className="relative flex min-h-screen flex-col bg-background">
                <CubePatternBg />

                {/* Top bar */}
                <div className="relative z-10 flex items-center justify-end px-6 py-4">
                    <AppearanceToggle />
                </div>

                {/* Centered card */}
                <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
                    <div className="w-full max-w-[780px] overflow-hidden rounded-2xl bg-card shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left panel (guinda/primary) */}
                            <div className="flex flex-col items-center justify-center bg-primary px-8 py-12 text-center dark:bg-[oklch(0.28_0.06_9.01)] md:px-10 md:py-16">
                                <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-lg dark:bg-white/10 dark:shadow-none">
                                    <AppLogo className="size-16" />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold tracking-tight text-primary-foreground">
                                    Crear Contraseña
                                </h2>
                                <p className="mt-1.5 text-[10px] font-semibold tracking-[0.2em] text-primary-foreground/50">
                                    SISTEMA GICEM
                                </p>

                                <div className="mt-6 h-px w-12 bg-primary-foreground/20" />

                                <p className="mt-6 max-w-[220px] text-sm leading-relaxed text-primary-foreground/60">
                                    Elige una contraseña segura para proteger tu cuenta y acceder a la plataforma.
                                </p>
                            </div>

                            {/* Right panel (form) */}
                            <div className="flex flex-col justify-center px-8 py-10 md:px-10 md:py-12">
                                <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                                    Restablecer Contraseña
                                </h1>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Ingresa tu nueva contraseña para continuar.
                                </p>

                                <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
                                    <input type="hidden" name="token" value={data.token} />

                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                                            CORREO ELECTRONICO
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/50" />
                                            <Input
                                                type="email"
                                                value={data.email}
                                                readOnly
                                                className="h-11 bg-muted pl-10"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                                            NUEVA CONTRASENA
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/50" />
                                            <Input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Minimo 8 caracteres"
                                                autoComplete="new-password"
                                                autoFocus
                                                className="h-11 pl-10"
                                                aria-invalid={!!errors.password}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs text-destructive">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                                            CONFIRMAR CONTRASENA
                                        </Label>
                                        <div className="relative">
                                            <KeyRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/50" />
                                            <Input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Repite la contraseña"
                                                autoComplete="new-password"
                                                className="h-11 pl-10"
                                                aria-invalid={!!errors.password_confirmation}
                                            />
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-xs text-destructive">{errors.password_confirmation}</p>
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
                                            <KeyRound className="size-4" />
                                        )}
                                        RESTABLECER CONTRASENA
                                    </Button>
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

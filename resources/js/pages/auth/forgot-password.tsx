import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
                <CubePatternBg />

                <div className="absolute top-4 right-6 z-20">
                    <AppearanceToggle />
                </div>

                <div className="relative z-10 w-full max-w-sm">
                    {status && (
                        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <Card>
                        <CardHeader className="items-center">
                            <AppLogo className="mb-2 h-20 w-20 drop-shadow-lg" />
                            <CardTitle className="text-xl">Recuperar Contraseña</CardTitle>
                            <CardDescription className="text-center">
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        autoComplete="email"
                                        autoFocus
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full gap-2" disabled={processing}>
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Mail className="h-4 w-4" />
                                    )}
                                    Enviar enlace de recuperación
                                </Button>

                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="h-3.5 w-3.5" />
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <footer className="relative z-10 mt-8">
                    <p className="text-xs tracking-wide text-muted-foreground/60">© 2026 SISTEMA GICEM V1.0</p>
                </footer>
            </div>
        </>
    );
}

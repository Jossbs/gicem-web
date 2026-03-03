import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppearanceToggle } from '@/components/ux/appearance-toggle';
import { AppLogo } from '@/components/ux/app-logo';
import { CubePatternBg } from '@/components/ux/cube-pattern-bg';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, Loader2 } from 'lucide-react';
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

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
                <CubePatternBg />

                <div className="absolute top-4 right-6 z-20">
                    <AppearanceToggle />
                </div>

                <div className="relative z-10 w-full max-w-sm">
                    <Card>
                        <CardHeader className="items-center">
                            <AppLogo className="mb-2 h-20 w-20 drop-shadow-lg" />
                            <CardTitle className="text-xl">Restablecer Contraseña</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <input type="hidden" name="token" value={data.token} />

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        readOnly
                                        className="bg-muted"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password">Nueva contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
                                        autoFocus
                                        aria-invalid={!!errors.password}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repite la contraseña"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password_confirmation}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full gap-2" disabled={processing}>
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <KeyRound className="h-4 w-4" />
                                    )}
                                    Restablecer Contraseña
                                </Button>
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

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';

interface EnumOption {
    value: string;
    label: string;
}

interface Props {
    roleOptions: EnumOption[];
    groupOptions: EnumOption[];
}

function StaffCreate({ roleOptions, groupOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        password: '',
        enviar_invitacion: true,
        rol_sistema: '',
        grupo_asignado_id: '',
        fotografia: null as File | null,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/staff');
    }

    return (
        <>
            <Head title="Nuevo Personal" />

            {/* Back link */}
            <Link
                href="/staff"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL DIRECTORIO
            </Link>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Nuevo Personal
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Registre un nuevo miembro del personal docente o administrativo.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                NOMBRE(S) *
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nombre(s)"
                                className="h-10"
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>

                        {/* Apellido paterno */}
                        <div className="space-y-2">
                            <Label htmlFor="apellido_paterno" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                APELLIDO PATERNO *
                            </Label>
                            <Input
                                id="apellido_paterno"
                                value={data.apellido_paterno}
                                onChange={(e) => setData('apellido_paterno', e.target.value)}
                                placeholder="Apellido paterno"
                                className="h-10"
                            />
                            {errors.apellido_paterno && <p className="text-xs text-destructive">{errors.apellido_paterno}</p>}
                        </div>

                        {/* Apellido materno */}
                        <div className="space-y-2">
                            <Label htmlFor="apellido_materno" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                APELLIDO MATERNO *
                            </Label>
                            <Input
                                id="apellido_materno"
                                value={data.apellido_materno}
                                onChange={(e) => setData('apellido_materno', e.target.value)}
                                placeholder="Apellido materno"
                                className="h-10"
                            />
                            {errors.apellido_materno && <p className="text-xs text-destructive">{errors.apellido_materno}</p>}
                        </div>

                        {/* Correo */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                CORREO ELECTRÓNICO *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="ejemplo@correo.com"
                                className="h-10"
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>

                        {/* Invitación por correo */}
                        <div className="col-span-full space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.enviar_invitacion}
                                    onChange={(e) => {
                                        setData('enviar_invitacion', e.target.checked);
                                        if (e.target.checked) setData('password', '');
                                    }}
                                    className="size-4 rounded border-input accent-primary"
                                />
                                <div>
                                    <span className="text-sm font-medium text-foreground">
                                        Enviar invitación por correo electrónico
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        El usuario recibirá un correo con un enlace para crear su contraseña y acceder al sistema.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Contraseña (solo si NO se envía invitación) */}
                        {!data.enviar_invitacion && (
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                    CONTRASEÑA *
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    className="h-10"
                                />
                                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                            </div>
                        )}

                        {/* Rol */}
                        <div className="space-y-2">
                            <Label htmlFor="rol_sistema" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                PERFIL DE USUARIO *
                            </Label>
                            <Select value={data.rol_sistema} onValueChange={(v) => setData('rol_sistema', v)}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.rol_sistema && <p className="text-xs text-destructive">{errors.rol_sistema}</p>}
                        </div>

                        {/* Grupo asignado */}
                        <div className="space-y-2">
                            <Label htmlFor="grupo_asignado_id" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                GRUPO ASIGNADO
                            </Label>
                            <Select
                                value={data.grupo_asignado_id}
                                onValueChange={(v) => setData('grupo_asignado_id', v === 'none' ? '' : v)}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin asignar</SelectItem>
                                    {groupOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.grupo_asignado_id && <p className="text-xs text-destructive">{errors.grupo_asignado_id}</p>}
                        </div>

                        {/* Fotografía */}
                        <div className="space-y-2">
                            <Label htmlFor="fotografia" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                FOTOGRAFÍA
                            </Label>
                            <Input
                                id="fotografia"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('fotografia', e.target.files?.[0] ?? null)}
                                className="h-10"
                            />
                            {errors.fotografia && <p className="text-xs text-destructive">{errors.fotografia}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                    >
                        <Save className="size-4" />
                        {processing ? 'GUARDANDO...' : 'GUARDAR PERSONAL'}
                    </Button>
                </div>
            </form>
        </>
    );
}

StaffCreate.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StaffCreate;

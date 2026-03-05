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

interface StaffMember {
    id: number;
    name: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    email: string;
    rol_sistema: string;
    grupo_asignado_id: number | null;
}

interface Props {
    member: StaffMember;
    roleOptions: EnumOption[];
    groupOptions: EnumOption[];
}

function StaffEdit({ member, roleOptions, groupOptions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: member.name,
        apellido_paterno: member.apellido_paterno ?? '',
        apellido_materno: member.apellido_materno ?? '',
        email: member.email,
        password: '',
        rol_sistema: member.rol_sistema,
        grupo_asignado_id: member.grupo_asignado_id ? String(member.grupo_asignado_id) : '',
        fotografia: null as File | null,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/staff/${member.id}`);
    }

    return (
        <>
            <Head title="Editar Personal" />

            <Link
                href={`/staff/${member.id}`}
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL PERFIL
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Personal</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {member.apellido_paterno} {member.apellido_materno}, {member.name}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                        <FormField label="NOMBRE(S) *" error={errors.name}>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="APELLIDO PATERNO *" error={errors.apellido_paterno}>
                            <Input value={data.apellido_paterno} onChange={(e) => setData('apellido_paterno', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="APELLIDO MATERNO *" error={errors.apellido_materno}>
                            <Input value={data.apellido_materno} onChange={(e) => setData('apellido_materno', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="CORREO ELECTRÓNICO *" error={errors.email}>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="CONTRASEÑA" error={errors.password}>
                            <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Dejar vacío para no cambiar" className="h-10" />
                        </FormField>
                        <FormField label="PERFIL DE USUARIO *" error={errors.rol_sistema}>
                            <Select value={data.rol_sistema} onValueChange={(v) => setData('rol_sistema', v)}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>{roleOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="GRUPO ASIGNADO" error={errors.grupo_asignado_id}>
                            <Select value={data.grupo_asignado_id} onValueChange={(v) => setData('grupo_asignado_id', v === 'none' ? '' : v)}>
                                <SelectTrigger className="h-10"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin asignar</SelectItem>
                                    {groupOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="FOTOGRAFÍA" error={errors.fotografia}>
                            <Input type="file" accept="image/*" onChange={(e) => setData('fotografia', e.target.files?.[0] ?? null)} className="h-10" />
                        </FormField>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={processing} className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]">
                        <Save className="size-4" /> {processing ? 'GUARDANDO...' : 'ACTUALIZAR PERSONAL'}
                    </Button>
                </div>
            </form>
        </>
    );
}

function FormField({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={`space-y-2 ${className ?? ''}`}>
            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">{label}</Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

StaffEdit.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StaffEdit;

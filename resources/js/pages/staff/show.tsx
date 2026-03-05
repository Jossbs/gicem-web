import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Briefcase, ChevronDown, ChevronUp, Mail, Pencil, Trash2, User } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface StaffMember {
    id: number;
    name: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    email: string;
    rol_sistema: string;
    fotografia_url: string | null;
    fotografia_display_url: string | null;
    grupo_asignado: {
        id: number;
        nombre_grupo: string;
    } | null;
}

const roleLabels: Record<string, string> = {
    admin: 'Administrador', trabajador_social: 'Trabajador Social', docente: 'Docente',
};
const roleStyles: Record<string, string> = {
    admin: 'border-primary/30 bg-primary/8 text-primary',
    trabajador_social: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    docente: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
};

function getInitials(member: StaffMember): string {
    const first = member.name?.[0] ?? '';
    const last = member.apellido_paterno?.[0] ?? '';
    return (first + last).toUpperCase();
}

function StaffShow({ member }: { member: StaffMember }) {
    const fullName = member.name +
        ([member.apellido_paterno, member.apellido_materno].filter(Boolean).length > 0
            ? ' ' + [member.apellido_paterno, member.apellido_materno].filter(Boolean).join(' ')
            : '');

    return (
        <>
            <Head title={fullName} />

            <Link
                href="/staff"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL DIRECTORIO
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <Card className="shadow-sm">
                        <CardContent className="px-5 py-4">
                            <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">ACCIONES</p>
                            <div className="flex flex-col gap-2">
                                <Button className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                                    <Link href={`/staff/${member.id}/edit`}>
                                        <Pencil className="size-3.5" />
                                        EDITAR PERSONAL
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em]"
                                    onClick={() => router.post(`/staff/${member.id}/send-invitation`)}
                                >
                                    <Mail className="size-3.5" />
                                    ENVIAR INVITACION
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em] text-destructive hover:bg-destructive/8 hover:text-destructive">
                                            <Trash2 className="size-3.5" />
                                            ELIMINAR PERSONAL
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Eliminar personal</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta accion no se puede deshacer. Se eliminara permanentemente el registro de {member.name} {member.apellido_paterno}.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => router.delete(`/staff/${member.id}`)}
                                            >
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main content */}
                <div className="space-y-4 lg:col-span-9">
                    {/* Header card con foto grande */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="bg-primary px-6 py-6">
                            <div className="flex gap-5">
                                <div className="shrink-0">
                                    {member.fotografia_display_url ? (
                                        <img
                                            src={member.fotografia_display_url}
                                            alt=""
                                            className="size-36 rounded-lg border-2 border-primary-foreground/15 object-cover shadow-lg"
                                        />
                                    ) : (
                                        <div className="flex size-36 items-center justify-center rounded-lg border-2 border-primary-foreground/15 bg-primary-foreground/10 text-3xl font-bold text-primary-foreground shadow-lg">
                                            {getInitials(member)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <p className="text-[10px] font-bold tracking-[0.15em] text-primary-foreground/60">PERSONAL — GICEM</p>
                                    <h1 className="mt-1 text-2xl font-bold leading-tight text-primary-foreground">{fullName}</h1>
                                    <p className="mt-1 text-sm text-primary-foreground/70">{member.email}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <Badge className="border border-primary-foreground/25 bg-primary-foreground/15 text-[10px] font-semibold tracking-wider text-primary-foreground">
                                            {roleLabels[member.rol_sistema] ?? member.rol_sistema}
                                        </Badge>
                                        {member.grupo_asignado && (
                                            <Badge variant="outline" className="border-primary-foreground/20 text-[10px] font-semibold tracking-wider text-primary-foreground/80">
                                                {member.grupo_asignado.nombre_grupo}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <CollapsibleSection title="DATOS PERSONALES" icon={User} defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DataItem label="Nombre(s)" value={member.name} />
                            <DataItem label="Apellido paterno" value={member.apellido_paterno ?? 'No registrado'} />
                            <DataItem label="Apellido materno" value={member.apellido_materno ?? 'No registrado'} />
                            <DataItem label="Correo electronico" value={member.email} />
                            <DataItem label="Rol del sistema" value={roleLabels[member.rol_sistema] ?? member.rol_sistema} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="ASIGNACION" icon={Briefcase} defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <DataItem label="Grupo asignado" value={member.grupo_asignado?.nombre_grupo ?? 'Sin asignar'} />
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
}

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="overflow-hidden shadow-sm">
            <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between bg-primary/8 px-6 py-3 text-left transition-colors hover:bg-primary/12">
                <span className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    <span className="text-[11px] font-bold tracking-[0.1em] text-primary">{title}</span>
                </span>
                {open ? <ChevronUp className="size-4 text-primary" /> : <ChevronDown className="size-4 text-primary" />}
            </button>
            {open && <CardContent className="px-6 py-4">{children}</CardContent>}
        </Card>
    );
}

function DataItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm text-foreground">{value}</p>
        </div>
    );
}

StaffShow.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StaffShow;

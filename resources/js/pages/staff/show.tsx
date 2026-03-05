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
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Pencil, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface StaffMember {
    id: number;
    name: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    email: string;
    rol_sistema: string;
    fotografia_url: string | null;
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

function StaffShow({ member }: { member: StaffMember }) {
    return (
        <>
            <Head title={`${member.apellido_paterno ?? ''} ${member.apellido_materno ?? ''}, ${member.name}`} />

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
                                    ENVIAR INVITACIÓN
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
                                                Esta acción no se puede deshacer. Se eliminará permanentemente el registro de {member.name} {member.apellido_paterno}.
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
                    {/* Header */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="bg-primary px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-primary-foreground">
                                        {member.apellido_paterno} {member.apellido_materno}, {member.name}
                                    </h1>
                                    <p className="mt-0.5 text-sm text-primary-foreground/70">{member.email}</p>
                                </div>
                                <Badge variant="outline" className={`${roleStyles[member.rol_sistema] ?? ''} border-primary-foreground/20 text-[10px] font-semibold tracking-wider`}>
                                    {roleLabels[member.rol_sistema] ?? member.rol_sistema}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <CollapsibleSection title="DATOS PERSONALES" defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DataItem label="Nombre(s)" value={member.name} />
                            <DataItem label="Apellido paterno" value={member.apellido_paterno ?? 'No registrado'} />
                            <DataItem label="Apellido materno" value={member.apellido_materno ?? 'No registrado'} />
                            <DataItem label="Correo electrónico" value={member.email} />
                            <DataItem label="Rol del sistema" value={roleLabels[member.rol_sistema] ?? member.rol_sistema} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="ASIGNACIÓN" defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <DataItem label="Grupo asignado" value={member.grupo_asignado?.nombre_grupo ?? 'Sin asignar'} />
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
}

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="overflow-hidden shadow-sm">
            <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between bg-primary/8 px-6 py-3 text-left transition-colors hover:bg-primary/12">
                <span className="text-[11px] font-bold tracking-[0.1em] text-primary">{title}</span>
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

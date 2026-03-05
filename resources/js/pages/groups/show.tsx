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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, Pencil, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Student {
    id: number;
    nombre_completo: string;
    apellido_paterno: string;
    apellido_materno: string;
    discapacidad: string;
    estatus_alumno: string;
    grado_grupo: string | null;
}

interface Group {
    id: number;
    nombre_grupo: string;
    nivel_educativo: string;
    grado: string;
    turno: string;
    aula_fisica: string;
    capacidad_maxima: number;
    ciclo_escolar: string;
    especialidad_grupo: string[];
    students_count: number;
    docente: { id: number; name: string; apellido_paterno: string | null; apellido_materno: string | null } | null;
    students: Student[];
}

const levelLabels: Record<string, string> = {
    maternal: 'Maternal', preescolar: 'Preescolar', primaria: 'Primaria', secundaria: 'Secundaria', laboral: 'Laboral',
};
const gradeLabels: Record<string, string> = {
    primero: '1\u00B0', segundo: '2\u00B0', tercero: '3\u00B0', cuarto: '4\u00B0', quinto: '5\u00B0', sexto: '6\u00B0', unico: '\u00DAnico',
};
const shiftLabels: Record<string, string> = { matutino: 'Matutino', vespertino: 'Vespertino' };
const specialtyLabels: Record<string, string> = {
    intelectual: 'Intelectual', motriz: 'Motriz', visual: 'Visual', auditiva: 'Auditiva',
    psicosocial: 'Psicosocial', multiple: 'M\u00FAltiple', tea_autismo: 'TEA / Autismo', otra: 'Otra',
};
const disabilityLabels: Record<string, string> = specialtyLabels;
const statusLabels: Record<string, string> = { activo: 'Activo', baja_temporal: 'Baja temporal', egresado: 'Egresado' };
const statusColors: Record<string, string> = {
    activo: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    baja_temporal: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    egresado: 'border-neutral/30 bg-neutral/8 text-neutral',
};

function GroupsShow({ group }: { group: Group }) {
    return (
        <>
            <Head title={group.nombre_grupo} />

            <Link
                href="/groups"
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
                                    <Link href={`/groups/${group.id}/edit`}>
                                        <Pencil className="size-3.5" />
                                        EDITAR GRUPO
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em] text-destructive hover:bg-destructive/8 hover:text-destructive">
                                            <Trash2 className="size-3.5" />
                                            ELIMINAR GRUPO
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Eliminar grupo</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente el grupo {group.nombre_grupo}.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => router.delete(`/groups/${group.id}`)}
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
                            <h1 className="text-xl font-bold text-primary-foreground">{group.nombre_grupo}</h1>
                            <p className="mt-0.5 text-sm text-primary-foreground/70">
                                {levelLabels[group.nivel_educativo] ?? group.nivel_educativo} &middot; {shiftLabels[group.turno] ?? group.turno} &middot; Ciclo {group.ciclo_escolar}
                            </p>
                        </div>
                    </Card>

                    <CollapsibleSection title="INFORMACIÓN DEL GRUPO" defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DataItem label="Nombre del grupo" value={group.nombre_grupo} />
                            <DataItem label="Docente titular" value={group.docente ? `${group.docente.name} ${group.docente.apellido_paterno ?? ''} ${group.docente.apellido_materno ?? ''}`.trim() : 'Sin asignar'} />
                            <DataItem label="Nivel educativo" value={levelLabels[group.nivel_educativo] ?? group.nivel_educativo} />
                            <DataItem label="Grado" value={gradeLabels[group.grado] ?? group.grado} />
                            <DataItem label="Turno" value={shiftLabels[group.turno] ?? group.turno} />
                            <DataItem label="Aula física" value={group.aula_fisica} />
                            <DataItem label="Capacidad" value={`${group.students?.length ?? 0} / ${group.capacidad_maxima}`} />
                            <DataItem label="Ciclo escolar" value={group.ciclo_escolar} />
                            <DataItem label="Especialidades" value={(group.especialidad_grupo ?? []).map((s) => specialtyLabels[s] ?? s).join(', ')} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="ALUMNOS INSCRITOS" defaultOpen>
                        {(group.students?.length ?? 0) === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay alumnos inscritos en este grupo.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-primary/5">
                                            <TableHead className="text-[11px] font-bold tracking-[0.1em]">ALUMNO</TableHead>
                                            <TableHead className="text-[11px] font-bold tracking-[0.1em]">DISCAPACIDAD</TableHead>
                                            <TableHead className="text-[11px] font-bold tracking-[0.1em]">ESTATUS</TableHead>
                                            <TableHead className="text-right text-[11px] font-bold tracking-[0.1em]">VER</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.students.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-medium">{s.apellido_paterno} {s.apellido_materno}, {s.nombre_completo}</TableCell>
                                                <TableCell>{disabilityLabels[s.discapacidad] ?? s.discapacidad}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-[10px] font-semibold tracking-wider ${statusColors[s.estatus_alumno] ?? ''}`}>
                                                        {statusLabels[s.estatus_alumno] ?? s.estatus_alumno}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="size-8 p-0" asChild>
                                                        <Link href={`/students/${s.id}`}><Eye className="size-4" /></Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
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

GroupsShow.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default GroupsShow;

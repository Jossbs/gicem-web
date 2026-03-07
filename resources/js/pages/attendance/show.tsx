import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { type Auth } from '@/types/data/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarCheck, FolderOpen, Pencil } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface StudentRow {
    id: number;
    nombre_completo: string;
    apellido_paterno: string;
    apellido_materno: string;
    discapacidad: string | null;
    estatus: string | null;
    observaciones: string | null;
    recorded_by: string | null;
}

interface Group {
    id: number;
    nombre_grupo: string;
    nivel_educativo: string;
    turno: string;
    docente: { id: number; name: string; apellido_paterno: string | null; apellido_materno: string | null } | null;
}

interface Summary {
    presente: number;
    falta: number;
    retardo: number;
    justificado: number;
    sin_registro: number;
    total: number;
}

interface Props {
    group: Group;
    students: StudentRow[];
    fecha: string;
    summary: Summary;
}

const levelLabels: Record<string, string> = {
    maternal: 'Maternal',
    preescolar: 'Preescolar',
    primaria: 'Primaria',
    secundaria: 'Secundaria',
    laboral: 'Laboral',
};

const shiftLabels: Record<string, string> = {
    matutino: 'Matutino',
    vespertino: 'Vespertino',
};

const disabilityLabels: Record<string, string> = {
    intelectual: 'Intelectual',
    motriz: 'Motriz',
    visual: 'Visual',
    auditiva: 'Auditiva',
    psicosocial: 'Psicosocial',
    multiple: 'Multiple',
    tea_autismo: 'TEA / Autismo',
    otra: 'Otra',
};

const statusLabels: Record<string, string> = {
    presente: 'Presente',
    falta: 'Falta',
    retardo: 'Retardo',
    justificado: 'Justificado',
};

const statusColors: Record<string, string> = {
    presente: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    falta: 'border-destructive/30 bg-destructive/8 text-destructive',
    retardo: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    justificado: 'border-informative/30 bg-informative/8 text-informative',
};

const summaryConfig = [
    { key: 'presente' as const, label: 'Presentes', color: 'text-affirmative', bg: 'bg-affirmative/8' },
    { key: 'falta' as const, label: 'Faltas', color: 'text-destructive', bg: 'bg-destructive/8' },
    { key: 'retardo' as const, label: 'Retardos', color: 'text-preventive-foreground', bg: 'bg-preventive/8' },
    { key: 'justificado' as const, label: 'Justificados', color: 'text-informative', bg: 'bg-informative/8' },
    { key: 'sin_registro' as const, label: 'Sin registro', color: 'text-muted-foreground', bg: 'bg-muted' },
];

function AttendanceShow({ group, students, fecha, summary }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;
    const [selectedFecha, setSelectedFecha] = useState(fecha);

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-MX', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    function changeDate(newFecha: string) {
        setSelectedFecha(newFecha);
        router.get(
            `/attendance/${group.id}/show`,
            { fecha: newFecha },
            { preserveState: true, preserveScroll: true },
        );
    }

    const hasRecords = summary.total - summary.sin_registro > 0;

    return (
        <>
            <Head title={`Asistencia - ${group.nombre_grupo}`} />

            <Link
                href="/attendance"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR A ASISTENCIA
            </Link>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Asistencia — {group.nombre_grupo}
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {levelLabels[group.nivel_educativo] ?? group.nivel_educativo} &middot;{' '}
                        {shiftLabels[group.turno] ?? group.turno} &middot; {formatDate(selectedFecha)}
                    </p>
                </div>
                {can['attendance.take'] && (
                    <Button className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                        <Link href={`/attendance/${group.id}/take?fecha=${selectedFecha}`}>
                            <Pencil className="size-4" />
                            {hasRecords ? 'EDITAR LISTA' : 'TOMAR LISTA'}
                        </Link>
                    </Button>
                )}
            </div>

            {/* Date selector */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <CalendarCheck className="size-4 text-primary" />
                        <span className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">FECHA</span>
                        <Input
                            type="date"
                            value={selectedFecha}
                            onChange={(e) => changeDate(e.target.value)}
                            className="h-10 w-[200px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {summaryConfig.map((item) => (
                    <Card key={item.key} className="py-0 shadow-sm">
                        <CardContent className={`px-4 py-3 ${item.bg} rounded-xl`}>
                            <p className="text-2xl font-bold tabular-nums">{summary[item.key]}</p>
                            <p className={`text-[11px] font-semibold tracking-[0.05em] ${item.color}`}>
                                {item.label}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card className="py-0 shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary dark:bg-[oklch(0.28_0.06_9.01)] dark:hover:bg-[oklch(0.28_0.06_9.01)]">
                                <TableHead className="w-[40px] text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    #
                                </TableHead>
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ALUMNO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    DISCAPACIDAD
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ASISTENCIA
                                </TableHead>
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    OBSERVACIONES
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    REGISTRADO POR
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <FolderOpen className="size-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    No hay alumnos en este grupo
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student, index) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="text-center text-xs text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-medium">
                                                {student.apellido_paterno} {student.apellido_materno},{' '}
                                                {student.nombre_completo}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center text-xs text-muted-foreground">
                                            {student.discapacidad
                                                ? (disabilityLabels[student.discapacidad] ?? student.discapacidad)
                                                : '\u2014'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {student.estatus ? (
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] font-semibold tracking-wider ${statusColors[student.estatus] ?? ''}`}
                                                >
                                                    {statusLabels[student.estatus] ?? student.estatus}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Sin registro</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-muted-foreground">
                                                {student.observaciones || '\u2014'}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center text-xs text-muted-foreground">
                                            {student.recorded_by || '\u2014'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </>
    );
}

AttendanceShow.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AttendanceShow;

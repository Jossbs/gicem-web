import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { ArrowLeft, Check, Save, Users } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface StudentRow {
    id: number;
    nombre_completo: string;
    apellido_paterno: string;
    apellido_materno: string;
    discapacidad: string | null;
    estatus: string;
    observaciones: string;
}

interface Group {
    id: number;
    nombre_grupo: string;
    nivel_educativo: string;
    turno: string;
    docente: { id: number; name: string; apellido_paterno: string | null; apellido_materno: string | null } | null;
}

interface EnumOption {
    value: string;
    label: string;
}

interface Props {
    group: Group;
    students: StudentRow[];
    fecha: string;
    statusOptions: EnumOption[];
    isExisting: boolean;
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

const statusColors: Record<string, string> = {
    presente: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    falta: 'border-destructive/30 bg-destructive/8 text-destructive',
    retardo: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    justificado: 'border-informative/30 bg-informative/8 text-informative',
};

function AttendanceTake({ group, students: initialStudents, fecha, statusOptions, isExisting }: Props) {
    const [records, setRecords] = useState(() =>
        initialStudents.map((s) => ({
            student_id: s.id,
            estatus: s.estatus || '',
            observaciones: s.observaciones || '',
        })),
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-MX', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    function setRecordField(index: number, field: 'estatus' | 'observaciones', value: string) {
        setRecords((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    }

    function markAllAs(estatus: string) {
        setRecords((prev) => prev.map((r) => ({ ...r, estatus })));
    }

    function handleSubmit() {
        const incomplete = records.some((r) => !r.estatus);
        if (incomplete) {
            setErrors({ records: 'Seleccione el estatus de asistencia para cada alumno.' });
            return;
        }

        setProcessing(true);
        setErrors({});

        router.post(
            `/attendance/${group.id}`,
            { fecha, records },
            {
                onFinish: () => setProcessing(false),
                onError: (errs) => setErrors(errs),
            },
        );
    }

    const filledCount = records.filter((r) => r.estatus).length;

    return (
        <>
            <Head title={`Tomar lista - ${group.nombre_grupo}`} />

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
                        {isExisting ? 'Editar asistencia' : 'Tomar lista'} — {group.nombre_grupo}
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {levelLabels[group.nivel_educativo] ?? group.nivel_educativo} &middot;{' '}
                        {shiftLabels[group.turno] ?? group.turno} &middot; {formatDate(fecha)}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="size-4" />
                    <span>
                        {filledCount} / {records.length} registrados
                    </span>
                </div>
            </div>

            {/* Quick actions */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                            MARCAR TODOS COMO:
                        </span>
                        {statusOptions.map((opt) => (
                            <Button
                                key={opt.value}
                                variant="outline"
                                size="sm"
                                className="h-8 text-[10px] font-semibold tracking-[0.05em]"
                                onClick={() => markAllAs(opt.value)}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Error */}
            {errors.records && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                    {errors.records}
                </div>
            )}

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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                                        No hay alumnos activos en este grupo.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialStudents.map((student, index) => (
                                    <TableRow
                                        key={student.id}
                                        className={records[index].estatus ? '' : 'bg-preventive/4'}
                                    >
                                        <TableCell className="text-center text-xs text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {student.apellido_paterno} {student.apellido_materno},{' '}
                                                    {student.nombre_completo}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {student.discapacidad ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {disabilityLabels[student.discapacidad] ?? student.discapacidad}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">&mdash;</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Select
                                                value={records[index].estatus}
                                                onValueChange={(v) => setRecordField(index, 'estatus', v)}
                                            >
                                                <SelectTrigger className="mx-auto h-9 w-[150px]">
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={records[index].observaciones}
                                                onChange={(e) =>
                                                    setRecordField(index, 'observaciones', e.target.value)
                                                }
                                                placeholder="Notas opcionales..."
                                                className="h-9 text-xs"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Actions */}
            {initialStudents.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {filledCount === records.length ? (
                            <span className="flex items-center gap-1 text-affirmative">
                                <Check className="size-3.5" />
                                Todos los alumnos tienen asistencia registrada
                            </span>
                        ) : (
                            `${records.length - filledCount} alumno(s) sin registrar`
                        )}
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-11 text-xs font-semibold tracking-[0.1em]" asChild>
                            <Link href="/attendance">CANCELAR</Link>
                        </Button>
                        <Button
                            className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            <Save className="size-4" />
                            GUARDAR ASISTENCIA
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

AttendanceTake.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AttendanceTake;

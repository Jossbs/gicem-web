import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { type Auth } from '@/types/data/auth';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarCheck, ClipboardList, Eye, Users } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Group {
    id: number;
    nombre_grupo: string;
    nivel_educativo: string;
    turno: string;
    aula_fisica: string;
    ciclo_escolar: string;
    docente: { id: number; name: string; apellido_paterno: string | null; apellido_materno: string | null } | null;
}

interface Props {
    groups: Group[];
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

function AttendanceIndex({ groups }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;
    const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);

    function getDocenteName(docente: Group['docente']): string {
        if (!docente) return 'Sin asignar';
        return [docente.name, docente.apellido_paterno, docente.apellido_materno].filter(Boolean).join(' ');
    }

    return (
        <>
            <Head title="Asistencia" />

            <Link
                href="/dashboard"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL PANEL
            </Link>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Control de Asistencia</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Selecciona un grupo y la fecha para tomar lista o consultar registros.
                </p>
            </div>

            {/* Date picker */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <CalendarCheck className="size-4 text-primary" />
                        <span className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground">FECHA</span>
                        <Input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="h-10 w-[200px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Groups grid */}
            {groups.length === 0 ? (
                <Card className="shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Users className="mb-3 size-10 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">No hay grupos disponibles</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            No tienes grupos asignados o no se han creado grupos aun.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                        <Card key={group.id} className="shadow-sm transition-shadow hover:shadow-md">
                            <CardContent className="px-5 py-4">
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">{group.nombre_grupo}</h3>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {levelLabels[group.nivel_educativo] ?? group.nivel_educativo} &middot;{' '}
                                            {shiftLabels[group.turno] ?? group.turno}
                                        </p>
                                    </div>
                                    <ClipboardList className="size-5 text-primary/40" />
                                </div>

                                <div className="mb-4 space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-semibold">Docente:</span> {getDocenteName(group.docente)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-semibold">Aula:</span> {group.aula_fisica}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {can['attendance.take'] && (
                                        <Button size="sm" className="flex-1 gap-1.5 text-[10px] font-semibold tracking-[0.05em]" asChild>
                                            <Link href={`/attendance/${group.id}/take?fecha=${fecha}`}>
                                                <CalendarCheck className="size-3.5" />
                                                TOMAR LISTA
                                            </Link>
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-1.5 text-[10px] font-semibold tracking-[0.05em]"
                                        asChild
                                    >
                                        <Link href={`/attendance/${group.id}/show?fecha=${fecha}`}>
                                            <Eye className="size-3.5" />
                                            VER REGISTROS
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

AttendanceIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AttendanceIndex;

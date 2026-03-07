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
import { type Auth } from '@/types/data/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Eye,
    FolderOpen,
    Plus,
    Trash2,
} from 'lucide-react';
import { type ReactNode } from 'react';

interface Student {
    id: number;
    nombre_completo: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    fotografia_display_url: string | null;
}

interface LogEntry {
    id: number;
    fecha_nota: string;
    categoria: string;
    descripcion: string;
    evidencia_display_url: string | null;
    notificar_padres: boolean;
    created_at: string;
    created_by: { id: number; name: string } | null;
}

interface EnumOption {
    value: string;
    label: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    student: Student;
    logEntries: PaginatedData<LogEntry>;
    filters: {
        categoria?: string;
    };
    categoryOptions: EnumOption[];
}

const categoryColors: Record<string, string> = {
    logro: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    conducta: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    salud: 'border-informative/30 bg-informative/8 text-informative',
    incidente: 'border-destructive/30 bg-destructive/8 text-destructive',
};

const categoryLabels: Record<string, string> = {
    logro: 'Logro',
    conducta: 'Conducta',
    salud: 'Salud',
    incidente: 'Incidente',
};

function LogEntriesIndex({ student, logEntries, filters, categoryOptions }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;

    const fullName =
        (student.nombre_completo ?? 'Sin nombre') +
        ([student.apellido_paterno, student.apellido_materno].filter(Boolean).length > 0
            ? ' ' + [student.apellido_paterno, student.apellido_materno].filter(Boolean).join(' ')
            : '');

    function getInitials(): string {
        const first = student.nombre_completo?.[0] ?? '';
        const last = student.apellido_paterno?.[0] ?? '';
        return (first + last).toUpperCase();
    }

    function formatDate(dateStr: string): string {
        const date = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    function formatDateTime(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function applyFilters(newFilters: Record<string, string | undefined>) {
        router.get(
            `/students/${student.id}/log-entries`,
            { ...filters, ...newFilters, page: undefined },
            { preserveState: true, preserveScroll: true },
        );
    }

    const hasActiveFilters = !!filters.categoria;

    return (
        <>
            <Head title={`Bitacora - ${fullName}`} />

            <Link
                href={`/students/${student.id}`}
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL EXPEDIENTE
            </Link>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    {student.fotografia_display_url ? (
                        <img
                            src={student.fotografia_display_url}
                            alt=""
                            className="size-12 rounded-lg border object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex size-12 items-center justify-center rounded-lg border bg-primary/8 text-sm font-bold text-primary shadow-sm">
                            {getInitials()}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Bitacora</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Control diario de {fullName}.
                        </p>
                    </div>
                </div>
                {can['log-entries.create'] && (
                    <Button className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                        <Link href={`/students/${student.id}/log-entries/create`}>
                            <Plus className="size-4" />
                            NUEVA ANOTACION
                        </Link>
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={filters.categoria ?? 'all'}
                            onValueChange={(v) => applyFilters({ categoria: v === 'all' ? undefined : v })}
                        >
                            <SelectTrigger className="h-10 w-[200px]">
                                <SelectValue placeholder="Tipo de registro" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                {categoryOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => applyFilters({ categoria: undefined })}
                                className="h-10 text-xs text-muted-foreground"
                            >
                                Limpiar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="py-0 shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary dark:bg-[oklch(0.28_0.06_9.01)] dark:hover:bg-[oklch(0.28_0.06_9.01)]">
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    FECHA
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    TIPO
                                </TableHead>
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    OBSERVACIONES
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    REGISTRADO POR
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    NOTIFICADO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ACCIONES
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logEntries.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <FolderOpen className="size-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    No se encontraron registros
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Intente con otros filtros o limpie la busqueda.'
                                                        : 'Las anotaciones del control diario apareceran aqui.'}
                                                </p>
                                            </div>
                                            {!hasActiveFilters && can['log-entries.create'] && (
                                                <Button
                                                    size="sm"
                                                    className="mt-2 gap-2 text-xs font-semibold tracking-[0.1em]"
                                                    asChild
                                                >
                                                    <Link href={`/students/${student.id}/log-entries/create`}>
                                                        <Plus className="size-3.5" />
                                                        NUEVA ANOTACION
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logEntries.data.map((entry) => (
                                    <TableRow key={entry.id} className="group">
                                        <TableCell className="text-center text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDate(entry.fecha_nota)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-semibold tracking-wider ${categoryColors[entry.categoria] ?? ''}`}
                                            >
                                                {categoryLabels[entry.categoria] ?? entry.categoria}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[350px]">
                                            <p className="truncate text-sm">{entry.descripcion}</p>
                                            {entry.evidencia_display_url && (
                                                <a
                                                    href={entry.evidencia_display_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                                                >
                                                    <Eye className="size-3" />
                                                    Ver evidencia
                                                </a>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-sm text-muted-foreground whitespace-nowrap">
                                            {entry.created_by?.name ?? 'Sistema'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {entry.notificar_padres ? (
                                                <Badge
                                                    variant="outline"
                                                    className="border-golden/30 bg-golden/8 text-[10px] font-semibold tracking-wider text-golden"
                                                >
                                                    Si
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {can['log-entries.delete'] && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="size-8 p-0 text-destructive opacity-60 hover:text-destructive group-hover:opacity-100"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Eliminar registro</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Se eliminara permanentemente esta anotacion de la
                                                                    bitacora. Esta accion no se puede deshacer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    onClick={() =>
                                                                        router.delete(
                                                                            `/students/${student.id}/log-entries/${entry.id}`,
                                                                        )
                                                                    }
                                                                >
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {logEntries.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Mostrando <span className="font-medium text-foreground">{logEntries.data.length}</span> de{' '}
                            <span className="font-medium text-foreground">{logEntries.total}</span> registros
                        </p>
                        <div className="flex gap-1">
                            {logEntries.links.map((link, i) => {
                                const label = link.label
                                    .replace('&laquo;', '\u00AB')
                                    .replace('&raquo;', '\u00BB')
                                    .replace('Previous', 'Ant.')
                                    .replace('Next', 'Sig.');

                                return (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        className="h-8 min-w-8 text-xs"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url} preserveState preserveScroll>
                                                {label}
                                            </Link>
                                        ) : (
                                            <span>{label}</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
}

LogEntriesIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default LogEntriesIndex;

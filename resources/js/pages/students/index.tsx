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
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Eye,
    FileEdit,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Student {
    id: number;
    curp: string | null;
    nombre_completo: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    discapacidad: string | null;
    grado_grupo: string | null;
    estatus_alumno: string | null;
    status: string;
    created_at: string;
    updated_at: string;
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
    students: PaginatedData<Student>;
    drafts: Student[];
    filters: {
        search?: string;
        discapacidad?: string;
        estatus?: string;
        grupo?: string;
    };
    disabilityOptions: EnumOption[];
    statusOptions: EnumOption[];
    groupOptions: string[];
}

const statusColors: Record<string, string> = {
    activo: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    baja_temporal: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    egresado: 'border-neutral/30 bg-neutral/8 text-neutral',
};

const statusLabels: Record<string, string> = {
    activo: 'Activo', baja_temporal: 'Baja temporal', egresado: 'Egresado',
};

const disabilityLabels: Record<string, string> = {
    intelectual: 'Intelectual', motriz: 'Motriz', visual: 'Visual', auditiva: 'Auditiva',
    psicosocial: 'Psicosocial', multiple: 'Múltiple', tea_autismo: 'TEA / Autismo', otra: 'Otra',
};

function StudentsIndex({ students, drafts, filters, disabilityOptions, statusOptions, groupOptions }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [draftsOpen, setDraftsOpen] = useState(drafts.length > 0);

    function applyFilters(newFilters: Record<string, string | undefined>) {
        router.get(
            '/students',
            { ...filters, ...newFilters, page: undefined },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilters({ search });
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    return (
        <>
            <Head title="Directorio de Alumnos" />

            <Link
                href="/dashboard"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL PANEL
            </Link>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Directorio de Alumnos
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestión de expedientes digitales del padrón escolar.
                    </p>
                </div>
                <Button className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                    <Link href="/students/create">
                        <Plus className="size-4" />
                        NUEVO EXPEDIENTE
                    </Link>
                </Button>
            </div>

            {/* Borradores */}
            {drafts.length > 0 && (
                <Card className="mb-6 py-0 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setDraftsOpen(!draftsOpen)}
                        className="flex w-full items-center justify-between bg-preventive/8 px-5 py-3 text-left transition-colors hover:bg-preventive/12"
                    >
                        <span className="flex items-center gap-2">
                            <FileEdit className="size-4 text-preventive-foreground" />
                            <span className="text-[11px] font-bold tracking-[0.1em] text-preventive-foreground">
                                BORRADORES PENDIENTES ({drafts.length})
                            </span>
                        </span>
                        {draftsOpen ? <ChevronUp className="size-4 text-preventive-foreground" /> : <ChevronDown className="size-4 text-preventive-foreground" />}
                    </button>
                    {draftsOpen && (
                        <CardContent className="px-5 py-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {drafts.map((draft) => {
                                    const name = [draft.apellido_paterno, draft.apellido_materno].filter(Boolean).join(' ') +
                                        (draft.nombre_completo ? `, ${draft.nombre_completo}` : '');
                                    return (
                                        <div key={draft.id} className="flex flex-col rounded-lg border border-dashed border-preventive/30 bg-preventive/4 p-4">
                                            <p className="text-sm font-medium text-foreground">
                                                {name || 'Sin nombre'}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Creado: {formatDate(draft.created_at)}
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <Button size="sm" className="h-8 flex-1 gap-1.5 text-[10px] font-semibold tracking-[0.05em]" asChild>
                                                    <Link href={`/students/${draft.id}/edit`}>
                                                        <Pencil className="size-3" />
                                                        Continuar
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Eliminar borrador</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Se eliminará permanentemente este borrador. Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                onClick={() => router.delete(`/students/${draft.id}`)}
                                                            >
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Filters */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, apellido o CURP..."
                                className="h-10 pl-9"
                            />
                        </form>
                        <div className="flex flex-wrap gap-3">
                            <Select
                                value={filters.grupo ?? 'all'}
                                onValueChange={(v) => applyFilters({ grupo: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[160px]">
                                    <SelectValue placeholder="Grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los grupos</SelectItem>
                                    {groupOptions.map((g) => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.discapacidad ?? 'all'}
                                onValueChange={(v) => applyFilters({ discapacidad: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[180px]">
                                    <SelectValue placeholder="Discapacidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    {disabilityOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.estatus ?? 'all'}
                                onValueChange={(v) => applyFilters({ estatus: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[160px]">
                                    <SelectValue placeholder="Estatus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {statusOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="py-0 shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary dark:bg-[oklch(0.28_0.06_9.01)] dark:hover:bg-[oklch(0.28_0.06_9.01)]">
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">NOMBRE DEL ALUMNO</TableHead>
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">DISCAPACIDAD PRIMARIA</TableHead>
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">GRADO / GRUPO</TableHead>
                                <TableHead className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">ESTATUS</TableHead>
                                <TableHead className="text-right text-[11px] font-bold tracking-[0.1em] text-primary-foreground">ACCIONES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                                        No se encontraron expedientes con esos filtros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.data.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            {student.apellido_paterno} {student.apellido_materno}, {student.nombre_completo}
                                        </TableCell>
                                        <TableCell>
                                            {student.discapacidad ? (disabilityLabels[student.discapacidad] ?? student.discapacidad) : '—'}
                                        </TableCell>
                                        <TableCell>
                                            {student.grado_grupo ?? <span className="text-muted-foreground">Sin asignar</span>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-semibold tracking-wider ${statusColors[student.estatus_alumno ?? ''] ?? ''}`}
                                            >
                                                {statusLabels[student.estatus_alumno ?? ''] ?? student.estatus_alumno}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" className="size-8 p-0" asChild>
                                                    <Link href={`/students/${student.id}`}>
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="size-8 p-0" asChild>
                                                    <Link href={`/students/${student.id}/edit`}>
                                                        <Pencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="size-8 p-0 text-destructive hover:text-destructive">
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Eliminar expediente</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Se eliminará permanentemente el expediente de {student.nombre_completo} {student.apellido_paterno}. Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => router.delete(`/students/${student.id}`)}>
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Mostrando {students.data.length} de {students.total} registros
                        </p>
                        <div className="flex gap-1">
                            {students.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-8 min-w-8 text-xs"
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
}

StudentsIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StudentsIndex;

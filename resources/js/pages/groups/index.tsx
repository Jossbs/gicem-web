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
import { type Auth } from '@/types/data/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
import { ArrowLeft, Eye, FolderOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Group {
    id: number;
    nombre_grupo: string;
    nivel_educativo: string;
    grado: string;
    turno: string;
    aula_fisica: string;
    capacidad_maxima: number;
    students_count: number;
    docente: {
        id: number;
        name: string;
        apellido_paterno: string | null;
        apellido_materno: string | null;
    } | null;
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
    groups: PaginatedData<Group>;
    filters: {
        search?: string;
        nivel?: string;
        turno?: string;
    };
    levelOptions: EnumOption[];
    shiftOptions: EnumOption[];
}

const levelLabels: Record<string, string> = {
    maternal: 'Maternal',
    preescolar: 'Preescolar',
    primaria: 'Primaria',
    secundaria: 'Secundaria',
    laboral: 'Laboral',
};

const gradeLabels: Record<string, string> = {
    primero: '1°',
    segundo: '2°',
    tercero: '3°',
    cuarto: '4°',
    quinto: '5°',
    sexto: '6°',
    unico: 'Único',
};

const shiftLabels: Record<string, string> = {
    matutino: 'Matutino',
    vespertino: 'Vespertino',
};

function GroupsIndex({ groups, filters, levelOptions, shiftOptions }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Record<string, string | undefined>) {
        router.get(
            '/groups',
            { ...filters, ...newFilters, page: undefined },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilters({ search });
    }

    function clearFilters() {
        setSearch('');
        router.get('/groups', {}, { preserveState: true });
    }

    const hasActiveFilters = filters.search || filters.nivel || filters.turno;

    return (
        <>
            <Head title="Grupos Escolares" />

            {/* Back link */}
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
                        Grupos Escolares
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestión de grupos, asignación de docentes y control de cupo.
                    </p>
                </div>
                {can['groups.manage'] && (
                    <Button className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                        <Link href="/groups/create">
                            <Plus className="size-4" />
                            NUEVO GRUPO
                        </Link>
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre de grupo, aula o docente..."
                                className="h-10 pl-9"
                            />
                        </form>

                        {/* Filter selects */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={filters.nivel ?? 'all'}
                                onValueChange={(v) => applyFilters({ nivel: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[180px]">
                                    <SelectValue placeholder="Nivel Educativo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los niveles</SelectItem>
                                    {levelOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.turno ?? 'all'}
                                onValueChange={(v) => applyFilters({ turno: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[160px]">
                                    <SelectValue placeholder="Turno" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {shiftOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 text-xs text-muted-foreground">
                                    Limpiar
                                </Button>
                            )}
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
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    GRUPO Y NIVEL
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    AULA Y TURNO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    DOCENTE TITULAR
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    CAPACIDAD
                                </TableHead>
                                {can['groups.manage'] && (
                                    <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                        ACCIONES
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groups.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={can['groups.manage'] ? 5 : 4} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <FolderOpen className="size-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    No se encontraron grupos
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Intente con otros filtros o limpie la búsqueda.'
                                                        : 'Comience registrando un nuevo grupo escolar.'}
                                                </p>
                                            </div>
                                            {!hasActiveFilters && can['groups.manage'] && (
                                                <Button size="sm" className="mt-2 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                                                    <Link href="/groups/create">
                                                        <Plus className="size-3.5" />
                                                        NUEVO GRUPO
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groups.data.map((group) => (
                                    <TableRow key={group.id} className="group">
                                        <TableCell className="text-center font-medium text-foreground">
                                            <div>{group.nombre_grupo}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {levelLabels[group.nivel_educativo] ?? group.nivel_educativo} / {gradeLabels[group.grado] ?? group.grado}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div>{group.aula_fisica}</div>
                                            <div className="text-xs text-muted-foreground">{shiftLabels[group.turno] ?? group.turno}</div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {group.docente
                                                ? `${group.docente.name} ${group.docente.apellido_paterno ?? ''} ${group.docente.apellido_materno ?? ''}`.trim()
                                                : (<span className="text-xs italic text-muted-foreground">Sin asignar</span>)
                                            }
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {group.students_count ?? 0} / {group.capacidad_maxima}
                                        </TableCell>
                                        {can['groups.manage'] && (
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" className="size-8 p-0 opacity-60 group-hover:opacity-100" asChild>
                                                        <Link href={`/groups/${group.id}`}><Eye className="size-4" /></Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="size-8 p-0 opacity-60 group-hover:opacity-100" asChild>
                                                        <Link href={`/groups/${group.id}/edit`}><Pencil className="size-4" /></Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="size-8 p-0 text-destructive opacity-60 hover:text-destructive group-hover:opacity-100">
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Eliminar grupo</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Se eliminará permanentemente el grupo {group.nombre_grupo}. Esta acción no se puede deshacer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => router.delete(`/groups/${group.id}`)}>
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {groups.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Mostrando <span className="font-medium text-foreground">{groups.data.length}</span> de{' '}
                            <span className="font-medium text-foreground">{groups.total}</span> registros
                        </p>
                        <div className="flex gap-1">
                            {groups.links.map((link, i) => {
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

GroupsIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default GroupsIndex;

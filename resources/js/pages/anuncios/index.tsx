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
import { type Auth } from '@/types/data/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, FolderOpen, Plus, Search, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Anuncio {
    id: number;
    asunto: string;
    alcance: string;
    prioridad: string;
    fecha_envio: string;
    emisor: {
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
    anuncios: PaginatedData<Anuncio>;
    filters: {
        search?: string;
        alcance?: string;
        prioridad?: string;
    };
    alcanceOptions: EnumOption[];
    prioridadOptions: EnumOption[];
}

const alcanceLabels: Record<string, string> = {
    grupo: 'Todo el Grupo',
    escuela: 'Toda la Escuela',
    privado: 'Privado',
};

const alcanceStyles: Record<string, string> = {
    grupo: 'border-informative/30 bg-informative/8 text-informative',
    escuela: 'border-primary/30 bg-primary/8 text-primary',
    privado: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
};

const prioridadLabels: Record<string, string> = {
    normal: 'Normal',
    urgente: 'Urgente',
};

const prioridadStyles: Record<string, string> = {
    normal: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    urgente: 'border-destructive/30 bg-destructive/8 text-destructive',
};

function AnunciosIndex({ anuncios, filters, alcanceOptions, prioridadOptions }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Record<string, string | undefined>) {
        router.get(
            '/anuncios',
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
        router.get('/anuncios', {}, { preserveState: true });
    }

    const hasActiveFilters = filters.search || filters.alcance || filters.prioridad;

    function getEmisorName(emisor: Anuncio['emisor']): string {
        if (!emisor) return 'Desconocido';
        return [emisor.name, emisor.apellido_paterno, emisor.apellido_materno].filter(Boolean).join(' ');
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <>
            <Head title="Anuncios" />

            <Link
                href="/dashboard"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL PANEL
            </Link>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Anuncios</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Comunicados dirigidos a docentes, tutores y grupos escolares.
                    </p>
                </div>
                <Button className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                    <Link href="/anuncios/create">
                        <Plus className="size-4" />
                        NUEVO ANUNCIO
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por asunto..."
                                className="h-10 pl-9"
                            />
                        </form>

                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={filters.alcance ?? 'all'}
                                onValueChange={(v) => applyFilters({ alcance: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[180px]">
                                    <SelectValue placeholder="Alcance" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los alcances</SelectItem>
                                    {alcanceOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.prioridad ?? 'all'}
                                onValueChange={(v) => applyFilters({ prioridad: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[160px]">
                                    <SelectValue placeholder="Prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las prioridades</SelectItem>
                                    {prioridadOptions.map((opt) => (
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
                                    onClick={clearFilters}
                                    className="h-10 text-xs text-muted-foreground"
                                >
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
                                    ASUNTO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    EMISOR
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ALCANCE
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    PRIORIDAD
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    FECHA
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ACCIONES
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {anuncios.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <FolderOpen className="size-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    No se encontraron anuncios
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Intente con otros filtros o limpie la búsqueda.'
                                                        : 'Comience enviando un nuevo anuncio.'}
                                                </p>
                                            </div>
                                            {!hasActiveFilters && (
                                                <Button
                                                    size="sm"
                                                    className="mt-2 gap-2 text-xs font-semibold tracking-[0.1em]"
                                                    asChild
                                                >
                                                    <Link href="/anuncios/create">
                                                        <Plus className="size-3.5" />
                                                        NUEVO ANUNCIO
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                anuncios.data.map((anuncio) => (
                                    <TableRow key={anuncio.id} className="group">
                                        <TableCell className="max-w-[250px] truncate text-center font-medium">
                                            {anuncio.asunto}
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">
                                            {getEmisorName(anuncio.emisor)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-semibold tracking-wider ${alcanceStyles[anuncio.alcance] ?? ''}`}
                                            >
                                                {alcanceLabels[anuncio.alcance] ?? anuncio.alcance}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-semibold tracking-wider ${prioridadStyles[anuncio.prioridad] ?? ''}`}
                                            >
                                                {prioridadLabels[anuncio.prioridad] ?? anuncio.prioridad}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-sm text-muted-foreground">
                                            {formatDate(anuncio.fecha_envio)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="size-8 p-0 opacity-60 group-hover:opacity-100"
                                                    asChild
                                                >
                                                    <Link href={`/anuncios/${anuncio.id}`}>
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>
                                                {(can['anuncios.delete'] || anuncio.emisor?.id === auth.user.id) && (
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
                                                                <AlertDialogTitle>Eliminar anuncio</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Se eliminará permanentemente el anuncio &quot;{anuncio.asunto}&quot;. Esta acción no se puede deshacer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    onClick={() => router.delete(`/anuncios/${anuncio.id}`)}
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
                {anuncios.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Mostrando <span className="font-medium text-foreground">{anuncios.data.length}</span> de{' '}
                            <span className="font-medium text-foreground">{anuncios.total}</span> registros
                        </p>
                        <div className="flex gap-1">
                            {anuncios.links.map((link, i) => {
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

AnunciosIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AnunciosIndex;

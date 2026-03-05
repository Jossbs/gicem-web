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

interface StaffMember {
    id: number;
    name: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    email: string;
    rol_sistema: string;
    grupo_asignado: {
        id: number;
        nombre_grupo: string;
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
    staff: PaginatedData<StaffMember>;
    filters: {
        search?: string;
        rol?: string;
    };
    roleOptions: EnumOption[];
}

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    trabajador_social: 'Trabajador Social',
    docente: 'Docente',
};

const roleStyles: Record<string, string> = {
    admin: 'border-primary/30 bg-primary/8 text-primary',
    trabajador_social: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
    docente: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
};

function StaffIndex({ staff, filters, roleOptions }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Record<string, string | undefined>) {
        router.get(
            '/staff',
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
        router.get('/staff', {}, { preserveState: true });
    }

    const hasActiveFilters = filters.search || filters.rol;

    return (
        <>
            <Head title="Personal Docente" />

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
                        Personal Docente
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Administración de plantilla de maestros y especialistas.
                    </p>
                </div>
                <Button className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                    <Link href="/staff/create">
                        <Plus className="size-4" />
                        NUEVO PERSONAL
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
                                placeholder="Buscar por nombre, apellido o correo..."
                                className="h-10 pl-9"
                            />
                        </form>

                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={filters.rol ?? 'all'}
                                onValueChange={(v) => applyFilters({ rol: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[180px]">
                                    <SelectValue placeholder="Rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los roles</SelectItem>
                                    {roleOptions.map((opt) => (
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
                                    NOMBRE(S)
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    APELLIDOS
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    CORREO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ROL
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    GRUPO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ACCIONES
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <FolderOpen className="size-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    No se encontró personal
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Intente con otros filtros o limpie la búsqueda.'
                                                        : 'Comience registrando un nuevo miembro del personal.'}
                                                </p>
                                            </div>
                                            {!hasActiveFilters && (
                                                <Button size="sm" className="mt-2 gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                                                    <Link href="/staff/create">
                                                        <Plus className="size-3.5" />
                                                        NUEVO PERSONAL
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                staff.data.map((member) => (
                                    <TableRow key={member.id} className="group">
                                        <TableCell className="text-center font-medium">
                                            {member.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {member.apellido_paterno} {member.apellido_materno}
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">
                                            {member.email}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-semibold tracking-wider ${roleStyles[member.rol_sistema] ?? ''}`}
                                            >
                                                {roleLabels[member.rol_sistema] ?? member.rol_sistema}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {member.grupo_asignado?.nombre_grupo ?? (
                                                <span className="text-xs italic text-muted-foreground">Sin asignar</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="sm" className="size-8 p-0 opacity-60 group-hover:opacity-100" asChild>
                                                    <Link href={`/staff/${member.id}`}><Eye className="size-4" /></Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="size-8 p-0 opacity-60 group-hover:opacity-100" asChild>
                                                    <Link href={`/staff/${member.id}/edit`}><Pencil className="size-4" /></Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="size-8 p-0 text-destructive opacity-60 hover:text-destructive group-hover:opacity-100">
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Eliminar personal</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Se eliminará permanentemente el registro de {member.name} {member.apellido_paterno}. Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => router.delete(`/staff/${member.id}`)}>
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
                {staff.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Mostrando <span className="font-medium text-foreground">{staff.data.length}</span> de{' '}
                            <span className="font-medium text-foreground">{staff.total}</span> registros
                        </p>
                        <div className="flex gap-1">
                            {staff.links.map((link, i) => {
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

StaffIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StaffIndex;

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
import { ArrowLeft, Eye, FolderOpen, Info, Mail, Search } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Guardian {
    id: number;
    tutor_nombre: string;
    tutor_apellido_paterno: string;
    tutor_apellido_materno: string;
    tutor_parentesco: string;
    tel_emergencia_1: string;
    tel_emergencia_2: string | null;
    correo_tutor: string;
    domicilio_calle: string;
    domicilio_numero: string;
    domicilio_colonia: string;
    domicilio_municipio: string;
    domicilio_estado: string;
    domicilio_cp: string;
    nombre_completo: string;
    apellido_paterno: string;
    apellido_materno: string;
    tutor_user_id: number | null;
    tutor_user?: { id: number; email: string } | null;
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
    guardians: PaginatedData<Guardian>;
    filters: {
        search?: string;
        parentesco?: string;
    };
    kinshipOptions: EnumOption[];
}

const kinshipLabels: Record<string, string> = {
    madre: 'Madre',
    padre: 'Padre',
    abuelo: 'Abuelo/a',
    tutor_legal: 'Tutor legal',
};

function GuardiansIndex({ guardians, filters, kinshipOptions }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Record<string, string | undefined>) {
        router.get(
            '/guardians',
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
        router.get('/guardians', {}, { preserveState: true });
    }

    const hasActiveFilters = filters.search || filters.parentesco;

    return (
        <>
            <Head title="Tutores Legales" />

            {/* Back link */}
            <Link
                href="/dashboard"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL PANEL
            </Link>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Tutores Legales
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Directorio de contactos de tutores registrados en los expedientes de alumnos.
                </p>
            </div>

            {/* Info banner */}
            <Card className="mb-6 border-l-4 border-l-golden shadow-sm">
                <CardContent className="flex items-center gap-3 px-5 py-3">
                    <Info className="size-4 shrink-0 text-golden" />
                    <p className="text-xs text-muted-foreground">
                        Los datos de tutores se extraen automáticamente de los expedientes de alumnos.
                        Para modificar esta información, edite el expediente del alumno correspondiente.
                    </p>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="mb-6 py-0 shadow-sm">
                <CardContent className="px-4 py-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre del tutor, correo o teléfono..."
                                className="h-10 pl-9"
                            />
                        </form>

                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={filters.parentesco ?? 'all'}
                                onValueChange={(v) => applyFilters({ parentesco: v === 'all' ? undefined : v })}
                            >
                                <SelectTrigger className="h-10 w-[180px]">
                                    <SelectValue placeholder="Parentesco" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {kinshipOptions.map((opt) => (
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
                                    PARENTESCO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ALUMNO ASOCIADO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    TELEFONO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    CORREO
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    CUENTA
                                </TableHead>
                                <TableHead className="text-center text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    ACCIONES
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guardians.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <FolderOpen className="size-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    No se encontraron tutores
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Intente con otros filtros o limpie la búsqueda.'
                                                        : 'Los tutores aparecen al registrar expedientes de alumnos.'}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                guardians.data.map((g) => (
                                    <TableRow key={g.id}>
                                        <TableCell className="text-center font-medium">
                                            {g.tutor_nombre}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {g.tutor_apellido_paterno} {g.tutor_apellido_materno}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {kinshipLabels[g.tutor_parentesco] ?? g.tutor_parentesco}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-sm text-muted-foreground">
                                                {g.nombre_completo} {g.apellido_paterno} {g.apellido_materno}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center whitespace-nowrap">
                                            {g.tel_emergencia_1}
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">
                                            {g.correo_tutor}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {g.tutor_user_id ? (
                                                <Badge className="bg-affirmative text-white">Activa</Badge>
                                            ) : (
                                                <Badge variant="secondary">Sin cuenta</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {g.tutor_user_id && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="size-8 p-0"
                                                        onClick={() => router.post(`/guardians/${g.id}/send-invitation`)}
                                                        title="Enviar invitación"
                                                    >
                                                        <Mail className="size-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="size-8 p-0" asChild>
                                                    <Link href={`/guardians/${g.id}`}><Eye className="size-4" /></Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {guardians.last_page > 1 && (
                    <div className="flex items-center justify-between border-t px-5 py-3">
                        <p className="text-xs text-muted-foreground">
                            Mostrando <span className="font-medium text-foreground">{guardians.data.length}</span> de{' '}
                            <span className="font-medium text-foreground">{guardians.total}</span> registros
                        </p>
                        <div className="flex gap-1">
                            {guardians.links.map((link, i) => {
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

GuardiansIndex.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default GuardiansIndex;

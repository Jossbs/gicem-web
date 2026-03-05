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
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, ChevronUp, Download, MessageSquare, Send, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Anuncio {
    id: number;
    asunto: string;
    mensaje: string;
    alcance: string;
    prioridad: string;
    tipo_emisor: string;
    adjunto_url: string | null;
    destinatario_tipo: string | null;
    destinatario_id: number | null;
    fecha_envio: string;
    emisor: {
        id: number;
        name: string;
        apellido_paterno: string | null;
        apellido_materno: string | null;
        rol_sistema: string;
    } | null;
}

interface Props {
    anuncio: Anuncio;
    destinatarioNombre: string | null;
}

const alcanceLabels: Record<string, string> = {
    grupo: 'Todo el Grupo',
    escuela: 'Toda la Escuela',
    privado: 'Privado',
};

const prioridadLabels: Record<string, string> = {
    normal: 'Normal',
    urgente: 'Urgente',
};

const prioridadStyles: Record<string, string> = {
    normal: 'border-affirmative/30 bg-affirmative/8 text-affirmative',
    urgente: 'border-destructive/30 bg-destructive/8 text-destructive',
};

const alcanceStyles: Record<string, string> = {
    grupo: 'border-informative/30 bg-informative/8 text-informative',
    escuela: 'border-primary/30 bg-primary/8 text-primary',
    privado: 'border-preventive/30 bg-preventive/8 text-preventive-foreground',
};

const tipoEmisorLabels: Record<string, string> = {
    admin: 'Administrador',
    docente: 'Docente',
    tutor: 'Tutor',
};

const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    trabajador_social: 'Trabajador Social',
    docente: 'Docente',
    tutor: 'Tutor',
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getEmisorFullName(emisor: Anuncio['emisor']): string {
    if (!emisor) return 'Desconocido';
    return [emisor.name, emisor.apellido_paterno, emisor.apellido_materno].filter(Boolean).join(' ');
}

function AnuncioShow({ anuncio, destinatarioNombre }: Props) {
    return (
        <>
            <Head title={anuncio.asunto} />

            <Link
                href="/anuncios"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR A ANUNCIOS
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <Card className="shadow-sm">
                        <CardContent className="px-5 py-4">
                            <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                                ACCIONES
                            </p>
                            <div className="flex flex-col gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em] text-destructive hover:bg-destructive/8 hover:text-destructive"
                                        >
                                            <Trash2 className="size-3.5" />
                                            ELIMINAR ANUNCIO
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Eliminar anuncio</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente el anuncio &quot;{anuncio.asunto}&quot;.
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
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main content */}
                <div className="space-y-4 lg:col-span-9">
                    {/* Header card */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="bg-primary px-6 py-6">
                            <p className="text-[10px] font-bold tracking-[0.15em] text-primary-foreground/60">
                                ANUNCIO — GICEM
                            </p>
                            <h1 className="mt-1 text-2xl font-bold leading-tight text-primary-foreground">
                                {anuncio.asunto}
                            </h1>
                            <p className="mt-1 text-sm text-primary-foreground/70">
                                {formatDate(anuncio.fecha_envio)}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Badge
                                    className={`border text-[10px] font-semibold tracking-wider ${
                                        anuncio.prioridad === 'urgente'
                                            ? 'border-red-300/40 bg-red-500/20 text-red-100'
                                            : 'border-primary-foreground/25 bg-primary-foreground/15 text-primary-foreground'
                                    }`}
                                >
                                    {prioridadLabels[anuncio.prioridad] ?? anuncio.prioridad}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-primary-foreground/20 text-[10px] font-semibold tracking-wider text-primary-foreground/80"
                                >
                                    {alcanceLabels[anuncio.alcance] ?? anuncio.alcance}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <CollapsibleSection title="CONTENIDO" icon={MessageSquare} defaultOpen>
                        <div className="space-y-4">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                {anuncio.mensaje}
                            </p>
                            {anuncio.adjunto_url && (
                                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
                                    <Download className="size-4 shrink-0 text-muted-foreground" />
                                    <a
                                        href={`/storage/${anuncio.adjunto_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                                    >
                                        Descargar adjunto
                                    </a>
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="DETALLES DE ENVÍO" icon={Send} defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DataItem label="Emisor" value={getEmisorFullName(anuncio.emisor)} />
                            <DataItem
                                label="Rol del emisor"
                                value={
                                    anuncio.emisor
                                        ? (roleLabels[anuncio.emisor.rol_sistema] ?? anuncio.emisor.rol_sistema)
                                        : 'Desconocido'
                                }
                            />
                            <DataItem
                                label="Tipo de emisor"
                                value={tipoEmisorLabels[anuncio.tipo_emisor] ?? anuncio.tipo_emisor}
                            />
                            <DataItem
                                label="Alcance"
                                value={alcanceLabels[anuncio.alcance] ?? anuncio.alcance}
                            />
                            <DataItem
                                label="Destinatario"
                                value={destinatarioNombre ?? 'Todos'}
                            />
                            <DataItem label="Fecha de envío" value={formatDate(anuncio.fecha_envio)} />
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
}

function CollapsibleSection({
    title,
    icon: Icon,
    defaultOpen = false,
    children,
}: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="overflow-hidden shadow-sm">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between bg-primary/8 px-6 py-3 text-left transition-colors hover:bg-primary/12"
            >
                <span className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    <span className="text-[11px] font-bold tracking-[0.1em] text-primary">{title}</span>
                </span>
                {open ? (
                    <ChevronUp className="size-4 text-primary" />
                ) : (
                    <ChevronDown className="size-4 text-primary" />
                )}
            </button>
            {open && <CardContent className="px-6 py-4">{children}</CardContent>}
        </Card>
    );
}

function DataItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm text-foreground">{value}</p>
        </div>
    );
}

AnuncioShow.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AnuncioShow;

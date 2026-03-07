import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';

interface Student {
    id: number;
    nombre_completo: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    fotografia_display_url: string | null;
}

interface EnumOption {
    value: string;
    label: string;
}

interface Props {
    student: Student;
    categoryOptions: EnumOption[];
}

function LogEntriesCreate({ student, categoryOptions }: Props) {
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

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm<{
        fecha_nota: string;
        categoria: string;
        descripcion: string;
        evidencia: File | null;
        notificar_padres: boolean;
    }>({
        fecha_nota: today,
        categoria: '',
        descripcion: '',
        evidencia: null,
        notificar_padres: false,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/students/${student.id}/log-entries`, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Nueva anotacion - ${fullName}`} />

            <Link
                href={`/students/${student.id}/log-entries`}
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR A LA BITACORA
            </Link>

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Nueva anotacion</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Registro de control diario para {fullName}.
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card className="shadow-sm">
                <CardContent className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row: Fecha + Categoria */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="fecha_nota"
                                    className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground"
                                >
                                    FECHA
                                </Label>
                                <Input
                                    id="fecha_nota"
                                    type="date"
                                    value={data.fecha_nota}
                                    onChange={(e) => setData('fecha_nota', e.target.value)}
                                    className="h-11"
                                />
                                {errors.fecha_nota && (
                                    <p className="text-xs text-destructive">{errors.fecha_nota}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="categoria"
                                    className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground"
                                >
                                    TIPO DE REGISTRO
                                </Label>
                                <Select value={data.categoria} onValueChange={(v) => setData('categoria', v)}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Selecciona el tipo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoria && (
                                    <p className="text-xs text-destructive">{errors.categoria}</p>
                                )}
                            </div>
                        </div>

                        {/* Descripcion */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="descripcion"
                                className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground"
                            >
                                OBSERVACIONES DEL DIA
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Describe lo ocurrido o el avance observado..."
                                rows={5}
                                className="resize-none"
                            />
                            {errors.descripcion && (
                                <p className="text-xs text-destructive">{errors.descripcion}</p>
                            )}
                        </div>

                        {/* Evidencia */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="evidencia"
                                className="text-[11px] font-bold tracking-[0.1em] text-muted-foreground"
                            >
                                EVIDENCIA / FOTO
                                <span className="ml-1 font-normal text-muted-foreground/70">(opcional)</span>
                            </Label>
                            <Input
                                id="evidencia"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('evidencia', e.target.files?.[0] ?? null)}
                                className="h-11"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Subir foto de actividad o reporte. Maximo 5 MB.
                            </p>
                            {errors.evidencia && (
                                <p className="text-xs text-destructive">{errors.evidencia}</p>
                            )}
                        </div>

                        {/* Notificar padres */}
                        <div className="flex items-start gap-3 rounded-lg border border-golden/20 bg-golden/5 p-4">
                            <input
                                id="notificar_padres"
                                type="checkbox"
                                checked={data.notificar_padres}
                                onChange={(e) => setData('notificar_padres', e.target.checked)}
                                className="mt-0.5 size-4 rounded border-golden/40 text-golden accent-golden"
                            />
                            <div>
                                <Label
                                    htmlFor="notificar_padres"
                                    className="cursor-pointer text-sm font-semibold text-foreground"
                                >
                                    Enviar aviso a padres
                                </Label>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Marcar si es una nota importante para el hogar. Se enviara un correo
                                    electronico al tutor registrado.
                                </p>
                            </div>
                            {errors.notificar_padres && (
                                <p className="text-xs text-destructive">{errors.notificar_padres}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t pt-6">
                            <Button variant="outline" className="h-11 text-xs font-semibold tracking-[0.1em]" asChild>
                                <Link href={`/students/${student.id}/log-entries`}>CANCELAR</Link>
                            </Button>
                            <Button
                                type="submit"
                                className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                                disabled={processing}
                            >
                                <Save className="size-4" />
                                GUARDAR ANOTACION
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

LogEntriesCreate.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default LogEntriesCreate;

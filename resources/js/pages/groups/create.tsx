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
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';

interface EnumOption {
    value: string;
    label: string;
}

interface Props {
    levelOptions: EnumOption[];
    gradeOptions: EnumOption[];
    shiftOptions: EnumOption[];
    specialtyOptions: EnumOption[];
    docenteOptions: EnumOption[];
}

function GroupsCreate({ levelOptions, gradeOptions, shiftOptions, specialtyOptions, docenteOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_grupo: '',
        docente_id: '',
        nivel_educativo: '',
        grado: '',
        turno: '',
        especialidad_grupo: [] as string[],
        aula_fisica: '',
        capacidad_maxima: '',
        ciclo_escolar: '2025-2026',
    });

    function handleSpecialtyToggle(value: string) {
        const current = data.especialidad_grupo;
        if (current.includes(value)) {
            setData('especialidad_grupo', current.filter((v) => v !== value));
        } else {
            setData('especialidad_grupo', [...current, value]);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/groups');
    }

    return (
        <>
            <Head title="Nuevo Grupo Escolar" />

            {/* Back link */}
            <Link
                href="/groups"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL DIRECTORIO
            </Link>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Nuevo Grupo Escolar
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Complete la información para registrar un nuevo grupo.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                        {/* Nombre del grupo */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre_grupo" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                NOMBRE DEL GRUPO *
                            </Label>
                            <Input
                                id="nombre_grupo"
                                value={data.nombre_grupo}
                                onChange={(e) => setData('nombre_grupo', e.target.value)}
                                placeholder="Ej. 1-A"
                                className="h-10"
                            />
                            {errors.nombre_grupo && (
                                <p className="text-xs text-destructive">{errors.nombre_grupo}</p>
                            )}
                        </div>

                        {/* Docente */}
                        <div className="space-y-2">
                            <Label htmlFor="docente_id" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                DOCENTE ASIGNADO *
                            </Label>
                            <Select value={data.docente_id} onValueChange={(v) => setData('docente_id', v)}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar docente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {docenteOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.docente_id && (
                                <p className="text-xs text-destructive">{errors.docente_id}</p>
                            )}
                        </div>

                        {/* Nivel educativo */}
                        <div className="space-y-2">
                            <Label htmlFor="nivel_educativo" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                NIVEL EDUCATIVO *
                            </Label>
                            <Select value={data.nivel_educativo} onValueChange={(v) => setData('nivel_educativo', v)}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar nivel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levelOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.nivel_educativo && (
                                <p className="text-xs text-destructive">{errors.nivel_educativo}</p>
                            )}
                        </div>

                        {/* Grado */}
                        <div className="space-y-2">
                            <Label htmlFor="grado" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                GRADO *
                            </Label>
                            <Select value={data.grado} onValueChange={(v) => setData('grado', v)}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar grado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gradeOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.grado && (
                                <p className="text-xs text-destructive">{errors.grado}</p>
                            )}
                        </div>

                        {/* Turno */}
                        <div className="space-y-2">
                            <Label htmlFor="turno" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                TURNO *
                            </Label>
                            <Select value={data.turno} onValueChange={(v) => setData('turno', v)}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Seleccionar turno" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shiftOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.turno && (
                                <p className="text-xs text-destructive">{errors.turno}</p>
                            )}
                        </div>

                        {/* Aula física */}
                        <div className="space-y-2">
                            <Label htmlFor="aula_fisica" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                AULA FÍSICA *
                            </Label>
                            <Input
                                id="aula_fisica"
                                value={data.aula_fisica}
                                onChange={(e) => setData('aula_fisica', e.target.value)}
                                placeholder="Ej. Aula 3"
                                className="h-10"
                            />
                            {errors.aula_fisica && (
                                <p className="text-xs text-destructive">{errors.aula_fisica}</p>
                            )}
                        </div>

                        {/* Capacidad máxima */}
                        <div className="space-y-2">
                            <Label htmlFor="capacidad_maxima" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                CAPACIDAD MÁXIMA *
                            </Label>
                            <Input
                                id="capacidad_maxima"
                                type="number"
                                min={1}
                                max={50}
                                value={data.capacidad_maxima}
                                onChange={(e) => setData('capacidad_maxima', e.target.value)}
                                placeholder="Ej. 15"
                                className="h-10"
                            />
                            {errors.capacidad_maxima && (
                                <p className="text-xs text-destructive">{errors.capacidad_maxima}</p>
                            )}
                        </div>

                        {/* Ciclo escolar */}
                        <div className="space-y-2">
                            <Label htmlFor="ciclo_escolar" className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                CICLO ESCOLAR *
                            </Label>
                            <Input
                                id="ciclo_escolar"
                                value={data.ciclo_escolar}
                                onChange={(e) => setData('ciclo_escolar', e.target.value)}
                                placeholder="Ej. 2025-2026"
                                className="h-10"
                            />
                            {errors.ciclo_escolar && (
                                <p className="text-xs text-destructive">{errors.ciclo_escolar}</p>
                            )}
                        </div>

                        {/* Especialidad del grupo (checkboxes - full width) */}
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                ESPECIALIDAD DEL GRUPO *
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Seleccione una o más especialidades que atiende este grupo.
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {specialtyOptions.map((opt) => {
                                    const isChecked = data.especialidad_grupo.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSpecialtyToggle(opt.value)}
                                            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                                                isChecked
                                                    ? 'border-primary bg-primary/8 font-medium text-primary'
                                                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className={`flex size-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                                                        isChecked
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-muted-foreground/30'
                                                    }`}
                                                >
                                                    {isChecked && '✓'}
                                                </span>
                                                {opt.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.especialidad_grupo && (
                                <p className="text-xs text-destructive">{errors.especialidad_grupo}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                    >
                        <Save className="size-4" />
                        {processing ? 'GUARDANDO...' : 'GUARDAR GRUPO'}
                    </Button>
                </div>
            </form>
        </>
    );
}

GroupsCreate.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default GroupsCreate;

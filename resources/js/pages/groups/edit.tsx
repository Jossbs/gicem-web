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

interface Group {
    id: number;
    nombre_grupo: string;
    docente_id: number;
    nivel_educativo: string;
    grado: string;
    turno: string;
    especialidad_grupo: string[];
    aula_fisica: string;
    capacidad_maxima: number;
    ciclo_escolar: string;
}

interface Props {
    group: Group;
    levelOptions: EnumOption[];
    gradeOptions: EnumOption[];
    shiftOptions: EnumOption[];
    specialtyOptions: EnumOption[];
    docenteOptions: EnumOption[];
}

function GroupsEdit({ group, levelOptions, gradeOptions, shiftOptions, specialtyOptions, docenteOptions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre_grupo: group.nombre_grupo,
        docente_id: String(group.docente_id),
        nivel_educativo: group.nivel_educativo,
        grado: group.grado,
        turno: group.turno,
        especialidad_grupo: group.especialidad_grupo ?? [],
        aula_fisica: group.aula_fisica,
        capacidad_maxima: String(group.capacidad_maxima),
        ciclo_escolar: group.ciclo_escolar,
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
        put(`/groups/${group.id}`);
    }

    return (
        <>
            <Head title="Editar Grupo" />

            <Link
                href={`/groups/${group.id}`}
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL GRUPO
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Grupo</h1>
                <p className="mt-1 text-sm text-muted-foreground">{group.nombre_grupo}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-sm">
                    <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                        <FormField label="NOMBRE DEL GRUPO *" error={errors.nombre_grupo}>
                            <Input value={data.nombre_grupo} onChange={(e) => setData('nombre_grupo', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="DOCENTE ASIGNADO *" error={errors.docente_id}>
                            <Select value={data.docente_id} onValueChange={(v) => setData('docente_id', v)}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>{docenteOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="NIVEL EDUCATIVO *" error={errors.nivel_educativo}>
                            <Select value={data.nivel_educativo} onValueChange={(v) => setData('nivel_educativo', v)}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>{levelOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="GRADO *" error={errors.grado}>
                            <Select value={data.grado} onValueChange={(v) => setData('grado', v)}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>{gradeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="TURNO *" error={errors.turno}>
                            <Select value={data.turno} onValueChange={(v) => setData('turno', v)}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>{shiftOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="AULA FÍSICA *" error={errors.aula_fisica}>
                            <Input value={data.aula_fisica} onChange={(e) => setData('aula_fisica', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="CAPACIDAD MÁXIMA *" error={errors.capacidad_maxima}>
                            <Input type="number" min={1} max={50} value={data.capacidad_maxima} onChange={(e) => setData('capacidad_maxima', e.target.value)} className="h-10" />
                        </FormField>
                        <FormField label="CICLO ESCOLAR *" error={errors.ciclo_escolar}>
                            <Input value={data.ciclo_escolar} onChange={(e) => setData('ciclo_escolar', e.target.value)} className="h-10" />
                        </FormField>

                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">ESPECIALIDAD DEL GRUPO *</Label>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {specialtyOptions.map((opt) => {
                                    const isChecked = data.especialidad_grupo.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSpecialtyToggle(opt.value)}
                                            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${isChecked ? 'border-primary bg-primary/8 font-medium text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`flex size-4 shrink-0 items-center justify-center rounded border text-[10px] ${isChecked ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                                                    {isChecked && '\u2713'}
                                                </span>
                                                {opt.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.especialidad_grupo && <p className="text-xs text-destructive">{errors.especialidad_grupo}</p>}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={processing} className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]">
                        <Save className="size-4" /> {processing ? 'GUARDANDO...' : 'ACTUALIZAR GRUPO'}
                    </Button>
                </div>
            </form>
        </>
    );
}

function FormField({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={`space-y-2 ${className ?? ''}`}>
            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">{label}</Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

GroupsEdit.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default GroupsEdit;

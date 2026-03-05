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
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    ChevronLeft,
    Save,
    Settings,
} from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';

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

const sectionsList = [
    { number: '01', title: 'Informacion del Grupo', icon: BookOpen },
    { number: '02', title: 'Configuracion Academica', icon: Settings },
];

function GroupsEdit({ group, levelOptions, gradeOptions, shiftOptions, specialtyOptions, docenteOptions }: Props) {
    const [activeSection, setActiveSection] = useState(0);

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

    function isSectionComplete(sectionIndex: number): boolean {
        if (sectionIndex === 0) {
            return !!(data.nombre_grupo && data.docente_id && data.nivel_educativo && data.grado && data.turno);
        }
        return !!(data.aula_fisica && data.capacidad_maxima && data.ciclo_escolar && data.especialidad_grupo.length > 0);
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Sidebar de secciones */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-6">
                            <Card className="shadow-sm">
                                <CardContent className="px-4 py-4">
                                    <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">SECCIONES</p>
                                    <nav className="space-y-1">
                                        {sectionsList.map((section, index) => {
                                            const isActive = activeSection === index;
                                            const isComplete = isSectionComplete(index);
                                            const Icon = section.icon;
                                            return (
                                                <button
                                                    key={section.number}
                                                    type="button"
                                                    onClick={() => setActiveSection(index)}
                                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                                                        isActive
                                                            ? 'border-l-3 border-l-golden bg-primary/6 text-primary'
                                                            : 'border-l-3 border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                    }`}
                                                >
                                                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                        isComplete
                                                            ? 'bg-affirmative text-white'
                                                            : isActive
                                                                ? 'bg-golden text-white'
                                                                : 'bg-muted text-muted-foreground'
                                                    }`}>
                                                        {isComplete ? <Check className="size-3.5" /> : section.number}
                                                    </span>
                                                    <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-golden' : ''}`}>
                                                        {section.title}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contenido del formulario */}
                    <div className="lg:col-span-9">
                        {/* Seccion 01: Informacion del Grupo */}
                        {activeSection === 0 && (
                            <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                                <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                    <BookOpen className="size-4 text-primary-foreground/70" />
                                    <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">01. INFORMACION DEL GRUPO</span>
                                </div>
                                <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                    <FormField label="NOMBRE DEL GRUPO *" error={errors.nombre_grupo}>
                                        <Input value={data.nombre_grupo} onChange={(e) => setData('nombre_grupo', e.target.value)} className="h-10" />
                                    </FormField>
                                    <FormField label="DOCENTE ASIGNADO *" error={errors.docente_id}>
                                        <Select value={data.docente_id} onValueChange={(v) => setData('docente_id', v)}>
                                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {docenteOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="NIVEL EDUCATIVO *" error={errors.nivel_educativo}>
                                        <Select value={data.nivel_educativo} onValueChange={(v) => setData('nivel_educativo', v)}>
                                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {levelOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="GRADO *" error={errors.grado}>
                                        <Select value={data.grado} onValueChange={(v) => setData('grado', v)}>
                                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {gradeOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="TURNO *" error={errors.turno}>
                                        <Select value={data.turno} onValueChange={(v) => setData('turno', v)}>
                                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {shiftOptions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </CardContent>
                            </Card>
                        )}

                        {/* Seccion 02: Configuracion Academica */}
                        {activeSection === 1 && (
                            <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                                <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                    <Settings className="size-4 text-primary-foreground/70" />
                                    <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">02. CONFIGURACION ACADEMICA</span>
                                </div>
                                <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                    <FormField label="AULA FISICA *" error={errors.aula_fisica}>
                                        <Input value={data.aula_fisica} onChange={(e) => setData('aula_fisica', e.target.value)} className="h-10" />
                                    </FormField>
                                    <FormField label="CAPACIDAD MAXIMA *" error={errors.capacidad_maxima}>
                                        <Input type="number" min={1} max={50} value={data.capacidad_maxima} onChange={(e) => setData('capacidad_maxima', e.target.value)} className="h-10" />
                                    </FormField>
                                    <FormField label="CICLO ESCOLAR *" error={errors.ciclo_escolar}>
                                        <Input value={data.ciclo_escolar} onChange={(e) => setData('ciclo_escolar', e.target.value)} className="h-10" />
                                    </FormField>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                            ESPECIALIDAD DEL GRUPO *
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Seleccione una o mas especialidades que atiende este grupo.
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
                                                            <span className={`flex size-4 shrink-0 items-center justify-center rounded border text-[10px] ${isChecked ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                                                                {isChecked && '\u2713'}
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
                        )}

                        {/* Navigation footer */}
                        <div className="mt-6 flex items-center justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                                disabled={activeSection === 0}
                                onClick={() => setActiveSection(activeSection - 1)}
                            >
                                <ChevronLeft className="size-4" />
                                ANTERIOR
                            </Button>

                            <div className="flex gap-3">
                                {activeSection < sectionsList.length - 1 ? (
                                    <Button
                                        type="button"
                                        className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                                        onClick={() => setActiveSection(activeSection + 1)}
                                    >
                                        SIGUIENTE
                                        <ArrowRight className="size-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                                    >
                                        <Save className="size-4" />
                                        {processing ? 'GUARDANDO...' : 'ACTUALIZAR GRUPO'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
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

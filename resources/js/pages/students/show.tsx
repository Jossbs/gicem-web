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
import { type Auth } from '@/types/data/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Brain,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    FileText,
    FolderOpen,
    Heart,
    Pencil,
    Trash2,
    Users,
    CheckCircle2,
    Clock,
    ExternalLink,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface Student {
    id: number;
    curp: string | null;
    nombre_completo: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    fecha_nacimiento: string | null;
    nacionalidad: string | null;
    entidad_federativa: string | null;
    genero: string | null;
    nss: string | null;
    institucion_medica: string | null;
    tipo_sangre: string | null;
    discapacidad: string | null;
    diagnostico_medico: string | null;
    comorbilidades: string | null;
    alergias_graves: string | null;
    uso_aparatos: string | null;
    medicacion_nombre: string | null;
    medicacion_dosis: string | null;
    medicacion_horario: string | null;
    alerta_medica: string | null;
    tutor_nombre: string | null;
    tutor_apellido_paterno: string | null;
    tutor_apellido_materno: string | null;
    tutor_parentesco: string | null;
    tel_emergencia_1: string | null;
    tel_emergencia_2: string | null;
    correo_tutor: string | null;
    domicilio_calle: string | null;
    domicilio_numero: string | null;
    domicilio_colonia: string | null;
    domicilio_municipio: string | null;
    domicilio_estado: string | null;
    domicilio_cp: string | null;
    comunicacion_tipo: string | null;
    nivel_lectoescritura: string | null;
    habilidades_autonomia: string[] | null;
    intereses_alumnos: string | null;
    detonantes_conducta: string | null;
    estatus_alumno: string | null;
    grado_grupo: string | null;
    fecha_ingreso: string | null;
    status: string;
    fotografia_display_url: string | null;
    doc_acta_nacimiento_url: string | null;
    curp_alumno_doc_url: string | null;
    doc_cert_discapacidad_url: string | null;
    nss_original_doc_url: string | null;
    comprobante_domicilio_doc_url: string | null;
    ine_tutor_doc_url: string | null;
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

const genderLabels: Record<string, string> = {
    femenino: 'Femenino', masculino: 'Masculino', no_binario: 'No binario', no_especificar: 'Prefiero no especificar',
};

const bloodTypeLabels: Record<string, string> = {
    o_positivo: 'O+', o_negativo: 'O-', a_positivo: 'A+', a_negativo: 'A-',
    b_positivo: 'B+', b_negativo: 'B-', ab_positivo: 'AB+', ab_negativo: 'AB-',
};

const medicalInstitutionLabels: Record<string, string> = {
    imss: 'IMSS', issste: 'ISSSTE', seguro_popular: 'Seguro Popular',
    insabi_bienestar: 'INSABI / Bienestar', particular: 'Particular', otra: 'Otra', ninguna: 'Ninguna',
};

const kinshipLabels: Record<string, string> = {
    madre: 'Madre', padre: 'Padre', abuelo: 'Abuelo/a', tutor_legal: 'Tutor legal',
};

const communicationLabels: Record<string, string> = {
    verbal: 'Verbal', no_verbal: 'No verbal', mixta: 'Mixta',
    lengua_de_signos: 'Lengua de signos', pictogramas: 'Pictogramas', otra: 'Otra',
};

const literacyLabels: Record<string, string> = {
    no_lee: 'No lee', silabico: 'Silábico', alfabetico: 'Alfabético', consolidado: 'Consolidado',
};

const autonomyLabels: Record<string, string> = {
    alimentacion_independiente: 'Alimentación independiente', control_de_esfinteres: 'Control de esfínteres',
    higiene_personal: 'Higiene personal', vestido: 'Vestido', desplazamiento: 'Desplazamiento',
    comunicacion_basica: 'Comunicación básica',
};

function getInitials(student: Student): string {
    const first = student.nombre_completo?.[0] ?? '';
    const last = student.apellido_paterno?.[0] ?? '';
    return (first + last).toUpperCase();
}

function StudentsShow({ student }: { student: Student }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;

    const fullName = (student.nombre_completo ?? 'Sin nombre') +
        ([student.apellido_paterno, student.apellido_materno].filter(Boolean).length > 0
            ? ' ' + [student.apellido_paterno, student.apellido_materno].filter(Boolean).join(' ')
            : '');

    const documents = [
        { label: 'Acta de nacimiento', url: student.doc_acta_nacimiento_url },
        { label: 'CURP (documento)', url: student.curp_alumno_doc_url },
        { label: 'Certificado de discapacidad', url: student.doc_cert_discapacidad_url },
        { label: 'Documento NSS', url: student.nss_original_doc_url },
        { label: 'Comprobante de domicilio', url: student.comprobante_domicilio_doc_url },
        { label: 'INE del tutor', url: student.ine_tutor_doc_url },
    ];

    return (
        <>
            <Head title={fullName} />

            <Link
                href="/students"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL DIRECTORIO
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    {(can['students.edit'] || can['students.delete']) && (
                        <Card className="shadow-sm">
                            <CardContent className="px-5 py-4">
                                <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">ACCIONES</p>
                                <div className="flex flex-col gap-2">
                                    {can['students.edit'] && (
                                        <Button className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                                            <Link href={`/students/${student.id}/edit`}>
                                                <Pencil className="size-3.5" />
                                                EDITAR EXPEDIENTE
                                            </Link>
                                        </Button>
                                    )}
                                    {can['students.delete'] && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em] text-destructive hover:bg-destructive/8 hover:text-destructive">
                                                    <Trash2 className="size-3.5" />
                                                    ELIMINAR EXPEDIENTE
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Eliminar expediente</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Se eliminará permanentemente el expediente de {student.nombre_completo} {student.apellido_paterno}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        onClick={() => router.delete(`/students/${student.id}`)}
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main content */}
                <div className="space-y-4 lg:col-span-9">
                    {/* Header card */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="bg-primary px-6 py-6">
                            <div className="flex gap-5">
                                {/* Foto grande */}
                                <div className="shrink-0">
                                    {student.fotografia_display_url ? (
                                        <img
                                            src={student.fotografia_display_url}
                                            alt=""
                                            className="size-36 rounded-lg border-2 border-primary-foreground/15 object-cover shadow-lg"
                                        />
                                    ) : (
                                        <div className="flex size-36 items-center justify-center rounded-lg border-2 border-primary-foreground/15 bg-primary-foreground/10 text-3xl font-bold text-primary-foreground shadow-lg">
                                            {getInitials(student)}
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <p className="text-[10px] font-bold tracking-[0.15em] text-primary-foreground/60">EXPEDIENTE DE ALUMNO — GICEM</p>
                                    <h1 className="mt-1 text-2xl font-bold leading-tight text-primary-foreground">{fullName}</h1>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {student.curp && (
                                            <Badge variant="outline" className="border-primary-foreground/20 text-[10px] font-semibold tracking-wider text-primary-foreground/80">
                                                CURP: {student.curp}
                                            </Badge>
                                        )}
                                        {student.discapacidad && (
                                            <Badge variant="outline" className="border-primary-foreground/20 text-[10px] font-semibold tracking-wider text-primary-foreground/80">
                                                {disabilityLabels[student.discapacidad] ?? student.discapacidad}
                                            </Badge>
                                        )}
                                        {student.estatus_alumno && (
                                            <Badge variant="outline" className={`${statusColors[student.estatus_alumno] ?? ''} border-primary-foreground/20 text-[10px] font-semibold tracking-wider`}>
                                                {statusLabels[student.estatus_alumno] ?? student.estatus_alumno}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Datos Generales */}
                    <CollapsibleSection title="DATOS GENERALES" icon={FileText} defaultOpen>
                        <DataGrid items={[
                            { label: 'CURP', value: student.curp ?? 'No registrado' },
                            { label: 'Nombre(s)', value: student.nombre_completo ?? 'No registrado' },
                            { label: 'Apellido paterno', value: student.apellido_paterno ?? 'No registrado' },
                            { label: 'Apellido materno', value: student.apellido_materno ?? 'No registrado' },
                            { label: 'Fecha de nacimiento', value: student.fecha_nacimiento ?? 'No registrado' },
                            { label: 'Nacionalidad', value: student.nacionalidad ?? 'No registrado' },
                            { label: 'Entidad federativa', value: student.entidad_federativa ?? 'No registrado' },
                            { label: 'Género', value: student.genero ? (genderLabels[student.genero] ?? student.genero) : 'No registrado' },
                        ]} />
                    </CollapsibleSection>

                    {/* Perfil de Salud */}
                    <CollapsibleSection title="PERFIL DE SALUD" icon={Heart} defaultOpen>
                        <DataGrid items={[
                            { label: 'Discapacidad', value: student.discapacidad ? (disabilityLabels[student.discapacidad] ?? student.discapacidad) : 'No registrado' },
                            { label: 'Diagnóstico médico', value: student.diagnostico_medico ?? 'No registrado' },
                            { label: 'Comorbilidades', value: student.comorbilidades ?? 'Ninguna' },
                            { label: 'Alergias graves', value: student.alergias_graves ?? 'No registrado' },
                            { label: 'Uso de aparatos', value: student.uso_aparatos ?? 'No registrado' },
                            { label: 'Medicación', value: [student.medicacion_nombre, student.medicacion_dosis, student.medicacion_horario].filter(Boolean).join(' — ') || 'Ninguna' },
                            { label: 'Alerta médica', value: student.alerta_medica ?? 'No registrado' },
                            { label: 'NSS', value: student.nss ?? 'No registrado' },
                            { label: 'Institución médica', value: student.institucion_medica ? (medicalInstitutionLabels[student.institucion_medica] ?? student.institucion_medica) : 'No registrado' },
                            { label: 'Tipo de sangre', value: student.tipo_sangre ? (bloodTypeLabels[student.tipo_sangre] ?? student.tipo_sangre) : 'No registrado' },
                        ]} />
                    </CollapsibleSection>

                    {/* Entorno Familiar */}
                    <CollapsibleSection title="ENTORNO FAMILIAR" icon={Users}>
                        <DataGrid items={[
                            { label: 'Tutor', value: [student.tutor_nombre, student.tutor_apellido_paterno, student.tutor_apellido_materno].filter(Boolean).join(' ') || 'No registrado' },
                            { label: 'Parentesco', value: student.tutor_parentesco ? (kinshipLabels[student.tutor_parentesco] ?? student.tutor_parentesco) : 'No registrado' },
                            { label: 'Teléfono 1', value: student.tel_emergencia_1 ?? 'No registrado' },
                            { label: 'Teléfono 2', value: student.tel_emergencia_2 ?? 'No registrado' },
                            { label: 'Correo', value: student.correo_tutor ?? 'No registrado' },
                            { label: 'Domicilio', value: [student.domicilio_calle, student.domicilio_numero].filter(Boolean).join(' ')
                                + (student.domicilio_colonia ? `, ${student.domicilio_colonia}` : '')
                                + (student.domicilio_municipio ? `, ${student.domicilio_municipio}` : '')
                                + (student.domicilio_estado ? `, ${student.domicilio_estado}` : '')
                                + (student.domicilio_cp ? ` C.P. ${student.domicilio_cp}` : '') || 'No registrado' },
                        ]} />
                    </CollapsibleSection>

                    {/* Psicopedagógico */}
                    <CollapsibleSection title="PERFIL PSICOPEDAGÓGICO" icon={Brain}>
                        <DataGrid items={[
                            { label: 'Comunicación', value: student.comunicacion_tipo ? (communicationLabels[student.comunicacion_tipo] ?? student.comunicacion_tipo) : 'No registrado' },
                            { label: 'Lectoescritura', value: student.nivel_lectoescritura ? (literacyLabels[student.nivel_lectoescritura] ?? student.nivel_lectoescritura) : 'No registrado' },
                            { label: 'Habilidades de autonomía', value: (student.habilidades_autonomia ?? []).map((s) => autonomyLabels[s] ?? s).join(', ') || 'Ninguna' },
                            { label: 'Intereses', value: student.intereses_alumnos ?? 'No registrado' },
                            { label: 'Detonantes de conducta', value: student.detonantes_conducta ?? 'No registrado' },
                        ]} />
                    </CollapsibleSection>

                    {/* Control Administrativo */}
                    <CollapsibleSection title="CONTROL ADMINISTRATIVO" icon={ClipboardList}>
                        <DataGrid items={[
                            { label: 'Estatus', value: student.estatus_alumno ? (statusLabels[student.estatus_alumno] ?? student.estatus_alumno) : 'No registrado' },
                            { label: 'Grado / Grupo', value: student.grado_grupo ?? 'Sin asignar' },
                            { label: 'Fecha de ingreso', value: student.fecha_ingreso ?? 'No registrado' },
                        ]} />
                    </CollapsibleSection>

                    {/* Documentos */}
                    <CollapsibleSection title="DOCUMENTOS" icon={FolderOpen}>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {documents.map((doc) => (
                                <div key={doc.label} className="flex items-center justify-between rounded-lg border px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {doc.url ? (
                                            <CheckCircle2 className="size-4 text-affirmative" />
                                        ) : (
                                            <Clock className="size-4 text-muted-foreground" />
                                        )}
                                        <span className="text-sm">{doc.label}</span>
                                    </div>
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                            <ExternalLink className="size-4" />
                                        </a>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Pendiente</span>
                                    )}
                                </div>
                            ))}
                            {student.fotografia_display_url && (
                                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-affirmative" />
                                        <span className="text-sm">Fotografía</span>
                                    </div>
                                    <a href={student.fotografia_display_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                        <ExternalLink className="size-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
}

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }: {
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
                {open ? <ChevronUp className="size-4 text-primary" /> : <ChevronDown className="size-4 text-primary" />}
            </button>
            {open && <CardContent className="px-6 py-4">{children}</CardContent>}
        </Card>
    );
}

function DataGrid({ items }: { items: Array<{ label: string; value: string }> }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <div key={item.label}>
                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 text-sm text-foreground">{item.value}</p>
                </div>
            ))}
        </div>
    );
}

StudentsShow.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StudentsShow;

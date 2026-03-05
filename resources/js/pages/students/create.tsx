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
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Check,
    ChevronLeft,
    ClipboardList,
    FileText,
    Heart,
    Save,
    Users,
    Upload,
} from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

interface EnumOption {
    value: string;
    label: string;
}

interface Props {
    genderOptions: EnumOption[];
    bloodTypeOptions: EnumOption[];
    medicalInstitutionOptions: EnumOption[];
    disabilityOptions: EnumOption[];
    kinshipOptions: EnumOption[];
    communicationOptions: EnumOption[];
    literacyOptions: EnumOption[];
    autonomyOptions: EnumOption[];
    statusOptions: EnumOption[];
    groupOptions: EnumOption[];
}

const sections = [
    { number: '01', title: 'Identificación y Datos Generales', icon: FileText },
    { number: '02', title: 'Perfil de Salud', icon: Heart },
    { number: '03', title: 'Entorno Familiar', icon: Users },
    { number: '04', title: 'Perfil Psicopedagógico', icon: Brain },
    { number: '05', title: 'Control Administrativo', icon: ClipboardList },
];

type FormData = {
    curp: string;
    nombre_completo: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: string;
    nacionalidad: string;
    entidad_federativa: string;
    genero: string;
    nss: string;
    institucion_medica: string;
    tipo_sangre: string;
    discapacidad: string;
    diagnostico_medico: string;
    comorbilidades: string;
    alergias_graves: string;
    uso_aparatos: string;
    medicacion_nombre: string;
    medicacion_dosis: string;
    medicacion_horario: string;
    alerta_medica: string;
    tutor_nombre: string;
    tutor_apellido_paterno: string;
    tutor_apellido_materno: string;
    tutor_parentesco: string;
    tel_emergencia_1: string;
    tel_emergencia_2: string;
    correo_tutor: string;
    domicilio_calle: string;
    domicilio_numero: string;
    domicilio_colonia: string;
    domicilio_municipio: string;
    domicilio_estado: string;
    domicilio_cp: string;
    comunicacion_tipo: string;
    nivel_lectoescritura: string;
    habilidades_autonomia: string[];
    intereses_alumnos: string;
    detonantes_conducta: string;
    estatus_alumno: string;
    grado_grupo: string;
    fecha_ingreso: string;
    fotografia: File | null;
    doc_acta_nacimiento: File | null;
    curp_alumno_doc: File | null;
    doc_cert_discapacidad: File | null;
    nss_original_doc: File | null;
    comprobante_domicilio_doc: File | null;
    ine_tutor_doc: File | null;
    _action: string;
};

const requiredFieldsBySection: Record<number, (keyof FormData)[]> = {
    0: ['curp', 'nombre_completo', 'apellido_paterno', 'apellido_materno', 'fecha_nacimiento', 'nacionalidad', 'entidad_federativa', 'genero'],
    1: ['institucion_medica', 'tipo_sangre', 'discapacidad', 'diagnostico_medico', 'alergias_graves', 'uso_aparatos', 'alerta_medica'],
    2: ['tutor_nombre', 'tutor_apellido_paterno', 'tutor_apellido_materno', 'tutor_parentesco', 'tel_emergencia_1', 'correo_tutor', 'domicilio_calle', 'domicilio_numero', 'domicilio_colonia', 'domicilio_municipio', 'domicilio_estado', 'domicilio_cp'],
    3: ['comunicacion_tipo', 'nivel_lectoescritura', 'habilidades_autonomia', 'intereses_alumnos', 'detonantes_conducta'],
    4: ['estatus_alumno', 'fecha_ingreso'],
};

function StudentsCreate({
    genderOptions,
    bloodTypeOptions,
    medicalInstitutionOptions,
    disabilityOptions,
    kinshipOptions,
    communicationOptions,
    literacyOptions,
    autonomyOptions,
    statusOptions,
    groupOptions,
}: Props) {
    const [activeSection, setActiveSection] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [data, setDataState] = useState<FormData>({
        curp: '',
        nombre_completo: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        nacionalidad: 'Mexicana',
        entidad_federativa: '',
        genero: '',
        nss: '',
        institucion_medica: '',
        tipo_sangre: '',
        discapacidad: '',
        diagnostico_medico: '',
        comorbilidades: '',
        alergias_graves: '',
        uso_aparatos: '',
        medicacion_nombre: '',
        medicacion_dosis: '',
        medicacion_horario: '',
        alerta_medica: '',
        tutor_nombre: '',
        tutor_apellido_paterno: '',
        tutor_apellido_materno: '',
        tutor_parentesco: '',
        tel_emergencia_1: '',
        tel_emergencia_2: '',
        correo_tutor: '',
        domicilio_calle: '',
        domicilio_numero: '',
        domicilio_colonia: '',
        domicilio_municipio: '',
        domicilio_estado: '',
        domicilio_cp: '',
        comunicacion_tipo: '',
        nivel_lectoescritura: '',
        habilidades_autonomia: [],
        intereses_alumnos: '',
        detonantes_conducta: '',
        estatus_alumno: 'activo',
        grado_grupo: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        fotografia: null,
        doc_acta_nacimiento: null,
        curp_alumno_doc: null,
        doc_cert_discapacidad: null,
        nss_original_doc: null,
        comprobante_domicilio_doc: null,
        ine_tutor_doc: null,
        _action: 'finalize',
    });

    function setData<K extends keyof FormData>(key: K, value: FormData[K]) {
        setDataState((prev) => ({ ...prev, [key]: value }));
    }

    function isSectionComplete(sectionIndex: number): boolean {
        const fields = requiredFieldsBySection[sectionIndex];
        if (!fields) return false;
        return fields.every((field) => {
            const value = data[field];
            if (Array.isArray(value)) return value.length > 0;
            return value !== '' && value !== null && value !== undefined;
        });
    }

    function handleAutonomyToggle(value: string) {
        const current = data.habilidades_autonomia;
        if (current.includes(value)) {
            setData('habilidades_autonomia', current.filter((v) => v !== value));
        } else {
            setData('habilidades_autonomia', [...current, value]);
        }
    }

    function submitForm(action: 'draft' | 'finalize') {
        setProcessing(true);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === '_action') return;
            if (value === null || value === undefined) return;
            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((v) => formData.append(`${key}[]`, v));
            } else {
                formData.append(key, String(value));
            }
        });
        formData.append('_action', action);

        router.post('/students', formData, {
            forceFormData: true,
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Nuevo Expediente" />

            <Link
                href="/students"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL DIRECTORIO
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Nuevo Expediente de Alumno
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Complete la información del expediente. Puede guardar como borrador en cualquier momento.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sidebar de secciones */}
                <div className="lg:col-span-3">
                    <div className="sticky top-6">
                        <Card className="shadow-sm">
                            <CardContent className="px-4 py-4">
                                <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">SECCIONES</p>
                                <nav className="space-y-1">
                                    {sections.map((section, index) => {
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

                        {/* Botón borrador siempre visible en sidebar */}
                        <Button
                            variant="outline"
                            className="mt-3 h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em]"
                            disabled={processing}
                            onClick={() => submitForm('draft')}
                        >
                            <Save className="size-3.5" />
                            GUARDAR BORRADOR
                        </Button>
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="lg:col-span-9">
                    {/* Sección 01: Identificación y Datos Generales */}
                    {activeSection === 0 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <FileText className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">01. IDENTIFICACIÓN Y DATOS GENERALES</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="CURP *" error={errors.curp}>
                                    <Input
                                        value={data.curp}
                                        onChange={(e) => setData('curp', e.target.value.toUpperCase())}
                                        maxLength={18}
                                        placeholder="ABCD010101HDFRRN09"
                                        className="h-10"
                                    />
                                </FormField>
                                <FormField label="NOMBRE(S) *" error={errors.nombre_completo}>
                                    <Input value={data.nombre_completo} onChange={(e) => setData('nombre_completo', e.target.value)} placeholder="Nombre(s)" className="h-10" />
                                </FormField>
                                <FormField label="APELLIDO PATERNO *" error={errors.apellido_paterno}>
                                    <Input value={data.apellido_paterno} onChange={(e) => setData('apellido_paterno', e.target.value)} placeholder="Apellido paterno" className="h-10" />
                                </FormField>
                                <FormField label="APELLIDO MATERNO *" error={errors.apellido_materno}>
                                    <Input value={data.apellido_materno} onChange={(e) => setData('apellido_materno', e.target.value)} placeholder="Apellido materno" className="h-10" />
                                </FormField>
                                <FormField label="FECHA DE NACIMIENTO *" error={errors.fecha_nacimiento}>
                                    <Input type="date" value={data.fecha_nacimiento} onChange={(e) => setData('fecha_nacimiento', e.target.value)} className="h-10" />
                                </FormField>
                                <FormField label="NACIONALIDAD *" error={errors.nacionalidad}>
                                    <Input value={data.nacionalidad} onChange={(e) => setData('nacionalidad', e.target.value)} placeholder="Mexicana" className="h-10" />
                                </FormField>
                                <FormField label="ENTIDAD FEDERATIVA *" error={errors.entidad_federativa}>
                                    <Input value={data.entidad_federativa} onChange={(e) => setData('entidad_federativa', e.target.value)} placeholder="Estado de México" className="h-10" />
                                </FormField>
                                <FormField label="GÉNERO *" error={errors.genero}>
                                    <Select value={data.genero} onValueChange={(v) => setData('genero', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {genderOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FileUploadField
                                    label="FOTOGRAFÍA"
                                    accept="image/*"
                                    error={errors.fotografia}
                                    file={data.fotografia}
                                    onFileChange={(f) => setData('fotografia', f)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Sección 02: Perfil de Salud */}
                    {activeSection === 1 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <Heart className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">02. PERFIL DE SALUD</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="DISCAPACIDAD PRIMARIA *" error={errors.discapacidad}>
                                    <Select value={data.discapacidad} onValueChange={(v) => setData('discapacidad', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {disabilityOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="DIAGNÓSTICO MÉDICO *" error={errors.diagnostico_medico} className="md:col-span-2">
                                    <Textarea value={data.diagnostico_medico} onChange={(e) => setData('diagnostico_medico', e.target.value)} placeholder="Diagnóstico médico detallado" rows={3} />
                                </FormField>
                                <FormField label="COMORBILIDADES" error={errors.comorbilidades}>
                                    <Textarea value={data.comorbilidades} onChange={(e) => setData('comorbilidades', e.target.value)} placeholder="Comorbilidades (opcional)" rows={2} />
                                </FormField>
                                <FormField label="ALERGIAS GRAVES *" error={errors.alergias_graves}>
                                    <Textarea value={data.alergias_graves} onChange={(e) => setData('alergias_graves', e.target.value)} placeholder='Si no tiene, escriba "Ninguna"' rows={2} />
                                </FormField>
                                <FormField label="MEDICACIÓN (NOMBRE)" error={errors.medicacion_nombre}>
                                    <Input value={data.medicacion_nombre} onChange={(e) => setData('medicacion_nombre', e.target.value)} placeholder="Nombre del medicamento" className="h-10" />
                                </FormField>
                                <FormField label="MEDICACIÓN (DOSIS)" error={errors.medicacion_dosis}>
                                    <Input value={data.medicacion_dosis} onChange={(e) => setData('medicacion_dosis', e.target.value)} placeholder="Dosis" className="h-10" />
                                </FormField>
                                <FormField label="MEDICACIÓN (HORARIO)" error={errors.medicacion_horario}>
                                    <Input value={data.medicacion_horario} onChange={(e) => setData('medicacion_horario', e.target.value)} placeholder="Horario de administración" className="h-10" />
                                </FormField>
                                <FormField label="ALERTA MÉDICA *" error={errors.alerta_medica} className="md:col-span-2">
                                    <Textarea value={data.alerta_medica} onChange={(e) => setData('alerta_medica', e.target.value)} placeholder='Si no hay, escriba "Ninguna"' rows={2} />
                                </FormField>
                                <FormField label="USO DE APARATOS *" error={errors.uso_aparatos}>
                                    <Input value={data.uso_aparatos} onChange={(e) => setData('uso_aparatos', e.target.value)} placeholder='Si no usa, escriba "Ninguno"' className="h-10" />
                                </FormField>
                                <FormField label="NSS" error={errors.nss}>
                                    <Input value={data.nss} onChange={(e) => setData('nss', e.target.value)} placeholder="Número de seguridad social" className="h-10" />
                                </FormField>
                                <FormField label="INSTITUCIÓN MÉDICA *" error={errors.institucion_medica}>
                                    <Select value={data.institucion_medica} onValueChange={(v) => setData('institucion_medica', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {medicalInstitutionOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="TIPO DE SANGRE *" error={errors.tipo_sangre}>
                                    <Select value={data.tipo_sangre} onValueChange={(v) => setData('tipo_sangre', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {bloodTypeOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FileUploadField
                                    label="CERT. DISCAPACIDAD (PDF)"
                                    accept=".pdf"
                                    error={errors.doc_cert_discapacidad}
                                    file={data.doc_cert_discapacidad}
                                    onFileChange={(f) => setData('doc_cert_discapacidad', f)}
                                />
                                <FileUploadField
                                    label="DOC. NSS (PDF)"
                                    accept=".pdf"
                                    error={errors.nss_original_doc}
                                    file={data.nss_original_doc}
                                    onFileChange={(f) => setData('nss_original_doc', f)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Sección 03: Entorno Familiar */}
                    {activeSection === 2 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <Users className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">03. ENTORNO FAMILIAR Y CONTACTO</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="NOMBRE DEL TUTOR *" error={errors.tutor_nombre}>
                                    <Input value={data.tutor_nombre} onChange={(e) => setData('tutor_nombre', e.target.value)} placeholder="Nombre(s)" className="h-10" />
                                </FormField>
                                <FormField label="APELLIDO PATERNO DEL TUTOR *" error={errors.tutor_apellido_paterno}>
                                    <Input value={data.tutor_apellido_paterno} onChange={(e) => setData('tutor_apellido_paterno', e.target.value)} placeholder="Apellido paterno" className="h-10" />
                                </FormField>
                                <FormField label="APELLIDO MATERNO DEL TUTOR *" error={errors.tutor_apellido_materno}>
                                    <Input value={data.tutor_apellido_materno} onChange={(e) => setData('tutor_apellido_materno', e.target.value)} placeholder="Apellido materno" className="h-10" />
                                </FormField>
                                <FormField label="PARENTESCO *" error={errors.tutor_parentesco}>
                                    <Select value={data.tutor_parentesco} onValueChange={(v) => setData('tutor_parentesco', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {kinshipOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="TELÉFONO DE EMERGENCIA 1 *" error={errors.tel_emergencia_1}>
                                    <Input value={data.tel_emergencia_1} onChange={(e) => setData('tel_emergencia_1', e.target.value)} placeholder="10 dígitos" className="h-10" />
                                </FormField>
                                <FormField label="TELÉFONO DE EMERGENCIA 2" error={errors.tel_emergencia_2}>
                                    <Input value={data.tel_emergencia_2} onChange={(e) => setData('tel_emergencia_2', e.target.value)} placeholder="10 dígitos (opcional)" className="h-10" />
                                </FormField>
                                <FormField label="CORREO DEL TUTOR *" error={errors.correo_tutor}>
                                    <Input type="email" value={data.correo_tutor} onChange={(e) => setData('correo_tutor', e.target.value)} placeholder="correo@ejemplo.com" className="h-10" />
                                </FormField>
                                <div className="md:col-span-2">
                                    <p className="mb-4 mt-2 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">DOMICILIO</p>
                                </div>
                                <FormField label="CALLE *" error={errors.domicilio_calle}>
                                    <Input value={data.domicilio_calle} onChange={(e) => setData('domicilio_calle', e.target.value)} placeholder="Nombre de la calle" className="h-10" />
                                </FormField>
                                <FormField label="NÚMERO *" error={errors.domicilio_numero}>
                                    <Input value={data.domicilio_numero} onChange={(e) => setData('domicilio_numero', e.target.value)} placeholder="No. ext/int" className="h-10" />
                                </FormField>
                                <FormField label="COLONIA *" error={errors.domicilio_colonia}>
                                    <Input value={data.domicilio_colonia} onChange={(e) => setData('domicilio_colonia', e.target.value)} placeholder="Colonia" className="h-10" />
                                </FormField>
                                <FormField label="MUNICIPIO *" error={errors.domicilio_municipio}>
                                    <Input value={data.domicilio_municipio} onChange={(e) => setData('domicilio_municipio', e.target.value)} placeholder="Municipio" className="h-10" />
                                </FormField>
                                <FormField label="ESTADO *" error={errors.domicilio_estado}>
                                    <Input value={data.domicilio_estado} onChange={(e) => setData('domicilio_estado', e.target.value)} placeholder="Estado" className="h-10" />
                                </FormField>
                                <FormField label="CÓDIGO POSTAL *" error={errors.domicilio_cp}>
                                    <Input value={data.domicilio_cp} onChange={(e) => setData('domicilio_cp', e.target.value)} maxLength={5} placeholder="5 dígitos" className="h-10" />
                                </FormField>
                                <FileUploadField
                                    label="COMPROBANTE DOMICILIO (PDF)"
                                    accept=".pdf"
                                    error={errors.comprobante_domicilio_doc}
                                    file={data.comprobante_domicilio_doc}
                                    onFileChange={(f) => setData('comprobante_domicilio_doc', f)}
                                />
                                <FileUploadField
                                    label="INE TUTOR (PDF)"
                                    accept=".pdf"
                                    error={errors.ine_tutor_doc}
                                    file={data.ine_tutor_doc}
                                    onFileChange={(f) => setData('ine_tutor_doc', f)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Sección 04: Psicopedagógico */}
                    {activeSection === 3 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <Brain className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">04. PERFIL PSICOPEDAGÓGICO</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="TIPO DE COMUNICACIÓN *" error={errors.comunicacion_tipo}>
                                    <Select value={data.comunicacion_tipo} onValueChange={(v) => setData('comunicacion_tipo', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {communicationOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="NIVEL DE LECTOESCRITURA *" error={errors.nivel_lectoescritura}>
                                    <Select value={data.nivel_lectoescritura} onValueChange={(v) => setData('nivel_lectoescritura', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {literacyOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                                        HABILIDADES DE AUTONOMÍA *
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Seleccione las habilidades que el alumno demuestra.
                                    </p>
                                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {autonomyOptions.map((opt) => {
                                            const isChecked = data.habilidades_autonomia.includes(opt.value);
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleAutonomyToggle(opt.value)}
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
                                    {errors.habilidades_autonomia && (
                                        <p className="text-xs text-destructive">{errors.habilidades_autonomia}</p>
                                    )}
                                </div>
                                <FormField label="INTERESES DEL ALUMNO *" error={errors.intereses_alumnos} className="md:col-span-2">
                                    <Textarea value={data.intereses_alumnos} onChange={(e) => setData('intereses_alumnos', e.target.value)} placeholder="Actividades, temas o estímulos que interesan al alumno" rows={3} />
                                </FormField>
                                <FormField label="DETONANTES DE CONDUCTA *" error={errors.detonantes_conducta} className="md:col-span-2">
                                    <Textarea value={data.detonantes_conducta} onChange={(e) => setData('detonantes_conducta', e.target.value)} placeholder="Situaciones que pueden desencadenar una crisis o cambio de conducta" rows={3} />
                                </FormField>
                            </CardContent>
                        </Card>
                    )}

                    {/* Sección 05: Control Administrativo */}
                    {activeSection === 4 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <ClipboardList className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">05. CONTROL ADMINISTRATIVO Y DOCUMENTACIÓN</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="ESTATUS DEL ALUMNO *" error={errors.estatus_alumno}>
                                    <Select value={data.estatus_alumno} onValueChange={(v) => setData('estatus_alumno', v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="GRADO / GRUPO" error={errors.grado_grupo}>
                                    <Select value={data.grado_grupo} onValueChange={(v) => setData('grado_grupo', v === 'none' ? '' : v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin asignar</SelectItem>
                                            {groupOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="FECHA DE INGRESO *" error={errors.fecha_ingreso}>
                                    <Input type="date" value={data.fecha_ingreso} onChange={(e) => setData('fecha_ingreso', e.target.value)} className="h-10" />
                                </FormField>
                                <FileUploadField
                                    label="ACTA DE NACIMIENTO (PDF)"
                                    accept=".pdf"
                                    error={errors.doc_acta_nacimiento}
                                    file={data.doc_acta_nacimiento}
                                    onFileChange={(f) => setData('doc_acta_nacimiento', f)}
                                />
                                <FileUploadField
                                    label="CURP ALUMNO (PDF)"
                                    accept=".pdf"
                                    error={errors.curp_alumno_doc}
                                    file={data.curp_alumno_doc}
                                    onFileChange={(f) => setData('curp_alumno_doc', f)}
                                />
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
                            {activeSection < sections.length - 1 ? (
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
                                    type="button"
                                    disabled={processing}
                                    className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                                    onClick={() => submitForm('finalize')}
                                >
                                    <Save className="size-4" />
                                    {processing ? 'GUARDANDO...' : 'FINALIZAR EXPEDIENTE'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function FormField({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={`space-y-2 ${className ?? ''}`}>
            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                {label}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

function FileUploadField({ label, accept, error, file, onFileChange, existingUrl }: {
    label: string;
    accept: string;
    error?: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    existingUrl?: string | null;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">
                {label}
            </Label>
            <div
                onClick={() => inputRef.current?.click()}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
            >
                <Upload className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                    {file ? file.name : existingUrl ? 'Archivo subido (click para reemplazar)' : 'Click para seleccionar archivo'}
                </span>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

StudentsCreate.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StudentsCreate;

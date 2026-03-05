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
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronLeft,
    KeyRound,
    Save,
    Upload,
    User,
} from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

interface EnumOption {
    value: string;
    label: string;
}

interface StaffMember {
    id: number;
    name: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    email: string;
    rol_sistema: string;
    grupo_asignado_id: number | null;
    fotografia_display_url: string | null;
}

interface Props {
    member: StaffMember;
    roleOptions: EnumOption[];
    groupOptions: EnumOption[];
}

const sectionsList = [
    { number: '01', title: 'Datos Personales', icon: User },
    { number: '02', title: 'Acceso al Sistema', icon: KeyRound },
];

type FormData = {
    name: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    password: string;
    rol_sistema: string;
    grupo_asignado_id: string;
    fotografia: File | null;
};

const requiredFieldsBySection: Record<number, (keyof FormData)[]> = {
    0: ['name', 'apellido_paterno', 'apellido_materno', 'email'],
    1: ['rol_sistema'],
};

function StaffEdit({ member, roleOptions, groupOptions }: Props) {
    const [activeSection, setActiveSection] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [data, setDataState] = useState<FormData>({
        name: member.name,
        apellido_paterno: member.apellido_paterno ?? '',
        apellido_materno: member.apellido_materno ?? '',
        email: member.email,
        password: '',
        rol_sistema: member.rol_sistema,
        grupo_asignado_id: member.grupo_asignado_id ? String(member.grupo_asignado_id) : '',
        fotografia: null,
    });

    function setData<K extends keyof FormData>(key: K, value: FormData[K]) {
        setDataState((prev) => ({ ...prev, [key]: value }));
    }

    function isSectionComplete(sectionIndex: number): boolean {
        const fields = requiredFieldsBySection[sectionIndex];
        if (!fields) return false;
        return fields.every((field) => {
            const value = data[field];
            return value !== '' && value !== null && value !== undefined;
        });
    }

    function submitForm() {
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'put');
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        });

        router.post(`/staff/${member.id}`, formData, {
            forceFormData: true,
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => setProcessing(false),
        });
    }

    const fullName = member.name +
        ([member.apellido_paterno, member.apellido_materno].filter(Boolean).length > 0
            ? ' ' + [member.apellido_paterno, member.apellido_materno].filter(Boolean).join(' ')
            : '');

    return (
        <>
            <Head title="Editar Personal" />

            <Link
                href={`/staff/${member.id}`}
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL PERFIL
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Personal</h1>
                <p className="mt-1 text-sm text-muted-foreground">{fullName}</p>
            </div>

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
                    {/* Seccion 01: Datos Personales */}
                    {activeSection === 0 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <User className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">01. DATOS PERSONALES</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="NOMBRE(S) *" error={errors.name}>
                                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nombre(s)" className="h-10" />
                                </FormField>
                                <FormField label="APELLIDO PATERNO *" error={errors.apellido_paterno}>
                                    <Input value={data.apellido_paterno} onChange={(e) => setData('apellido_paterno', e.target.value)} placeholder="Apellido paterno" className="h-10" />
                                </FormField>
                                <FormField label="APELLIDO MATERNO *" error={errors.apellido_materno}>
                                    <Input value={data.apellido_materno} onChange={(e) => setData('apellido_materno', e.target.value)} placeholder="Apellido materno" className="h-10" />
                                </FormField>
                                <FormField label="CORREO ELECTRONICO *" error={errors.email}>
                                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="ejemplo@correo.com" className="h-10" />
                                </FormField>
                                <FileUploadField
                                    label="FOTOGRAFIA"
                                    accept="image/*"
                                    error={errors.fotografia}
                                    file={data.fotografia}
                                    onFileChange={(f) => setData('fotografia', f)}
                                    existingUrl={member.fotografia_display_url}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Seccion 02: Acceso al Sistema */}
                    {activeSection === 1 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <KeyRound className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">02. ACCESO AL SISTEMA</span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="CONTRASENA" error={errors.password}>
                                    <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Dejar vacio para no cambiar" className="h-10" />
                                </FormField>
                                <FormField label="PERFIL DE USUARIO *" error={errors.rol_sistema}>
                                    <Select value={data.rol_sistema} onValueChange={(v) => setData('rol_sistema', v)}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {roleOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="GRUPO ASIGNADO" error={errors.grupo_asignado_id}>
                                    <Select value={data.grupo_asignado_id} onValueChange={(v) => setData('grupo_asignado_id', v === 'none' ? '' : v)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin asignar</SelectItem>
                                            {groupOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
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
                                    type="button"
                                    disabled={processing}
                                    className="h-11 gap-2 text-xs font-semibold tracking-[0.1em]"
                                    onClick={submitForm}
                                >
                                    <Save className="size-4" />
                                    {processing ? 'GUARDANDO...' : 'ACTUALIZAR PERSONAL'}
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
            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">{label}</Label>
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
            <Label className="text-[11px] font-bold tracking-[0.1em] uppercase text-foreground">{label}</Label>
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

StaffEdit.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default StaffEdit;

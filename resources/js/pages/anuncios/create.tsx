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
    Check,
    ChevronLeft,
    MessageSquare,
    Send,
    Upload,
    Users,
} from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

interface EnumOption {
    value: string;
    label: string;
}

interface Props {
    tipoEmisorOptions: EnumOption[];
    alcanceOptions: EnumOption[];
    prioridadOptions: EnumOption[];
    userOptions: EnumOption[];
    groupOptions: EnumOption[];
}

const sectionsList = [
    { number: '01', title: 'Contenido del Anuncio', icon: MessageSquare },
    { number: '02', title: 'Destinatarios', icon: Users },
];

type FormData = {
    asunto: string;
    mensaje: string;
    prioridad: string;
    adjunto: File | null;
    tipo_emisor: string;
    alcance: string;
    destinatario_id: string;
};

const requiredFieldsBySection: Record<number, (keyof FormData)[]> = {
    0: ['asunto', 'mensaje', 'prioridad'],
    1: ['tipo_emisor', 'alcance'],
};

function AnunciosCreate({ tipoEmisorOptions, alcanceOptions, prioridadOptions, userOptions, groupOptions }: Props) {
    const [activeSection, setActiveSection] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [data, setDataState] = useState<FormData>({
        asunto: '',
        mensaje: '',
        prioridad: '',
        adjunto: null,
        tipo_emisor: '',
        alcance: '',
        destinatario_id: '',
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
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        });

        router.post('/anuncios', formData, {
            forceFormData: true,
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => setProcessing(false),
        });
    }

    const showDestinatarioSelector = data.alcance === 'grupo' || data.alcance === 'privado';

    return (
        <>
            <Head title="Nuevo Anuncio" />

            <Link
                href="/anuncios"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR A ANUNCIOS
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo Anuncio</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Redacte y envíe un comunicado a los destinatarios seleccionados.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sidebar de secciones */}
                <div className="lg:col-span-3">
                    <div className="sticky top-6">
                        <Card className="shadow-sm">
                            <CardContent className="px-4 py-4">
                                <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">
                                    SECCIONES
                                </p>
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
                                                <span
                                                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                        isComplete
                                                            ? 'bg-affirmative text-white'
                                                            : isActive
                                                              ? 'bg-golden text-white'
                                                              : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {isComplete ? <Check className="size-3.5" /> : section.number}
                                                </span>
                                                <span
                                                    className={`text-xs font-semibold leading-tight ${isActive ? 'text-golden' : ''}`}
                                                >
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
                    {/* Seccion 01: Contenido del Anuncio */}
                    {activeSection === 0 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <MessageSquare className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    01. CONTENIDO DEL ANUNCIO
                                </span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="ASUNTO *" error={errors.asunto} className="col-span-full">
                                    <Input
                                        value={data.asunto}
                                        onChange={(e) => setData('asunto', e.target.value)}
                                        placeholder="Título del anuncio"
                                        className="h-10"
                                    />
                                </FormField>
                                <FormField label="MENSAJE *" error={errors.mensaje} className="col-span-full">
                                    <Textarea
                                        value={data.mensaje}
                                        onChange={(e) => setData('mensaje', e.target.value)}
                                        placeholder="Escriba el contenido del anuncio..."
                                        rows={6}
                                    />
                                </FormField>
                                <FormField label="PRIORIDAD *" error={errors.prioridad}>
                                    <Select value={data.prioridad} onValueChange={(v) => setData('prioridad', v)}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Seleccionar prioridad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {prioridadOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FileUploadField
                                    label="ADJUNTO"
                                    accept="*/*"
                                    error={errors.adjunto}
                                    file={data.adjunto}
                                    onFileChange={(f) => setData('adjunto', f)}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Seccion 02: Destinatarios */}
                    {activeSection === 1 && (
                        <Card className="overflow-hidden border-l-4 border-l-primary py-0 shadow-sm">
                            <div className="flex items-center gap-2 bg-primary px-6 py-3">
                                <Users className="size-4 text-primary-foreground/70" />
                                <span className="text-[11px] font-bold tracking-[0.1em] text-primary-foreground">
                                    02. DESTINATARIOS
                                </span>
                            </div>
                            <CardContent className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
                                <FormField label="TIPO DE EMISOR *" error={errors.tipo_emisor}>
                                    <Select
                                        value={data.tipo_emisor}
                                        onValueChange={(v) => setData('tipo_emisor', v)}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tipoEmisorOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="ALCANCE *" error={errors.alcance}>
                                    <Select
                                        value={data.alcance}
                                        onValueChange={(v) => {
                                            setData('alcance', v);
                                            setData('destinatario_id', '');
                                        }}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Seleccionar alcance" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {alcanceOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                {showDestinatarioSelector && (
                                    <FormField
                                        label={data.alcance === 'grupo' ? 'GRUPO DESTINATARIO *' : 'USUARIO DESTINATARIO *'}
                                        error={errors.destinatario_id}
                                        className="col-span-full"
                                    >
                                        <Select
                                            value={data.destinatario_id}
                                            onValueChange={(v) => setData('destinatario_id', v)}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Seleccionar destinatario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(data.alcance === 'grupo' ? groupOptions : userOptions).map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                )}
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
                                    <Send className="size-4" />
                                    {processing ? 'ENVIANDO...' : 'ENVIAR ANUNCIO'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function FormField({
    label,
    error,
    className,
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`space-y-2 ${className ?? ''}`}>
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">{label}</Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

function FileUploadField({
    label,
    accept,
    error,
    file,
    onFileChange,
}: {
    label: string;
    accept: string;
    error?: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">{label}</Label>
            <div
                onClick={() => inputRef.current?.click()}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
            >
                <Upload className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                    {file ? file.name : 'Click para seleccionar archivo'}
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

AnunciosCreate.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default AnunciosCreate;

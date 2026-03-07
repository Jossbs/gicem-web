import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { type Auth } from '@/types/data/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, ChevronUp, Mail, MapPin, Pencil, UserPlus } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface StudentGuardian {
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
    tutor_user_email: string | null;
}

const kinshipLabels: Record<string, string> = {
    madre: 'Madre', padre: 'Padre', abuelo: 'Abuelo/a', tutor_legal: 'Tutor legal',
};

function GuardiansShow({ student }: { student: StudentGuardian }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const can = auth.can;
    const [processing, setProcessing] = useState(false);
    const hasAccount = !!student.tutor_user_id;

    const fullAddress = [
        student.domicilio_calle,
        student.domicilio_numero,
        student.domicilio_colonia,
        student.domicilio_municipio,
        student.domicilio_estado,
        student.domicilio_cp,
    ]
        .filter(Boolean)
        .join(', ');

    function handleCreateAccount() {
        setProcessing(true);
        router.post(`/guardians/${student.id}/create-account`, {}, {
            onFinish: () => setProcessing(false),
        });
    }

    function handleSendInvitation() {
        setProcessing(true);
        router.post(`/guardians/${student.id}/send-invitation`, {}, {
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title={`${student.tutor_nombre} ${student.tutor_apellido_paterno} ${student.tutor_apellido_materno}`} />

            <Link
                href="/guardians"
                className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-3.5" />
                REGRESAR AL DIRECTORIO
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Sidebar */}
                <div className="space-y-4 lg:col-span-3">
                    {can['students.edit'] && (
                        <Card className="shadow-sm">
                            <CardContent className="px-5 py-4">
                                <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">ACCIONES</p>
                                <Button className="h-10 w-full gap-2 text-[10px] font-semibold tracking-[0.1em]" asChild>
                                    <Link href={`/students/${student.id}/edit`}>
                                        <Pencil className="size-3.5" />
                                        EDITAR EXPEDIENTE
                                    </Link>
                                </Button>
                                <p className="mt-3 text-[10px] text-muted-foreground">
                                    Los datos del tutor se modifican desde el expediente del alumno asociado.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {can['guardians.create-account'] && (
                        <Card className="shadow-sm">
                            <CardContent className="px-5 py-4">
                                <p className="mb-3 text-[11px] font-bold tracking-[0.1em] text-muted-foreground">CUENTA DE USUARIO</p>

                                {hasAccount ? (
                                    <>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Badge className="bg-affirmative text-white">Activa</Badge>
                                            <span className="text-xs text-muted-foreground">{student.tutor_user_email}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em]"
                                            onClick={handleSendInvitation}
                                            disabled={processing}
                                        >
                                            <Mail className="size-4" />
                                            ENVIAR INVITACIÓN
                                        </Button>
                                        <p className="mt-2 text-[10px] text-muted-foreground">
                                            Envía un correo con enlace para establecer contraseña.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <Badge variant="secondary">Sin cuenta</Badge>
                                        </div>
                                        <Button
                                            className="h-10 w-full gap-2 text-xs font-semibold tracking-[0.1em]"
                                            onClick={handleCreateAccount}
                                            disabled={processing}
                                        >
                                            <UserPlus className="size-4" />
                                            CREAR CUENTA
                                        </Button>
                                        <p className="mt-2 text-[10px] text-muted-foreground">
                                            Crea una cuenta con el correo del tutor y envía invitación.
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main content */}
                <div className="space-y-4 lg:col-span-9">
                    {/* Header */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="bg-primary px-6 py-4">
                            <h1 className="text-xl font-bold text-primary-foreground">
                                {student.tutor_nombre} {student.tutor_apellido_paterno} {student.tutor_apellido_materno}
                            </h1>
                            <p className="mt-0.5 text-sm text-primary-foreground/70">
                                {kinshipLabels[student.tutor_parentesco] ?? student.tutor_parentesco} de {student.nombre_completo} {student.apellido_paterno}
                            </p>
                        </div>
                    </Card>

                    <CollapsibleSection title="DATOS DEL TUTOR" defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DataItem label="Nombre(s)" value={student.tutor_nombre} />
                            <DataItem label="Apellido paterno" value={student.tutor_apellido_paterno} />
                            <DataItem label="Apellido materno" value={student.tutor_apellido_materno} />
                            <DataItem label="Parentesco" value={kinshipLabels[student.tutor_parentesco] ?? student.tutor_parentesco} />
                            <DataItem label="Teléfono 1" value={student.tel_emergencia_1} />
                            <DataItem label="Teléfono 2" value={student.tel_emergencia_2 ?? 'No registrado'} />
                            <DataItem label="Correo electrónico" value={student.correo_tutor} />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="DOMICILIO" defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <DataItem label="Calle" value={student.domicilio_calle} />
                            <DataItem label="Número" value={student.domicilio_numero} />
                            <DataItem label="Colonia" value={student.domicilio_colonia} />
                            <DataItem label="Municipio" value={student.domicilio_municipio} />
                            <DataItem label="Estado" value={student.domicilio_estado} />
                            <DataItem label="Código postal" value={student.domicilio_cp} />
                        </div>

                        {fullAddress && (
                            <div className="mt-5">
                                <div className="mb-2 flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-primary" />
                                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">
                                        UBICACIÓN
                                    </p>
                                </div>
                                <div className="overflow-hidden rounded-lg border">
                                    <iframe
                                        title="Mapa de ubicación"
                                        width="100%"
                                        height="280"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                                    />
                                </div>
                            </div>
                        )}
                    </CollapsibleSection>

                    <CollapsibleSection title="ALUMNO ASOCIADO" defaultOpen>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <DataItem label="Alumno" value={`${student.nombre_completo} ${student.apellido_paterno} ${student.apellido_materno}`} />
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Ver expediente</p>
                                <Link href={`/students/${student.id}`} className="mt-0.5 text-sm font-medium text-primary hover:underline">
                                    Ir al expediente del alumno
                                </Link>
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
}

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="overflow-hidden shadow-sm">
            <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-l-[3px] border-l-primary bg-card px-5 py-3 text-left transition-colors hover:bg-muted/50">
                <span className="text-[11px] font-bold tracking-[0.12em] text-foreground">{title}</span>
                {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
            </button>
            {open && <CardContent className="px-6 py-4">{children}</CardContent>}
        </Card>
    );
}

function DataItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm text-foreground">{value}</p>
        </div>
    );
}

GuardiansShow.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default GuardiansShow;

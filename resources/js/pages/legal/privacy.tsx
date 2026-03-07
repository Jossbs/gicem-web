import { AppLogo } from '@/components/ux/app-logo';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield } from 'lucide-react';

const sections = [
    {
        title: '1. Identidad y Domicilio del Responsable',
        content: (
            <>
                <p>
                    El Responsable del tratamiento de sus datos personales es <strong>Konekia / GICEM</strong>, con
                    domicilio físico en <strong>San Rafael, Veracruz</strong>, y correo electrónico de contacto{' '}
                    <strong>gicem@gmail.com</strong>. Nos comprometemos a salvaguardar la privacidad de la información
                    de los alumnos y sus familias con los más altos estándares de seguridad.
                </p>
            </>
        ),
    },
    {
        title: '2. Definición de Datos Personales Sensibles',
        content: (
            <>
                <p>
                    Debido a la naturaleza del sistema <strong>GICEM</strong>, se informa que se tratarán{' '}
                    <strong>Datos Personales Sensibles</strong>. Estos son aquellos que afectan la esfera más íntima de
                    su titular, cuya utilización indebida pueda dar origen a discriminación o conlleve un riesgo grave.
                    En nuestro caso, esto incluye:
                </p>
                <ul>
                    <li>Estado de salud presente y futuro.</li>
                    <li>Información sobre discapacidades (físicas, intelectuales, sensoriales o múltiples).</li>
                    <li>Diagnósticos psicológicos y pedagógicos.</li>
                    <li>Tratamientos médicos o requerimientos nutricionales especiales.</li>
                </ul>
            </>
        ),
    },
    {
        title: '3. Datos Personales Recabados',
        content: (
            <>
                <p>Para la correcta operación del sistema, recolectamos las siguientes categorías de datos:</p>
                <ul>
                    <li>
                        <strong>De Identificación:</strong> Nombre completo, CURP, acta de nacimiento, fotografía
                        (opcional para expediente).
                    </li>
                    <li>
                        <strong>De Contacto:</strong> Dirección, teléfonos de emergencia, correo electrónico de los
                        padres o tutores legales.
                    </li>
                    <li>
                        <strong>Académicos:</strong> Grado escolar, historial pedagógico, evaluaciones de progreso,
                        centro de procedencia.
                    </li>
                    <li>
                        <strong>Biométricos:</strong> En caso de que el sistema use huella digital o reconocimiento
                        facial para acceso (especificar si aplica).
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: '4. Finalidades del Tratamiento',
        content: (
            <>
                <p>
                    Los datos personales que recabamos los utilizaremos para las siguientes{' '}
                    <strong>finalidades primarias</strong>, que son necesarias para el servicio solicitado:
                </p>
                <ol>
                    <li>
                        Creación y mantenimiento del <strong>Expediente Digital Único</strong> del alumno.
                    </li>
                    <li>Seguimiento pormenorizado de los planes de intervención educativa.</li>
                    <li>Control de asistencia y reportes de desempeño para los docentes.</li>
                    <li>Gestión de comunicación inmediata con los tutores en situaciones de urgencia.</li>
                    <li>
                        Cumplimiento de las obligaciones administrativas ante la{' '}
                        <strong>Secretaría de Educación de Veracruz (SEV)</strong>.
                    </li>
                </ol>
                <p>
                    Como <strong>finalidad secundaria</strong>, los datos podrían utilizarse de forma{' '}
                    <strong>anonimizada</strong> (sin nombres ni identificación) para la generación de estadísticas
                    académicas y mejora de las herramientas tecnológicas del sistema GICEM.
                </p>
            </>
        ),
    },
    {
        title: '5. Transferencias de Datos',
        content: (
            <>
                <p>
                    Sus datos personales no serán compartidos con terceros ajenos a la institución educativa, salvo en
                    los siguientes casos:
                </p>
                <ul>
                    <li>Cumplimiento de leyes y requerimientos de autoridades educativas (SEP/SEV).</li>
                    <li>Situaciones de emergencia médica donde la vida o salud del alumno esté en riesgo.</li>
                    <li>Cuando exista una orden judicial que así lo requiera.</li>
                </ul>
            </>
        ),
    },
    {
        title: '6. Derechos ARCO y Revocación del Consentimiento',
        content: (
            <>
                <p>
                    Usted tiene derecho a ejercer sus derechos de{' '}
                    <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong>.
                </p>
                <ul>
                    <li>
                        <strong>Acceso:</strong> Saber qué datos tenemos.
                    </li>
                    <li>
                        <strong>Rectificación:</strong> Corregir datos inexactos.
                    </li>
                    <li>
                        <strong>Cancelación:</strong> Solicitar la eliminación de datos de nuestra base (siempre que no
                        sean necesarios por ley educativa).
                    </li>
                    <li>
                        <strong>Oposición:</strong> Oponerse al uso de sus datos para fines específicos.
                    </li>
                </ul>
                <p>
                    Para ejercer estos derechos, el titular o su representante legal deberá enviar una solicitud al
                    correo mencionado en el punto 1, adjuntando identificación oficial y una descripción clara de su
                    petición.
                </p>
            </>
        ),
    },
    {
        title: '7. Seguridad y Resguardo de la Información',
        content: (
            <p>
                En <strong>GICEM</strong> implementamos medidas de seguridad administrativas (políticas de uso),
                técnicas (cifrado de datos en tránsito y en reposo) y físicas para evitar el robo, pérdida o acceso no
                autorizado. El acceso al sistema está restringido por <strong>roles de usuario</strong>, asegurando que
                un docente solo vea la información de sus alumnos asignados.
            </p>
        ),
    },
    {
        title: '8. Consentimiento de los Padres o Tutores',
        content: (
            <>
                <p>
                    Al ser un sistema enfocado en gran medida a menores de edad, el tratamiento de sus datos requiere
                    que el padre, madre o tutor legal firme el consentimiento expreso.
                </p>
                <p className="mt-3 rounded-lg border-l-[3px] border-l-golden bg-golden/5 px-4 py-3 text-sm italic text-foreground">
                    Al ingresar y registrar datos en GICEM, usted manifiesta que es el tutor legal y que otorga su
                    consentimiento para el tratamiento de los datos sensibles aquí descritos.
                </p>
            </>
        ),
    },
];

export default function Privacy() {
    return (
        <>
            <Head title="Aviso de Privacidad" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b border-border bg-card shadow-sm">
                    <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <AppLogo className="size-10" />
                            <div>
                                <p className="text-base leading-tight font-bold tracking-wide text-primary">GICEM</p>
                                <p className="text-[9px] font-semibold tracking-[0.18em] text-golden">
                                    EXPEDIENTES DIGITALES
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-3.5" />
                            VOLVER
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="mx-auto max-w-4xl px-6 py-10">
                    {/* Title */}
                    <div className="mb-10 border-b border-border pb-8">
                        <div className="flex items-center gap-3 text-primary">
                            <Shield className="size-8" strokeWidth={1.5} />
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Aviso de Privacidad Integral
                                </h1>
                                <p className="mt-0.5 text-[10px] font-bold tracking-[0.15em] text-golden">
                                    SISTEMA GICEM &mdash; GESTIÓN INTEGRAL PARA CENTROS DE EDUCACIÓN MÚLTIPLE
                                </p>
                            </div>
                        </div>
                        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                            El presente documento constituye el Aviso de Privacidad para los usuarios, padres, tutores y
                            personal administrativo del sistema{' '}
                            <strong className="text-foreground">
                                GICEM (Gestión Integral para Centros de Educación Múltiple)
                            </strong>
                            , en cumplimiento con la normativa mexicana vigente.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            <strong className="text-foreground">Última actualización:</strong> Marzo 2026
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                        {sections.map((section) => (
                            <article key={section.title}>
                                <h2 className="mb-3 flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
                                    <span className="inline-block h-5 w-1 rounded-full bg-primary" />
                                    {section.title}
                                </h2>
                                <div className="prose-custom pl-3 text-sm leading-relaxed text-muted-foreground [&_li]:mt-1.5 [&_li]:pl-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p+p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                                    {section.content}
                                </div>
                            </article>
                        ))}
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-10 border-t border-border bg-card">
                    <div className="mx-auto max-w-4xl px-6 py-6">
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <p className="text-xs text-muted-foreground">
                                &copy; 2026 GICEM &mdash; Todos los derechos reservados.
                            </p>
                            <div className="flex items-center gap-3 text-[10px]">
                                <span className="font-semibold tracking-wider text-primary">AVISO DE PRIVACIDAD</span>
                                <span className="text-muted-foreground/40">&bull;</span>
                                <Link
                                    href="/terminos-y-condiciones"
                                    className="font-semibold tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    TÉRMINOS Y CONDICIONES
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

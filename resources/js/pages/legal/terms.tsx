import { AppLogo } from '@/components/ux/app-logo';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Scale } from 'lucide-react';

const sections = [
    {
        title: '1. Objeto del Sistema',
        content: (
            <p>
                <strong>GICEM</strong> es una herramienta tecnológica diseñada exclusivamente para la digitalización,
                organización y seguimiento pedagógico de los alumnos inscritos en los Centros de Atención Múltiple. Su
                uso está limitado estrictamente a fines educativos y administrativos internos de la institución.
            </p>
        ),
    },
    {
        title: '2. Confidencialidad y Secreto Profesional',
        content: (
            <>
                <p>
                    Debido a que el sistema contiene <strong>Datos Personales Sensibles</strong> (diagnósticos médicos,
                    discapacidades y datos de menores), El Usuario se compromete a:
                </p>
                <ul>
                    <li>Mantener estricta confidencialidad sobre la información visualizada en el sistema.</li>
                    <li>
                        No difundir, capturar pantalla, fotografiar ni distribuir datos de alumnos a través de medios no
                        oficiales (WhatsApp, redes sociales, correos personales).
                    </li>
                    <li>
                        Utilizar la información únicamente para la elaboración de planes de intervención y reportes
                        oficiales.
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: '3. Seguridad de las Cuentas de Acceso',
        content: (
            <ul>
                <li>
                    <strong>Intransferibilidad:</strong> Las credenciales de acceso (usuario y contraseña) son personales
                    e intransferibles. Queda estrictamente prohibido compartir claves entre docentes o personal de apoyo.
                </li>
                <li>
                    <strong>Cierre de Sesión:</strong> El Usuario es responsable de cerrar su sesión cada vez que se
                    retire del equipo de cómputo para evitar el acceso de personas no autorizadas.
                </li>
                <li>
                    <strong>Reporte de Incidentes:</strong> Cualquier sospecha de vulneración de su cuenta o del sistema
                    debe ser reportada de inmediato al administrador de GICEM.
                </li>
            </ul>
        ),
    },
    {
        title: '4. Uso Correcto de la Plataforma',
        content: (
            <>
                <p>El Usuario se obliga a no:</p>
                <ul>
                    <li>Alterar, modificar o intentar vulnerar la estructura de la base de datos de GICEM.</li>
                    <li>
                        Utilizar el sistema para fines distintos a los pedagógicos (uso personal, comercial o político).
                    </li>
                    <li>
                        Introducir información falsa, ofensiva o que atente contra la dignidad de los alumnos y sus
                        familias.
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: '5. Propiedad Intelectual',
        content: (
            <p>
                El software <strong>GICEM</strong>, su código fuente, diseño, logotipos y arquitectura son propiedad
                intelectual de <strong>Konekia / Desarrolladores de GICEM</strong>. Su uso en el CAM se otorga bajo una
                licencia de uso institucional, no implicando la transferencia de derechos de autor al personal docente.
            </p>
        ),
    },
    {
        title: '6. Responsabilidad Limitada',
        content: (
            <>
                <p>El desarrollador de GICEM no se hace responsable por:</p>
                <ul>
                    <li>El mal uso que El Usuario haga de la información extraída del sistema.</li>
                    <li>
                        Pérdida de datos derivada de negligencia del Usuario (ej. dejar sesiones abiertas o compartir
                        contraseñas).
                    </li>
                    <li>
                        Interrupciones en el servicio por fallas en el suministro eléctrico o de internet del centro
                        educativo.
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: '7. Sanciones por Incumplimiento',
        content: (
            <>
                <p>
                    El incumplimiento de estos términos, especialmente en lo referente a la filtración de datos sensibles
                    de menores de edad, podrá dar lugar a:
                </p>
                <ol>
                    <li>La suspensión inmediata de los privilegios de acceso al sistema.</li>
                    <li>
                        Notificación a la dirección del plantel y a las autoridades educativas correspondientes (SEV).
                    </li>
                    <li>
                        Responsabilidades legales administrativas o penales conforme a la{' '}
                        <strong>
                            Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados
                        </strong>
                        .
                    </li>
                </ol>
            </>
        ),
    },
];

export default function Terms() {
    return (
        <>
            <Head title="Términos y Condiciones" />

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
                            <Scale className="size-8" strokeWidth={1.5} />
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Términos y Condiciones de Uso
                                </h1>
                                <p className="mt-0.5 text-[10px] font-bold tracking-[0.15em] text-golden">
                                    SISTEMA GICEM &mdash; GESTIÓN INTEGRAL PARA CENTROS DE EDUCACIÓN MÚLTIPLE
                                </p>
                            </div>
                        </div>
                        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                            El presente documento establece los términos y condiciones bajo los cuales el personal
                            autorizado (en adelante &ldquo;El Usuario&rdquo;) podrá acceder y utilizar el sistema{' '}
                            <strong className="text-foreground">
                                GICEM (Gestión Integral para Centros de Educación Múltiple)
                            </strong>
                            . El acceso al sistema implica la aceptación total y sin reservas de estas cláusulas.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            <strong className="text-foreground">Dirigido a:</strong> Personal Docente, Administrativo y
                            Directivo.
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
                                <div className="pl-3 text-sm leading-relaxed text-muted-foreground [&_li]:mt-1.5 [&_li]:pl-1 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p+p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
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
                                <Link
                                    href="/aviso-de-privacidad"
                                    className="font-semibold tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    AVISO DE PRIVACIDAD
                                </Link>
                                <span className="text-muted-foreground/40">&bull;</span>
                                <span className="font-semibold tracking-wider text-primary">
                                    TÉRMINOS Y CONDICIONES
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

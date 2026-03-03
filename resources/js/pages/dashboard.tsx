import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, GraduationCap, ClipboardList, UsersRound } from 'lucide-react';
import { type ReactNode } from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

const modules = [
    {
        icon: GraduationCap,
        category: 'EXPEDIENTE DIGITAL',
        title: 'Padrón de Alumnos',
        description:
            'Registro completo de datos médicos, tipo de discapacidad, valoración psicopedagógica y contactos.',
        href: '/students',
    },
    {
        icon: ClipboardList,
        category: 'ASIGNACIÓN ACADÉMICA',
        title: 'Grupos Escolares',
        description:
            'Apertura de grupos, vinculación de alumnos con grados específicos y control de capacidad del aula.',
        href: '#',
    },
    {
        icon: UsersRound,
        category: 'GESTIÓN DE USUARIOS',
        title: 'Personal Docente',
        description:
            'Administración de plantilla de maestros y especialistas, creación de cuentas y control de accesos.',
        href: '#',
    },
];

function Dashboard() {
    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
    const user = auth.user;

    return (
        <>
            <Head title="Escritorio GICEM" />

            {/* ── Welcome Banner ── */}
            <Card className="mb-8 border-l-4 border-l-primary shadow-sm">
                <CardContent className="flex flex-col gap-6 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                            Bienvenid@, {user.name}
                        </h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Panel de Control del Sistema GICEM
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-affirmative">Activo</p>
                            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.14em] text-muted-foreground">
                                ESTATUS DEL SISTEMA
                            </p>
                        </div>
                        <Separator orientation="vertical" className="hidden h-10 sm:block" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-muted-foreground/40">2026-A</p>
                            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.14em] text-muted-foreground">
                                CICLO ESCOLAR
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Module Cards ── */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {modules.map((mod) => (
                    <Card
                        key={mod.title}
                        className="flex flex-col border-t-[3px] border-t-primary shadow-sm transition-shadow hover:shadow-md"
                    >
                        <CardContent className="flex grow flex-col px-6 pt-6 pb-5">
                            {/* Icon + Badge */}
                            <div className="flex items-start justify-between">
                                <div className="flex size-14 items-center justify-center rounded-xl bg-primary shadow">
                                    <mod.icon className="size-7 text-primary-foreground" strokeWidth={1.5} />
                                </div>
                                <Badge
                                    variant="outline"
                                    className="gap-1.5 border-affirmative/30 bg-affirmative/8 py-1 pr-3 pl-2.5 text-[10px] font-semibold tracking-wider text-affirmative"
                                >
                                    <span className="size-1.5 rounded-full bg-affirmative" />
                                    OPERATIVO
                                </Badge>
                            </div>

                            {/* Category */}
                            <p className="mt-5 text-[10px] font-bold tracking-[0.14em] text-golden">
                                {mod.category}
                            </p>

                            {/* Title */}
                            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-card-foreground">
                                {mod.title}
                            </h2>

                            {/* Description */}
                            <p className="mt-2.5 grow text-sm leading-relaxed text-muted-foreground">
                                {mod.description}
                            </p>

                            {/* Action */}
                            <Button className="mt-6 h-11 w-full gap-2 text-xs font-semibold tracking-[0.1em]" asChild>
                                <Link href={mod.href}>
                                    INGRESAR AL MÓDULO
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default Dashboard;

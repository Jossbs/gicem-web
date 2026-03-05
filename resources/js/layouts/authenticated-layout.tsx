import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLogo } from '@/components/ux/app-logo';
import { CubePatternBg } from '@/components/ux/cube-pattern-bg';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

const navLinks = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Alumnos', href: '/students' },
    { label: 'Grupos', href: '/groups' },
    { label: 'Personal', href: '/staff' },
    { label: 'Tutores', href: '/guardians' },
];

function getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
}

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
    const user = auth.user;
    const currentPath = usePage().url;

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* ── Navbar (blanco) ── */}
            <header className="border-b border-border bg-card shadow-sm">
                <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
                    {/* Logo + Brand */}
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <AppLogo className="size-11" />
                        <div className="hidden sm:block">
                            <p className="text-base leading-tight font-bold tracking-wide text-primary">
                                GICEM
                            </p>
                            <p className="text-[9px] font-semibold tracking-[0.18em] text-golden">
                                EXPEDIENTES DIGITALES
                            </p>
                        </div>
                    </Link>

                    {/* Center nav links */}
                    <div className="hidden items-center md:flex">
                        {navLinks.map((link) => {
                            const isActive = currentPath.startsWith(link.href) && link.href !== '#';
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative px-4 py-5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute inset-x-2 bottom-0 h-[2.5px] rounded-t-full bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-muted focus:outline-none">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm leading-tight font-semibold text-foreground">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-semibold tracking-[0.1em] text-primary">
                                    ADMINISTRADOR
                                </p>
                            </div>
                            <Avatar size="lg">
                                <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <LogOut className="size-4" />
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile nav */}
                <div className="border-t border-border md:hidden">
                    <div className="mx-auto flex max-w-6xl items-center overflow-x-auto px-6">
                        {navLinks.map((link) => {
                            const isActive = currentPath.startsWith(link.href) && link.href !== '#';
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative shrink-0 px-4 py-2.5 text-xs font-medium ${
                                        isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute inset-x-1 bottom-0 h-0.5 bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="relative grow">
                <CubePatternBg />
                <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">{children}</div>
            </main>

            {/* ── Footer (guinda / primary) ── */}
            <footer className="bg-primary dark:bg-[oklch(0.18_0.03_9.01)]">
                <div className="mx-auto max-w-6xl px-6 py-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none">
                                <AppLogo className="size-9" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-bold tracking-wide text-primary-foreground">
                                        GICEM
                                    </span>
                                    <span className="rounded bg-primary-foreground/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-primary-foreground/80">
                                        V 1.0
                                    </span>
                                </div>
                                <p className="text-[9px] font-medium tracking-[0.12em] text-primary-foreground/40">
                                    GESTIÓN INTEGRAL PARA CENTROS DE EDUCACIÓN MÚLTIPLE
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 md:items-end">
                            <p className="text-xs text-primary-foreground/60">
                                &copy; 2026 Todos los derechos reservados.
                            </p>
                            <div className="flex items-center gap-2 text-[10px]">
                                <a href="#" className="font-semibold tracking-wider text-primary-foreground/50 hover:text-primary-foreground/80">
                                    SOPORTE TÉCNICO
                                </a>
                                <span className="text-primary-foreground/25">&bull;</span>
                                <a href="#" className="font-semibold tracking-wider text-primary-foreground/50 hover:text-primary-foreground/80">
                                    AVISO DE PRIVACIDAD
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

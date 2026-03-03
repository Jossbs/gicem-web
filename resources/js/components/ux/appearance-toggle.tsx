import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';

const modes = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Oscuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' },
] as const;

export function AppearanceToggle() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/50 p-0.5">
            {modes.map(({ value, icon: Icon, label }) => (
                <Button
                    key={value}
                    variant={appearance === value ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateAppearance(value)}
                    title={label}
                >
                    <Icon className="h-3.5 w-3.5" />
                </Button>
            ))}
        </div>
    );
}

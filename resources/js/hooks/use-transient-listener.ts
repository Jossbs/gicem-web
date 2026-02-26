import { usePage } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import { createElement, useEffect } from 'react';
import { toast } from 'sonner';
import { EmphasisDecoration } from '@/decorations/ui/emphasis-decoration';
import EmphasisVariant from '@/wayfinder/App/Enums/Frontend/EmphasisVariant';

export function useTransientListener() {
    const { transient } = usePage().flash;

    useEffect(() => {
        if (transient) {
            switch (transient.variant) {
                case 'affirmative':
                    toast.success(transient.message);
                    break;
                case 'informative':
                    toast.info(transient.message);
                    break;
                case 'preventive':
                    toast.warning(transient.message);
                    break;
                case 'destructive':
                    toast.error(transient.message);
                    break;
                case 'neutral':
                    toast(transient.message, {
                        icon: createElement(EmphasisDecoration[EmphasisVariant.NEUTRAL].icon, { className: 'size-4' }),
                        style: {
                            '--normal-bg': 'var(--neutral-foreground)',
                            '--normal-border': 'var(--neutral)',
                            '--normal-text': 'var(--neutral)',
                        } as CSSProperties,
                    });
                    break;
                case 'interrogative':
                    toast(transient.message, {
                        icon: createElement(EmphasisDecoration[EmphasisVariant.INTERROGATIVE].icon, { className: 'size-4' }),
                        style: {
                            '--normal-bg': 'var(--interrogative-foreground)',
                            '--normal-border': 'var(--interrogative)',
                            '--normal-text': 'var(--interrogative)',
                        } as CSSProperties,
                    });
                    break;
                default:
                    toast(transient.message);
                    break;
            }
        }
    }, [transient]);
}

import type { LucideIcon } from 'lucide-react';
import type { TailwindColor } from '@/types/ui/tailwind-color';
import { App } from '@/wayfinder/types';
import EmphasisVariant = App.Enums.Frontend.EmphasisVariant;

export type Decoration = {
    label: string;
    description: string;
    emphasis: EmphasisVariant;
    color: TailwindColor;
    icon: LucideIcon;
};

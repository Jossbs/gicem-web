import { CircleCheck, CircleHelp, Info, MinusCircle, OctagonX, TriangleAlert } from 'lucide-react';
import type { Decoration } from '@/types/ui/decoration';
import EmphasisVariant from '@/wayfinder/App/Enums/Frontend/EmphasisVariant';
import type { App } from '@/wayfinder/types';

export const EmphasisDecoration: Record<App.Enums.Frontend.EmphasisVariant, Pick<Decoration, 'icon'>> = {
    [EmphasisVariant.NEUTRAL]: { icon: MinusCircle },
    [EmphasisVariant.AFFIRMATIVE]: { icon: CircleCheck },
    [EmphasisVariant.INFORMATIVE]: { icon: Info },
    [EmphasisVariant.PREVENTIVE]: { icon: TriangleAlert },
    [EmphasisVariant.DESTRUCTIVE]: { icon: OctagonX },
    [EmphasisVariant.INTERROGATIVE]: { icon: CircleHelp },
};

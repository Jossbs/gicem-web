import { usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconRenderer } from '@/components/ux/typography/icon-renderer';
import { EmphasisDecoration } from '@/decorations/ui/emphasis-decoration';
import { useDecorator } from '@/hooks/use-decorator';

function ResponseCallout({ ...props }: ComponentProps<'div'>) {
    const { callout } = usePage().flash;
    const decorator = useDecorator(EmphasisDecoration, callout?.variant);

    if (!callout || !decorator) return null;

    const { icon } = decorator;

    return (
        <Alert variant={callout.variant} {...props}>
            <IconRenderer iconNode={icon} />
            <AlertDescription>{callout.message}</AlertDescription>
        </Alert>
    );
}

export { ResponseCallout };

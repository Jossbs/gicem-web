import { Loader2Icon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createElement } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { EmphasisDecoration } from '@/decorations/ui/emphasis-decoration';
import EmphasisVariant from '@/wayfinder/App/Enums/Frontend/EmphasisVariant';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: createElement(EmphasisDecoration[EmphasisVariant.AFFIRMATIVE].icon, { className: 'size-4' }),
        info:createElement(EmphasisDecoration[EmphasisVariant.INFORMATIVE].icon, { className: 'size-4' }),
        warning: createElement(EmphasisDecoration[EmphasisVariant.PREVENTIVE].icon, { className: 'size-4' }),
        error: createElement(EmphasisDecoration[EmphasisVariant.DESTRUCTIVE].icon, { className: 'size-4' }),
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--affirmative-foreground)",
          "--success-border": "var(--affirmative)",
          "--success-text": "var(--affirmative)",
          "--info-bg": "var(--informative-foreground)",
          "--info-border": "var(--informative)",
          "--info-text": "var(--informative)",
          "--warning-bg": "var(--preventive-foreground)",
          "--warning-border": "var(--preventive)",
          "--warning-text": "var(--preventive)",
          "--error-bg": "var(--destructive-foreground)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--destructive)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

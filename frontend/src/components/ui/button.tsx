import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

/*
 * Raad button: 7 variants (Figma page 0 · Button). Values come from the design system canvas.
 * Rules: navy text on yellow only; `danger` is red and only for destructive or SOS actions;
 * `success` is green and only for done/arrived actions.
 * `default` and `destructive` are kept as aliases because shadcn components use those names.
 */
const primary = 'bg-yellow-400 text-navy-900 hover:bg-yellow-300 active:bg-yellow-500';
const danger = 'bg-red-600 text-white hover:bg-red-700';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[12px] border-0 font-body font-semibold leading-none whitespace-nowrap transition-colors duration-(--dur-micro) ease-out outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:bg-sand-200 disabled:text-navy-500 disabled:shadow-none data-disabled:cursor-not-allowed data-disabled:bg-sand-200 data-disabled:text-navy-500 data-disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        primary,
        default: primary,
        secondary: 'bg-navy-900 text-white hover:bg-navy-700',
        outline:
          'bg-transparent text-navy-900 shadow-[inset_0_0_0_1.5px_var(--navy-900)] hover:bg-navy-50 aria-expanded:bg-navy-50',
        ghost: 'bg-transparent px-3 text-blue-700 hover:bg-blue-50 aria-expanded:bg-blue-50',
        danger,
        destructive: danger,
        success: 'bg-green-700 text-white',
        inverse: 'bg-white text-navy-900',
        link: 'h-auto bg-transparent px-0 text-link underline decoration-[1.5px] underline-offset-3 hover:text-blue-700',
      },
      size: {
        default: 'h-12 min-w-12 px-5 text-base',
        xs: "h-7 rounded-[8px] px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 rounded-[10px] px-3.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: 'h-14 rounded-[14px] px-6 text-[17px]',
        xl: "h-18 rounded-[18px] px-7 text-xl font-bold [&_svg:not([class*='size-'])]:size-6",
        icon: 'size-12 p-0',
        'icon-xs': "size-6 rounded-[6px] p-0 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': "size-9 rounded-[10px] p-0 [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': 'size-14 rounded-[14px] p-0',
      },
    },
    compoundVariants: [
      { variant: 'ghost', size: ['icon', 'icon-xs', 'icon-sm', 'icon-lg'], className: 'px-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

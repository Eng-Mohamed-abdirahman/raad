import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from 'cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Raad input (Figma page 0 · Input): 52px, 12px radius, 1.5px strong border, blue focus ring.
        'h-13 w-full min-w-0 rounded-[12px] border-[1.5px] border-strong bg-surface px-4 text-base text-navy-900 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-navy-400 focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-sand-300 disabled:bg-sand-100 disabled:text-navy-500 aria-invalid:border-red-600 aria-invalid:ring-4 aria-invalid:ring-red-100',
        className,
      )}
      {...props}
    />
  );
}

export { Input };

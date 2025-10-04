import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import PropTypes from "prop-types"

import { cn } from "../../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40",
        outline:
          "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-100 dark:border-gray-50 dark:hover:bg-gray-200",
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component with multiple variants and sizes
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant (default, destructive, outline, secondary, ghost, link)
 * @param {string} props.size - Button size (default, sm, lg, icon)
 * @param {boolean} props.asChild - Render as child component using Slot
 * @param {...Object} props - Additional props passed to the button element
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  console.log('Button component rendered with:', { variant, size, asChild, className });
  
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  asChild: PropTypes.bool,
}

Button.defaultProps = {
  className: '',
  variant: 'default',
  size: 'default',
  asChild: false,
}

export { Button, buttonVariants }

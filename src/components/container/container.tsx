import { cn } from "@/utils/tailwind-merge"

type Props = {
	children: React.ReactNode
	className?: string
}


export function Container({ children, className }: Props) {
  return (
    <div className={cn("mx-auto min-h-screen  max-w-[1920px] bg-background text-foreground", className)}>
      {children}
    </div>
  )
}

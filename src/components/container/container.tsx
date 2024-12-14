import { cn } from "@/utils/tailwind-merge"

type Props = {
	children: React.ReactNode
	className?: string
}


export function Container({ children, className }: Props) {
	return (
		<div className={cn("mx-auto max-w-[1920px]", className)}>
			{children}
		</div>
	)
}

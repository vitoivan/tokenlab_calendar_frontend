import { Container } from "@/components/container/container";
import { Calendar } from "lucide-react";
import { LoginForm } from "./login-form";
import { useAuthContext } from "@/context/auth-context/auth-context";
import { Navigate } from "react-router-dom";
import { Routes } from "@/utils/enums";

export function LoginPage() {

	const { isLoggedIn } = useAuthContext()

	if (isLoggedIn) {
		return <Navigate to={Routes.HOME} />
	}

	return (
		<Container>
			<div className="flex justify-between">
				<div className="hidden lg:flex lg:w-[60%] min-h-screen flex-col justify-center items-center text-primary-foreground bg-gradient-to-br from-primary to-primary-light">
					<h1 className="text-4xl tracking-widest font-light mb-[32px]">
						Tokenlab Calendar
						<Calendar size={32} className="inline ml-4" />
					</h1>
					<p className="text-lg tracking-widest text-muted">Create events and share them with your friends</p>
				</div>
				<div className="w-full lg:w-[40%] min-h-screen flex flex-col  justify-center">
					<div className="w-[80%] mx-auto">
						<h2 className="text-3xl tracking-widest font-light mb-8">Sign in</h2>
						<LoginForm />
					</div>
				</div>
			</div>
		</Container>
	)
}

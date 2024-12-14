import { getUserById } from "@/api/requests/users/get-by-id";
import { Container } from "@/components/container/container";
import { Button } from "@/components/ui/button";
import { useAPI } from "@/hooks/useAPI";

export function HomePage() {


	const api = useAPI()

	const submutBtn = async () => {
		const user = await getUserById(api, 1)
		console.log({ user })
	}

	return (
		<Container>
			<div className="">
				thats my home page
			</div>

			<Button onClick={submutBtn}>Click me</Button>
		</Container>
	)
}

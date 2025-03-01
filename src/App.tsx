import { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [dogs, setDogs] = useState([]);

	const auth = async (formData: FormData) => {
		const body = { name: formData.get("name"), email: formData.get("email") };
		await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(body),
		}).then((res) => {
			console.log("Response from login:", res);
			if (res.ok) {
				// Check for cookies in the response
				console.log("Cookies set:", document.cookie);
			} else {
				console.error("Authentication failed:", res.status);
			}
		});
	};

	const data = async () => {
		fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			// setDogs(res.data);
			if (res.status === 200) {
				setLoggedIn(true);
				setDogs(await res.json());
			}
			console.log("dogs", await res.json());
			return res;
		});
	};

	useEffect(() => {
		data();
	}, []);

	if (!loggedIn) {
		return (
			<>
				<div className="h-screen w-screen flex items-center justify-center">
					<form
						action={auth}
						className="border-gray-200 rounded-md border-2 flex flex-col gap-1 p-10 shadow-md"
					>
						<label htmlFor="name" />
						Name
						<input
							className="border-gray-200 rounded-md border-2 p-2"
							name="name"
							type="text"
						></input>
						<label htmlFor="email" />
						Email
						<input
							className="border-gray-200 rounded-md border-2 p-2"
							name="email"
							type="email"
						></input>
						<button
							type="submit"
							className="cursor-pointer p-2 my-4 rounded bg-gray-900/90 transition-all text-white hover:bg-gray-900"
						>
							Submit
						</button>
					</form>
				</div>
			</>
		);
	}

	return (
		<div>
			<ul>
				{dogs.map((breed) => {
					return <li>{breed}</li>;
				})}
			</ul>
		</div>
	);
}

export default App;

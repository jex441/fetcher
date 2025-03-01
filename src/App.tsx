import { useState, useEffect } from "react";
import "./App.css";
import "./index.css"; // Import Tailwind CSS

interface Dog {
	id: string;
	img: string;
	name: string;
	age: number;
	zip_code: string;
	breed: string;
}

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [ids, setIds] = useState<[]>([]);
	const [dogs, setDogs] = useState<Dog[]>([]);
	const [index, setIndex] = useState<number>(0);

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
			if (res.status === 200) {
				setLoggedIn(true);
			} else {
				console.error("Authentication failed:", res.status);
			}
		});
	};

	const getIds = async () => {
		await fetch(
			`https://frontend-take-home-service.fetch.com/dogs/search?from=${index}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then(async (res) => {
			if (res.status === 200) {
				console.log(res);
				setLoggedIn(true);
				const data = await res.json();
				setIds(data.resultIds);
			}
			return res;
		});
	};

	const getDogs = async (ids: []) => {
		await fetch("https://frontend-take-home-service.fetch.com/dogs", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(ids),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				setLoggedIn(true);
				const data = await res.json();
				setDogs(data);
			}
		});
	};
	console.log(index);
	useEffect(() => {
		getIds();
	}, [loggedIn, index]);

	useEffect(() => {
		if (ids.length) {
			getDogs(ids);
		}
	}, [ids]);

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
		<div className="w-full bg-red-100">
			<div className="flex flex-col">
				{dogs.map((dog) => (
					<span key={dog.id}>{dog.name}</span>
				))}
			</div>

			<div className="w-full flex flex-row justify-center items-center gap-10">
				<button
					disabled={index <= 0}
					onClick={() => {
						setIndex(index - 25);
					}}
				>
					Prev
				</button>
				<button
					onClick={() => {
						setIndex(index + 25);
					}}
				>
					Next
				</button>
			</div>
		</div>
	);
}

export default App;

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
	city?: string;
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
			`https://frontend-take-home-service.fetch.com/dogs/search?from=${index}&size=${9}`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then(async (res) => {
			console.log("ids", res);

			if (res.status === 200) {
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
		<div className="w-full">
			<div className="grid grid-cols-3 my-10 justify-start flex-wrap gap-4">
				{dogs.map((dog) => (
					<div
						key={dog.id}
						className="w-full justify-start items-start h-[150px] flex flex-row gap-4 border-2 border-gray-200 rounded-md"
					>
						<div className="w-[200px] flex justify-center relative object-cover h-full">
							<img
								src={dog.img}
								className="h-full w-full object-cover rounded-md"
							/>
						</div>
						<div className="flex m-1 flex-col text-left gap-2">
							<span className="font-semibold text-xl flex items-center">
								{dog.name}
								{dog.age > 0 ? (
									`, ${dog.age}`
								) : (
									<span className="bg-green-100 p-[1px] rounded border-1 border-green-300 text-green-700 rounded md uppercase text-[10px] mx-2">
										puppy
									</span>
								)}
							</span>
							<span className="text-gray-600">{dog.breed}</span>
							<span className="text-gray-600">{dog.city}</span>
						</div>
					</div>
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

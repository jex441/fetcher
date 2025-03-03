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
	const [breeds, setBreeds] = useState<[]>([]);
	const [breed, setBreed] = useState<string>("");
	const [order, setOrder] = useState<string>("breed:asc");
	const [ageMin, setAgeMin] = useState<string>("");
	const [ageMax, setAgeMax] = useState<string>("");
	const [zipCodes, setZipCodes] = useState<string>("");
	const [liked, setLiked] = useState<Dog[]>([]);

	const auth = async (formData: FormData) => {
		// const body = { name: formData.get("name"), email: formData.get("email") };
		const body = { name: "test", email: "test@gmail.com" };

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

	const getIds = async (
		breed: string,
		ageMin: string,
		ageMax: string,
		zipCodes: string
	) => {
		let url = new URL(
			"https://frontend-take-home-service.fetch.com/dogs/search?"
		);
		breed && url.searchParams.append("breeds", breed);
		url.searchParams.append("from", String(index));
		url.searchParams.append("size", "9");
		ageMin && url.searchParams.append("ageMin", ageMin);
		ageMax && url.searchParams.append("ageMax", ageMax);
		zipCodes && url.searchParams.append("zipCodes", zipCodes);
		url.searchParams.append("sort", order);

		await fetch(url, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
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

	const getBreeds = async () => {
		await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
			method: "GET",
			credentials: "include",
			// body: breed,
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json();
				setBreeds(data);
			}
		});
	};

	const getMatch = async () => {
		await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
			method: "GET",
			credentials: "include",
			body: JSON.stringify(liked),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json();
				setBreeds(data);
			}
		});
	};

	useEffect(() => {
		getIds(breed, ageMin, ageMax, zipCodes);
	}, [loggedIn, index, breed, ageMin, ageMax, zipCodes, order]);

	useEffect(() => {
		getBreeds();
	}, [loggedIn]);

	useEffect(() => {
		if (ids.length) {
			getDogs(ids);
		}
	}, [ids]);

	useEffect(() => {
		setIndex(0);
	}, [breed, ageMin, ageMax]);

	const ages = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"20",
	];
	const [likedIds, setLikedIds] = useState<string[]>([]);

	const likeHandler = (dog: Dog) => {
		setLikedIds([...likedIds, dog.id]);
		setLiked([...liked, dog]);
	};

	const unlikeHandler = (rmDog: Dog) => {
		let newLikeIds = likedIds.filter((id) => id !== rmDog.id);
		setLikedIds(newLikeIds);
		let newLiked = liked.filter((dog) => dog.id !== rmDog.id);
		setLiked(newLiked);
	};

	console.log(liked);
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
	} else
		return (
			<div className="w-full">
				{/* Search bar */}
				<div className="w-full p-2 h-[60px] bg-gray-400 flex flex-row items-center justify-between">
					<div>
						<label htmlFor="breed" />
						Breed:
						<select name="breed" onChange={(e) => setBreed(e.target.value)}>
							<option value="" selected>
								All
							</option>
							{breeds.map((breed) => (
								<option key={breed} value={breed}>
									{breed}
								</option>
							))}
						</select>
					</div>
					<div className="">
						<label htmlFor="ageMin" />
						From
						<select onChange={(e) => setAgeMin(e.target.value)}>
							{ages.map((age) => (
								<option key={age} value={age}>
									{age}
								</option>
							))}
						</select>
						to
						<select
							onChange={(e) => setAgeMax(e.target.value)}
							defaultValue={"20"}
						>
							{ages.map((age) => (
								<option key={age} value={age}>
									{age}
								</option>
							))}
						</select>
						years
					</div>
					<div>
						Order results by:
						<select onChange={(e) => setOrder(e.target.value)}>
							<option value="breed:asc">Breed A-Z</option>
							<option value="breed:desc">Breed Z-A</option>
							<option value="name:asc">Name A-Z</option>
							<option value="name:desc">Name Z-A</option>
							<option value="age:asc">Youngest to Oldest</option>
							<option value="age:desc">Oldest to Youngest</option>
						</select>
					</div>
				</div>

				{/* Match Bar */}
				<div className="h-[50px] flex flex-row justify-between">
					<div className="flex items-center flex-row">
						{liked.map((dog) => (
							<img
								onClick={() => {
									unlikeHandler(dog);
								}}
								className="cursor-pointer h-6 w-6 rounded-full"
								src={dog.img}
							/>
						))}
					</div>
					<button
						className="bg-indigo-800 py-1 px-4 text-sm rounded-md m-2 text-white"
						onClick={() => getMatch}
						type="button"
					>
						Get Matched
					</button>
				</div>

				{/* Results */}
				<div className="grid p-4 grid-cols-3 my-10 h-[500px] justify-start flex-wrap gap-4">
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

								{likedIds.includes(dog.id) ? (
									<button
										type="button"
										className="cursor-pointer bg-indigo-800 text-white rounded-full hover:bg-indigo-900 transition-all"
										onClick={() => {
											unlikeHandler(dog);
										}}
									>
										Unlike
									</button>
								) : (
									<button
										type="button"
										className="cursor-pointer bg-indigo-800 text-white rounded-full hover:bg-indigo-900 transition-all"
										onClick={() => {
											likeHandler(dog);
										}}
									>
										Like
									</button>
								)}
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

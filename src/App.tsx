import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import {
	HeartIcon,
	HeartPulse,
	LocateIcon,
	MapPin,
	PinIcon,
	ThumbsUp,
	XCircleIcon,
	XIcon,
} from "lucide-react";

interface Dog {
	id: string;
	img: string;
	name: string;
	age: number;
	zip_code: string;
	breed: string;
	city?: string;
}

interface Match {
	match: string;
}

interface Location {
	zip_code: string;
	latitude: number;
	longitude: number;
	city: string;
	state: string;
	county: string;
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
	const [match, setMatch] = useState<Dog | null>(null);
	const [likedIds, setLikedIds] = useState<string[]>([]);
	const [showModal, setShowModal] = useState<string>("hidden");
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
	];

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
		url.searchParams.append("size", "12");
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
		setShowModal("flex");
		await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(liked),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json();
				setMatch(data.match);
			}
		});
	};

	let [locationData, setLocationData] = useState<Location[]>([]);
	let [locationHashMap, setLocationHashMap] = useState<{
		[key: string]: string;
	}>({});

	const appendCities = async () => {
		let zipCodes = dogs.map((dog) => dog.zip_code);
		await fetch("https://frontend-take-home-service.fetch.com/locations", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(zipCodes),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json();
				setLocationData(data);
				return data;
			}
		});
	};

	useEffect(() => {
		if (!locationData.length) return;
		let table: { [key: string]: string } = {};
		locationData.forEach((location: Location) => {
			if (location !== null) {
				let zip = location.zip_code;
				table[zip] = location.city + ", " + location.state;
			}
		});
		setLocationHashMap({ ...locationHashMap, ...table });
	}, [locationData]);

	console.log("locationHashMap", locationHashMap);

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
		if (dogs.length) {
			appendCities();
		}
	}, [dogs]);

	useEffect(() => {
		setIndex(0);
	}, [breed, ageMin, ageMax]);

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

	const orderHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		setIndex(0);
		setOrder(e.target.value);
	};
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
				<div className="w-full text-sm text-gray-900 px-6 py-2 h-[60px] border-b border-gray-300 flex flex-row items-center justify-between">
					<div>
						<label htmlFor="breed" />
						Breed:
						<select
							className="mx-2"
							name="breed"
							onChange={(e) => setBreed(e.target.value)}
						>
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
						<select
							className="mx-2"
							onChange={(e) => setAgeMin(e.target.value)}
						>
							{ages.map((age) => (
								<option key={age} value={age}>
									{age}
								</option>
							))}
						</select>
						to
						<select
							className="mx-2"
							onChange={(e) => setAgeMax(e.target.value)}
							defaultValue={"14"}
						>
							{ages.map((age) => (
								<option key={age} value={age}>
									{age}
								</option>
							))}
						</select>
						years
					</div>
					<div className="">
						Order results by:
						<select
							className="mx-2"
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
								orderHandler(e)
							}
						>
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
				<div className="h-[50px] z-30 bg-white sticky top-0 flex flex-row justify-between">
					<div className="flex items-center p-2 flex-row">
						{liked.map((dog) => (
							<img
								onClick={() => {
									unlikeHandler(dog);
								}}
								className="border-1 border-green-400 hover:border-red-500 cursor-pointer h-8 w-8 rounded-full"
								src={dog.img}
							/>
						))}
					</div>
					<button
						disabled={likedIds.length < 2}
						className="bg-indigo-800 py-1 px-4 text-sm rounded-md m-2 text-white disabled:bg-gray-400"
						onClick={() => getMatch()}
						type="button"
					>
						Get Matched
					</button>
				</div>

				{/* Results */}
				<div className="grid p-4 grid-cols-4 mb-10 justify-start gap-4">
					{dogs.map((dog) => (
						<div
							onClick={() => {
								likedIds.includes(dog.id)
									? unlikeHandler(dog)
									: likeHandler(dog);
							}}
							key={dog.id}
							style={{
								backgroundImage: `url(${dog.img})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
							}}
							className="cursor-pointer overflow-hidden w-[300px] justify-start items-start h-[400px] flex flex-col gap-4 border-2 border-gray-200 rounded-md"
						>
							<div className="z-20">
								{likedIds.includes(dog.id) ? (
									<HeartIcon
										fill="pink"
										className="m-2 cursor-pointer rounded-md p-1"
										onClick={() => {
											unlikeHandler(dog);
										}}
										color="pink"
										size={28}
									/>
								) : (
									<HeartIcon
										className="m-2 cursor-pointer rounded-md p-1"
										onClick={() => {
											likeHandler(dog);
										}}
										color="pink"
										size={28}
									/>
								)}
							</div>
							<div className="h-[400px] w-[300px] z-10 absolute bg-linear-[180deg,transparent_50%,black_99%]"></div>
							<div className="px-2 flex m-1 z-20 w-full relative flex-col h-full text-white justify-end text-left gap-1">
								<span className="font-semibold text-3xl flex items-center">
									{dog.name}
									{dog.age > 0 ? (
										`, ${dog.age}`
									) : (
										<span className="bg-green-100 p-[1px] rounded border-1 border-green-300 text-green-700 rounded md uppercase text-[10px] mx-2">
											puppy
										</span>
									)}
								</span>
								<div className="w-full flex items-center justify-between">
									<span className="text-indigo-400 font-lg">{dog.breed}</span>
									<span className="text-white font-lg">
										{locationHashMap[dog.zip_code]}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Prev/Next */}
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

				{/* Modal */}
				{match !== null && (
					<div
						className={`${showModal} z-40 top-0 right-0 bottom-0 left-0 flex justify-center items-center h-screen w-screen absolute z-10 bg-black/30`}
					>
						<div className="h-[700px] w-[500px] rounded bg-white">
							<div className="w-full flex justify-end p-2">
								<button type="button" onClick={() => setShowModal("hidden")}>
									<XCircleIcon size={22} color="black" />
								</button>
							</div>

							<div className="w-full justify-center flex-col items-center flex">
								<p className="text-3xl font-bold leading-loose text-indigo-800">
									Congratulations!
								</p>
								<p className="text-gray-600 text-lg">Your new pup is:</p>
							</div>

							<div className="flex my-6 flex-1 flex-col gap-4 text-center items-center justify-center">
								<img
									className="w-[300px] h-[300px] rounded-full"
									src={match.img}
								/>
								<div className="space-y-2">
									<p className="text-3xl font-bold text-indigo-800">
										{match.name}
									</p>
									<p className="text-2xl font-bold text-gray-800">
										{match.breed}
									</p>
									<p className="leading-loose text-gray-500">
										{match.age > 1
											? `${match.age} years old`
											: "less than 1 year old"}
									</p>
									<div className="flex flex-row items-center gap-4 text-gray-500">
										<MapPin size={18} color="blue" />
										{locationHashMap[match.zip_code]}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
}

export default App;

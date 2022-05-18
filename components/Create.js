import { useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";
import { setUserData, storeDispatch } from "contexts";
import { setView } from "contexts/modules/layout";
import { VIEWS } from "consts";

export const Create = () => {
	const [username, setUsername] = useState("");

	const onCeateUsername = () => {
		let userObj = {
			username: username,
			token: "",
			refresh: "",
		}
		storeDispatch(setUserData(userObj));
		storeDispatch(setView(VIEWS.CREATE_PASSWORD))
	}
	return (
		<div className="flex flex-col h-full p-8 relative">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="">
					<button onClick={() => storeDispatch(setView(VIEWS.WELCOME))}>
						<ImArrowLeft2 />
					</button>
				</div>
			</div>
			<div className="text-black text-left">
				<div className="text-2xl text-black">Choose your username</div>
				<div className="mt-4">You'll use this to log in and other LndHubX Wallet users can send you payments to this username.</div>
			</div>
			<div className="text-gray-500">
				<div className="text-left mt-4">
					<div>Username</div>
					<div className="border border-2 rounded-md w-full relative">
						<input
							value={username}
							onInput={e => setUsername(e.target.value)}
							placeholder="Enter your username"
							type="text"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-12"
						/>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => onCeateUsername()}
					className="border-gray-600 border-2 hover:bg-gray-600 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<p>Create</p>
				</button>
			</div>
		</div>
	)
}
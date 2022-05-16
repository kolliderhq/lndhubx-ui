import { useMemo, useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";
import { storeDispatch } from "contexts";
import { setView } from "contexts/modules/layout";
import { VIEWS } from "consts";
import { useAppSelector } from "hooks";
import { registerUser } from "../classes/Auth"

export const CreatePassword = () => {
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(null);

	const [username] = useAppSelector(state => [state.user.data.username])

	const onCreate = async () => {
		if (username !== "") {
			let result = await registerUser({ username, password });
			console.log(result)
		}
	}

	useMemo(() => {
		if (password === repeatPassword) {
			setIsPasswordValid(true)
		} else {
			setIsPasswordValid(false)
		}
	}, [password, repeatPassword])

	return (
		<div className="flex flex-col h-full p-8 relative">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="">
					<button onClick={() => storeDispatch(setView(VIEWS.CREATE))}>
						<ImArrowLeft2 />
					</button>
				</div>
			</div>
			<div className="text-black text-left">
				<div className="text-2xl text-black">Create Password</div>
				<div className="mt-4">Set a password to log in to your wallet on a browser. You cannot use the password to recover your wallet.</div>
			</div>
			<div className="text-gray-500">
				<div className="text-left mt-4">
					<div>Password</div>
					<div className="border border-2 rounded-md w-full relative">
						<input
							value={password}
							onInput={e => setPassword(e.target.value)}
							placeholder="Password"
							type="text"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-12"
						/>
					</div>
				</div>
				<div className="text-left mt-4">
					<div>Repeat Password</div>
					<div className="border border-2 rounded-md w-full relative">
						<input
							value={repeatPassword}
							onInput={e => setRepeatPassword(e.target.value)}
							placeholder="Repeat Password"
							type="text"
							style={{ textAlign: 'left' }}
							className="input-default inline-block w-full border rounded-md border-transparent h-12"
						/>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600">
				<button
					onClick={() => onCreate()}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-2/3 px-5 py-2">
					<p>Create Account</p>
				</button>
			</div>
		</div>
	)
}
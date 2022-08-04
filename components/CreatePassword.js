import { useEffect, useMemo, useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";
import { storeDispatch } from "contexts";
import { setView } from "contexts/modules/layout";
import { VIEWS } from "consts";
import { useAppSelector } from "hooks";
import { registerUser } from "../classes/Auth"

import cn from 'clsx';
import Loader from "./Loader";

export const CreatePassword = () => {
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [username] = useAppSelector(state => [state.user.data.username])

	const onCreate = async () => {
		if (username !== "") {
			setIsLoading(true);
			let result = await registerUser({ username, password });
			setIsLoading(false);
			console.log(result)
		}
	}

	useEffect(() => {
		if (password === repeatPassword) {
			setIsPasswordValid(true)
		} else {
			setIsPasswordValid(false)
		}
	}, [password, repeatPassword])

	return (
		<div className="flex flex-col h-full p-8 relative text-white">
			{
				isLoading ? (
					<div className="text-gray-500 m-auto">
						<Loader/>
						Creating...
					</div>
				) : (
					<>
						<div className="flex flex-row w-full text-4xl">
							<div className="">
								<button onClick={() => storeDispatch(setView(VIEWS.CREATE))}>
									<ImArrowLeft2 />
								</button>
							</div>
						</div>
						<div className="text-left">
							<div className="text-2xl">Create Password</div>
							<div className="mt-4">Set a password to log in to your wallet on a browser. You cannot use the password to recover your wallet.</div>
						</div>
						<div className="text-gray-500">
							<div className="text-left mt-4">
								<div>Password</div>
								<div className="border border-gray-600 rounded-md w-full relative">
									<input
										value={password}
										onInput={e => setPassword(e.target.value)}
										placeholder="Password"
										type="text"
										style={{ textAlign: 'left' }}
										className="input-default inline-block w-full border rounded-md border-transparent h-12 bg-gray-700"
									/>
								</div>
							</div>
							<div className="text-left mt-4">
								<div>Repeat Password</div>
								<div className="border border-gray-600 rounded-md w-full relative">
									<input
										value={repeatPassword}
										onInput={e => setRepeatPassword(e.target.value)}
										placeholder="Repeat Password"
										type="text"
										style={{ textAlign: 'left' }}
										className="input-default inline-block w-full border rounded-md border-transparent h-12 bg-gray-700"
									/>
								</div>
								{
									!isPasswordValid && (
										<div className="text-red-500">Password don't match</div>
									)
								}
							</div>
						</div>
						<div className="absolute inset-x-0 bottom-2 mb-8 text-gray-600 	">
							<button
								disabled={!isPasswordValid}
								onClick={() => onCreate()}
								className={cn("border-gray-600 hover:bg-gray-800 hover:text-white cursor-pointer border rounded-lg w-2/3 px-5 py-2", !isPasswordValid ? 'disabled:opacity-75 hover:bg-white hover:text-gray-700' : 'border-gray-600')}>
								<p>Create Account</p>
							</button>
						</div>
					</>
				)
			}
		</div>
	)
}
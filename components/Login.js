import { VIEWS } from "consts"
import { storeDispatch } from "contexts"
import { setView } from "contexts/modules/layout"
import { useCallback, useState } from "react"
import { ImArrowLeft2 } from "react-icons/im"
import { loginUser } from "classes/Auth"
import Loader from "./Loader"
import { displayToast, TOAST_LEVEL } from "utils/toast"

export const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onLogin = async () => {
		try {
			setIsLoading(true)
			let result = await loginUser({ username, password });
			setIsLoading(false)
		} catch (err) {
			let error = `Error loggin in ${err}`
			displayToast(error, {
				type: 'error',
				level: TOAST_LEVEL.CRITICAL,
			});
			setIsLoading(false)
		}
	}

	const onEnter = useCallback(
		e => {
			if (e.key === 'Enter') onLogin();
		},
		[onLogin]
	);

	return (
		<div className="flex flex-col h-full p-8 relative text-white">
			{
				isLoading ? (
					<div className="m-auto">
						<Loader color="gray" />
						Logging in...
					</div>
				) : (
					<>
						<div className="flex flex-row w-full text-4xl">
							<div className="">
								<button onClick={() => storeDispatch(setView(VIEWS.WELCOME))}>
									<ImArrowLeft2 />
								</button>
							</div>
						</div>
						<div className="text-left">
							<div className="text-2xl">Log In</div>
							<div className="mt-4">Enter your LndHubX username and password to login.</div>
						</div>
						<div className="text-gray-500">

							<div className="text-left mt-4">
								<div>Username</div>
								<div className="border border-1 border-gray-600 rounded-md w-full relative">
									<input
										value={username}
										onInput={e => setUsername(e.target.value)}
										placeholder="Enter your username"
										type="text"
										style={{ textAlign: 'left' }}
										className="input-default inline-block w-full border rounded-md border-transparent h-12 bg-gray-700"
									/>
								</div>
							</div>
							<div className="text-left mt-4">
								<div>Password</div>
								<div className="border border-1 mt-1 rounded-md border-gray-600 w-full relative">
									<input
										value={password}
										onInput={e => setPassword(e.target.value)}
										placeholder="Enter your password"
										onKeyDown={onEnter}
										type="password"
										style={{ textAlign: 'left' }}
										className="input-default inline-block w-full border rounded-md border-transparent h-12 bg-gray-700"
									/>
								</div>
							</div>
						</div>
						<div className="absolute inset-x-0 bottom-2 mb-8">
							<button
								onClick={() => onLogin()}
								className="border-gray-600 border-1 hover:bg-gray-700 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
								<p>Login</p>
							</button>
						</div>
					</>
				)
			}
		</div>
	)
}
import { useAppDispatch, useAppSelector } from 'hooks';
import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { ImArrowLeft2 } from 'react-icons/im';
import { API_NAMES } from 'consts';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getSWROptions } from 'utils/fetchers';
import { auth } from 'classes/Auth';
import { storeDispatch } from 'contexts';

export const Settings = () => {
	const dispatch = useAppDispatch()
	const [userData, apiKey] = useAppSelector(state => [state.user.data, state.connection.apiKey])
	const [username, setUsername] = useState("");

	const { data, isValidating } = useSWR(
		apiKey !== '' ? [API_NAMES.WHOAMI] : undefined,
		getSWROptions(API_NAMES.WHOAMI)
	);

	useEffect(() => {
		if (!data) return
		setUsername(data.username)
	}, [data])

	const onLogout = () => {
		auth.logoutUser()
		// baseUmbrelSocketClient.socketSend(UMBREL_MESSAGE_TYPES.LOGOUT, {}, data => {
		// 	console.log(data)
		// })
	}

	const onCloseUSDAccount = () => {
		// baseUmbrelSocketClient.socketSend(UMBREL_MESSAGE_TYPES.CLOSE_ACCOUNT, {}, data => {
		// 	console.log(data)
		// })
	}

	return (
		<div className="flex flex-col h-full p-8 relative text-white">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="">
					<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
						<ImArrowLeft2 />
					</button>
				</div>
			</div>
			<div className="text-lg">Settings</div>
			<div className="mt-8">
				<button className=" border border-gray-600 text-white rounded-lg w-3/4 py-2 hover:bg-gray-700" onClick={() => auth.logoutUser()}>Logout</button>
			</div>
		</div>
	)
}
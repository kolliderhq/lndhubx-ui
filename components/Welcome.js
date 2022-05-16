import React, { useState } from 'react';
import { BsFillShieldLockFill } from 'react-icons/bs';

import { useAppDispatch, useAppSelector, useSymbolData, useSymbols } from 'hooks';
import { storeDispatch } from 'contexts';
import { setView } from 'contexts/modules/layout';
import { VIEWS } from 'consts';

export const Welcome = ({ }) => {
	const dispatch = useAppDispatch();
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [selectedLogin, setSelectedLogin] = useState('overview');

	const socketState = React.useRef({ fetching: false });

	return (

		<div className="flex flex-col w-full h-full text-gray-600">
			<div className="m-auto">
				<div className="w-full flex justify-center text-center text-4xl">
					<BsFillShieldLockFill />
				</div>
				<div className="flex flex-col items-center">
					<div className="mx-auto max-w-xxxs w-full px-4py-4">
						<p className="text-lg text-center py-5">LndHubX</p>
						<p> To get started create a new wallet or login.</p>
					</div>
				</div>
			</div>

			<div className="w-full flex items-center justify-center">
				<button
					onClick={() => storeDispatch(setView(VIEWS.CREATE))}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-2/3 px-5 py-2">
					<p>Create New Wallet</p>
				</button>
			</div>

			<div className="w-full flex items-center justify-center mt-2 mb-8">
				<button
					onClick={() => storeDispatch(setView(VIEWS.LOGIN))}
					className="border-gray-600 border-2 hover:opacity-80 cursor-pointer border rounded-lg w-2/3 px-5 py-2">
					<p>Login</p>
				</button>
			</div>
		</div>
	);
};
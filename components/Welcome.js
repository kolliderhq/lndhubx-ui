import React, { useState } from 'react';
import { BsFillShieldLockFill } from 'react-icons/bs';

import { useAppDispatch, useAppSelector, useSymbolData, useSymbols } from 'hooks';
import { storeDispatch } from 'contexts';
import { setView } from 'contexts/modules/layout';
import { VIEWS } from 'consts';
import Img from 'react-cool-img';

export const Welcome = ({ }) => {
	const dispatch = useAppDispatch();
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [selectedLogin, setSelectedLogin] = useState('overview');

	const socketState = React.useRef({ fetching: false });

	return (

		<div className="flex flex-col w-full h-full text-gray-600">
			<div className="m-auto">
				<div className="w-full flex flex-col justify-center text-center text-black text-xl">
					<div className="m-auto">
						<Img src="/assets/logos/kollider_icon_gradient.png" className="w-12" />
					</div>
					<div className="mt-2 m-auto">Pay</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="mx-auto max-w-xxxs w-full px-4py-4">
						<p className="text-lg text-center py-5"></p>
						<p> To get started create a new wallet or login.</p>
					</div>
				</div>
			</div>

			<div className="w-full flex items-center justify-center">
				<button
					onClick={() => storeDispatch(setView(VIEWS.CREATE))}
					className="border-gray-600 border-2 hover:bg-gray-600 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<p>Create New Wallet</p>
				</button>
			</div>

			<div className="w-full flex items-center justify-center mt-2 mb-8">
				<button
					onClick={() => storeDispatch(setView(VIEWS.LOGIN))}
					className="border-gray-600 border-2 hover:bg-gray-600 hover:text-white cursor-pointer border rounded-lg w-5/6 px-5 py-3">
					<p>Login</p>
				</button>
			</div>
		</div>
	);
};
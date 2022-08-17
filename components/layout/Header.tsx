import React from 'react';
import { FaCog } from 'react-icons/fa';

import cn from 'clsx';

import { auth } from 'classes/Auth';
import { DIALOGS, USER_TYPE } from 'consts';
import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { useAppDispatch, useAppSelector } from 'hooks';
import Img from 'react-cool-img';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const Header = () => {
	const dispatch = useAppDispatch();
	const [currentDialog, isLoggedIn] = useAppSelector(state => [state.layout.dialog, state.connection.isLoggedIn]);
	
	const history = useRouter();

	return (
		<div className="flex items-center justify-between w-full h-14 pb text-gray-800">
		<Head>
      	<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<figure className="w-full flex items-center justify-start relative cursor-pointer" onClick={() => history.push("/")}>
				{/* <img className="w-30 h-[50px] xs:w-30 xs:h-8" src="/assets/logos/zonic-icon.png" /> */}
				<div className="text-2xl px-2"><Img src="/assets/logos/kollider_logo_gradient_white.png" className="w-32"/></div><div className="mb-4 text-sm font-bold text-white">Pay</div>
			</figure>

			<div className="col-span-2 w-full flex items-center justify-end gap-3 xxs:gap-4">
				<div className="flex h-full border-r border-gray-600">
					<button
						className="m-auto mr-3 transition ease-in-out hover:-translate-y-1 hover:scale-110 text-white"
						onClick={() => {
							history.push("/faq")
						}}>
						FAQ
					</button>
				</div>
				<div className="flex h-full border-r border-gray-600">
					<button
						className="m-auto mr-3 transition ease-in-out hover:-translate-y-1 hover:scale-110 text-white"
						onClick={() => {
							window.open("https://kollider.medium.com/")
						}}>
						Blog
					</button>
				</div>
				<div className="flex h-full border-r">
					<button
						className="m-auto mr-3 transition ease-in-out hover:-translate-y-1 hover:scale-110 text-white"
						onClick={() => {
							window.open("https://pro.kollider.xyz")
						}}>
						Exchange
					</button>
				</div>
				{isLoggedIn && (
					<button
						onClick={() => dispatch(setView(VIEWS.SETTINGS))}
						className={cn(
							{ 'rotate-90': currentDialog === DIALOGS.SETTINGS },
							'min-w-[28px] mr-1 py-2 flex items-center justify-center hover:rotate-90 s-transition-rotate hover:opacity-80'
						)}>
						<FaCog className="text-xl text-gray-400" />
					</button>
				)}
			</div>
		</div>
	);
};

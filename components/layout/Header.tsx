import React from 'react';

import cn from 'clsx';
import Img from 'next/image';

import { auth } from 'classes/Auth';
import { DIALOGS, USER_TYPE } from 'consts';
import { VIEWS } from 'consts';
import { setDialog } from 'contexts/modules/layout';
import { setView } from 'contexts/modules/layout';
import { useAppDispatch, useAppSelector } from 'hooks';
import { weblnConnectAttempt } from 'hooks/init/useWebln';
import { FaCog } from "react-icons/fa";

export const Header = () => {
	const dispatch = useAppDispatch();
	const [currentDialog, loggedIn] = useAppSelector(state => [
		state.layout.dialog,
		state.user.data.token,
	]);

	return (
		<div className="flex items-center justify-between w-full h-14 pb text-gray-800">
			<figure className="w-full flex items-center justify-start relative">
				{/* <img className="w-30 h-[50px] xs:w-30 xs:h-8" src="/assets/logos/zonic-icon.png" /> */}
				<h1 className="text-2xl px-2">LndHubX</h1>
			</figure>
			<div className="col-span-2 w-full flex items-center justify-end gap-3 xxs:gap-4">
				<div className="flex h-full border-r border-gray-800">
					<button
						className="m-auto mr-3 transition ease-in-out hover:-translate-y-1 hover:scale-110"
						onClick={() => {
							dispatch(setView(VIEWS.INFO));
						}}>
						What is LndHubX?
					</button>
				</div>
				<button
					onClick={() => dispatch(setView(VIEWS.SETTINGS))}
					className={cn(
						{ 'rotate-90 s-filter-theme-main': currentDialog === DIALOGS.SETTINGS },
						'min-w-[28px] mr-1 py-2 flex items-center justify-center hover:rotate-90 s-transition-rotate s-filter-theme-main-hover hover:opacity-80'
					)}>
						<FaCog className="text-xl"/>
				</button>
			</div>
		</div>
	);
};
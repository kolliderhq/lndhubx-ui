import React from 'react';
import { BsTelegram } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';

export const Footer = () => {
	return (
		<footer className="w-full h-12 bg-transparent">
			<div className="w-full flex items-center h-8 z-80">
				<div className="grid grid-cols-3 w-full px-4">
					<div className="flex">
						<div></div>
					</div>
					<div className="flex flex-col w-full">
						<a href="https://kollider.xyz" className="mx-auto cursor-pointer">
							<div className="flex flex-col mx-auto">
								<div className="text-gray-400">Powered by </div>
								<div className="mx-auto text-white">
									<a href="https://github.com/kolliderhq/lndhubx">
										Lnd<span className="font-bold">Hub</span>
										<span className="text-purple-500 font-bold">X</span>
									</a>
									{/* <img className="w-15 h-[15px]" src="/assets/logos/kollider_logo_black.png" /> */}
								</div>
							</div>
						</a>
					</div>
					<div className="mr-8 text-2xl flex flex-row m-auto">
						<div className="cursor-pointer" onClick={() => window.open('https://t.me/kolliderhq')}>
							<BsTelegram/>
						</div>
						<div className="ml-4 cursor-pointer" onClick={() => window.open('https://discord.gg/hETW6yDS')}>
							<FaDiscord/>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

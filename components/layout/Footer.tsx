import React from 'react';

export const Footer = () => {
	return (
		<footer className="fixed bottom-0 left-0 w-full h-12 bg-white">
			<div className="w-full flex items-center h-8 z-80">
				<div className="grid grid-cols-3 w-full px-4">
					<div className="flex">
						<div>
						</div>
					</div>
					<div className="flex flex-col w-full">
						<a href="https://kollider.xyz" className="mx-auto cursor-pointer">
						<div className="flex flex-col mx-auto">
							<div className="text-gray-800">Powered by </div>
							<div className="mx-auto">
							<img className="w-15 h-[15px]" src="/assets/logos/kollider_logo_black.png" />
							</div>
						</div>
						</a>
					</div>
					<div></div>
				</div>
			</div>
		</footer>
	);
};
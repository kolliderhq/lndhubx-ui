import { RiDownloadLine, RiExchangeLine, RiSendPlane2Line } from 'react-icons/ri';

import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { useAppDispatch } from 'hooks';

export const MainButtons = () => {
	let dispatch = useAppDispatch();
	return (
		<div className="flex justify-center mt-4 bg-gray-25 w-full h-full rounded-b-2xl text-black">
			<div className="m-auto flex">
				<div className="">
					<button className="mx-2 px-4 py-2 rounded-3xl font-semibold uppercase tracking-wide"
						onClick={() => dispatch(setView(VIEWS.SEND))}>
						<div className="flex">
							Send <RiSendPlane2Line className="text-xl ml-2 m-auto" />
						</div>
					</button>
				</div>
				<div>
					<button className="mx-2 px-4 py-2 rounded-3xl font-semibold uppercase tracking-wide"
						onClick={() => dispatch(setView(VIEWS.RECEIVE))}>
						<div className="flex">
							Receive <RiDownloadLine className="text-xl ml-2 m-auto" />
						</div>
					</button>
				</div>
				<div>
					<button
						className="mx-2 px-4 py-2 rounded-3xl font-semibold uppercase tracking-wide"
						onClick={() => dispatch(setView(VIEWS.CONVERT))}>
						<div className="flex">
							Swap <RiExchangeLine className="text-xl ml-2 m-auto" />
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

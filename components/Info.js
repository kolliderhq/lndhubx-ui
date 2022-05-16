import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { ImArrowLeft2 } from 'react-icons/im';
import { storeDispatch } from 'contexts';

export const Info = () => {
	return (
		<div className="flex flex-col h-full p-8 relative text-black">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="">
					<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
						<ImArrowLeft2 />
					</button>
				</div>
			</div>
			<div className="text-lg">What is Lndhubx</div>
			<div className="flex flex-col text-gray-600 text-left">
				<div className="mt-5">
					<p>Lndhubx allows you to create a synthetic USD account with you lightning Bitcoin.</p>
				</div>
				<div className="mt-5 font-bold text-lg text-gray-800">What's a synthetic USD account?</div>
				<p className="text-sm">A synthetic USD account is a short Bitcoin position against the USD dollar, that is settled in Bitcoin.</p>
				<p className="text-sm mt-2">You cannot spend USD directly. When you send funds the payment will be settled in Bitcoin. However if you send USD through 
				the UI your synthetic USD will be converted back into Bitcoin at the time of payment.</p>
				<div className="mt-5 font-bold text-lg text-gray-800">What LndhubX isn't</div>
				<div>
					<ul class="list-disc px-4 text-sm">
						<li>USD balance on Lndhubx is not non-custodial. However, the Bitcoin balance is.</li>
						<li>It is <span className="font-bold">not</span> a stablecoin.</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
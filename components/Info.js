import { useAppDispatch } from 'hooks';
import { TABS } from 'consts';
import { setTab } from 'contexts/modules/layout';
import { ImArrowLeft2 } from 'react-icons/im';

export const Info = () => {
	const dispatch = useAppDispatch()
	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="absolute">
					<button onClick={() => dispatch(setTab(TABS.OVERVIEW))}>
						<ImArrowLeft2 />
					</button>
				</div>
				<div className="text-lg mx-auto">What is Zonic</div>
			</div>
			<div className="flex flex-col text-gray-600 text-left">
				<div className="mt-5">
					<p>Zonic allows you to create a synthetic USD account with you lightning Bitcoin.</p>
				</div>
				<div className="mt-5 font-bold text-lg text-gray-800">What's a synthetic USD account?</div>
				<p className="text-sm">A synthetic USD account is a short Bitcoin position against the USD dollar, that is settled in Bitcoin.</p>
				<p className="text-sm mt-2">You cannot spend USD directly. When you send funds the payment will be settled in Bitcoin. However if you send USD through 
				the UI your synthetic USD will be converted back into Bitcoin at the time of payment.</p>
				<div className="mt-5 font-bold text-lg text-gray-800">What Zonic isn't</div>
				<div>
					<ul class="list-disc px-4 text-sm">
						<li>USD balance on Zonic is not non-custodial. However, the Bitcoin balance is.</li>
						<li>It is <span className="font-bold">not</span> a stablecoin.</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
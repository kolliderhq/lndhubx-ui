import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { ImArrowLeft2 } from 'react-icons/im';
import { storeDispatch } from 'contexts';
import { useAppSelector } from 'hooks';

export const Info = () => {
	const [isLoggedIn] = useAppSelector(state => [state.connection.isLoggedIn]);
	const onBack = () => {
		if (isLoggedIn) {
			storeDispatch(setView(VIEWS.OVERVIEW))
		} else {
			storeDispatch(setView(VIEWS.WELCOME))
		}
	}
	return (
		<div className="flex flex-col h-full p-8 relative text-black">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="">
					<button onClick={() => onBack()}>
						<ImArrowLeft2 />
					</button>
				</div>
			</div>
			<div className="text-lg">What is Kollider Pay</div>
			<div className="flex flex-col text-gray-600 text-left">
				<div className="mt-5">
					<p>Kollider Pay allows you to create a synthetic fiat currency account with you lightning Bitcoin.</p>
				</div>
				<div className="mt-5 font-bold text-lg text-gray-800">What's a synthetic USD account?</div>
				<p className="text-sm">A synthetic USD account is a short Bitcoin position against the USD dollar, that is settled in Bitcoin.</p>
				<p className="text-sm mt-2">You cannot spend USD directly. When you send funds the payment will be settled in Bitcoin. However if you send USD through
					the UI your synthetic USD will be converted back into Bitcoin at the time of payment.</p>
				<div className="mt-5 font-bold text-lg text-gray-800">What LndhubX isn't</div>
				<div>
					<ul class="list-disc px-4 text-sm">
						<li>Fiat & BTC balances on Kollider Pay are custodial unless you're selfhosting a <a href="https://github.com/kolliderhq/lndhubx" className="text-purple-600">LndHubX</a> instance. In this case only fiat balances are custodial.</li>
						<li>It is <span className="font-bold">not</span> a stablecoin. Your Bitcoin is merely hedged against the fiat price which means that the fiat value of your Bitcoin stays the same.</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
import { TABS } from 'consts';
import { setTab } from 'contexts/modules/layout';
import { useAppDispatch } from 'hooks';
import { useState } from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import { QrCode } from './QrCode';
// import { baseUmbrelSocketClient } from 'classes/UmbrelSocketClient';
import { UMBREL_MESSAGE_TYPES } from 'consts';
import Loader from './Loader';

export const ReceivePayment = () => {
	let dispatch = useAppDispatch();
	let [amount, setAmount] = useState(0)
	let [inputIsValid, setInputIsValid] = useState(true)
	let [selectedCurrency, setSelectedCurrency] = useState("Sats")
	let [invoice, setInvoice] = useState("")
	let [isLoading, setIsLoading] = useState(false)

	const onCreateInvoice = () => {
		let amountInSats = parseInt(amount)
		setIsLoading(true)
		// baseUmbrelSocketClient.socketSend(UMBREL_MESSAGE_TYPES.CREATE_INVOICE, { amountInSats, memo: "" }, data => {
		// 	console.log(data)
		// 	setInvoice(data.data.invoice)
		// 	setIsLoading(false)
		// })
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex flex-row w-full text-4xl text-gray-600">
				<div className="absolute">
					<button onClick={() => dispatch(setTab(TABS.OVERVIEW))}>
						<ImArrowLeft2 />
					</button>
				</div>
				<div className="text-lg mx-auto">Receive Payment</div>
			</div>
			<div className="flex flex-col h-full mt-8">
				<div className="text-left text-gray-600">Choose amount</div>
				<div className="flex rounded-md border-2 border-gray-300 focus:border-gray-300 hover:border-gray-300 mt-2 p-2 text-gray-600">
					<input
						// onFocus={() => console.log('}
						className="input-default inline-block w-full h-12 text-2xl"
						type="number"
						onInput={e => setAmount(e.target.value)}
					// value={}
					/>
					<div className="m-auto text-2xl border-l-2 pl-2 text-gray-600"> {selectedCurrency} </div>
				</div>
				<div className="text-red-500">
					{!inputIsValid && <p className="text-sm">Input must be an integer.</p>}
				</div>

				<div className="mx-auto mt-6 h-full">
					{
						isLoading && (
							<Loader color={"#7372f7"}/>
						)
					}
					{
						invoice && !isLoading && (
							<div className="border-white border-8 mt-2 rounded-lg">
								<div className="border-black border-4 s-qrWrapper">
									<div className="border-white border-8">
										<QrCode autoClick={false} wrapperClass="" size={260} value={invoice} />
									</div>
								</div>
							</div>
						)
					}
				</div>
			</div>
			<div className="">
				<button className="w-48 py-3 px-3 bg-theme-main rounded-lg" onClick={() => onCreateInvoice()}>
					Create Invoice
				</button>
			</div>
		</div>
	);
};

import { MdClose} from 'react-icons/md';

import { VIEWS } from 'consts';
import { setView } from 'contexts/modules/layout';
import { useAppDispatch } from 'hooks';
import { storeDispatch } from 'contexts';
import ligtningPayReq from 'bolt11';
import { useEffect, useState } from 'react';
// import { baseUmbrelSocketClient } from 'classes/UmbrelSocketClient';
import Loader from './Loader';
import { displayToast, TOAST_LEVEL } from 'utils/toast';

export const SendPayment = () => {
	let dispatch = useAppDispatch();

	const [invoice, setInvoice] = useState("");
	const [decodedInvoice, setDecodedInvoice] = useState(null)
	const [amount, setAmount] = useState("")
	const [expiry, setExpiry] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const onPayInvoice = () => {
		{
			if (!invoice) return
			setIsLoading(true)
			// baseUmbrelSocketClient.socketSend(UMBREL_MESSAGE_TYPES.SEND_PAYMENT, { paymentRequest: invoice }, data => {
			// 	setIsLoading(false)
			// 	dispatch(setTab(TABS.OVERVIEW))
			// 	displayToast('Payment Sent.', {
			// 		type: 'success',
			// 		level: TOAST_LEVEL.INFO,
			// 	});
			// });
		}
	}

	useEffect(() => {
		if (!invoice) return
		try {
			let decoded = ligtningPayReq.decode(invoice)
			console.log(decoded)
			setDecodedInvoice(decoded)
			setAmount((decoded.millisatoshis / 1000).toString())
			let time = new Date(decoded.timeExpireDate)
			setExpiry(time.toUTCString())
		} catch (err) {
			setDecodedInvoice(null)
			setAmount("")
			setExpiry("")
		}
	}, [invoice, amount, expiry])

	return (
		<div className="flex flex-col h-full p-8 relative text-black">
			<div className="relative w-full">
				<div className="absolute top-0 right-0 h-16 w-16 text-4xl text-gray-600">
					<div>
						<button onClick={() => storeDispatch(setView(VIEWS.OVERVIEW))}>
							<MdClose />
						</button>
					</div>
				</div>
			</div>
			<div className="text-xl mt-8">Send Payment</div>
		</div>
	);
};

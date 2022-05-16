import { useEffect, useState } from 'react';
import { BsArrowRightShort } from 'react-icons/bs';
import { RiBitCoinFill } from 'react-icons/ri';

import useSWR from 'swr';

import { API_NAMES, UMBREL_MESSAGE_TYPES } from 'consts';
import { useAppSelector } from 'hooks';
import { getSWROptions } from 'utils/fetchers';
import { roundDecimal } from 'utils/format';

import Loader from './Loader';

const WALLET_TO_TRADE_SIDE = {
	BTC: "Bid",
	USD: "Ask"
}

export const TxTable = () => {
	const [selectedWallet] = useAppSelector(state => [state.layout.selectedWallet]);
	const [rows, setRows] = useState([]);
	const [tableHasLoaded, setTableHasLoaded] = useState(false);

	useEffect(() => {
		// baseUmbrelSocketClient.socketSend(UMBREL_MESSAGE_TYPES.GET_HISTORICAL_TRADES, {}, data => {
		// 	let newRows = []
		// 	data.data.map(value => {
		// 		if (value.symbol === 'BTCUSD.PERP') {
		// 			newRows.push(value);
		// 		}
		// 	});
		// 	setTableHasLoaded(true)
		// 	setRows(newRows);
		// })
	}, [selectedWallet])

	return (
		<div className="mt-6 h-72 overflow-auto m-auto">
			{!tableHasLoaded ? (
				<div className="m-auto h-full w-full">
					<Loader color={'black'} text={'Processing'} />
				</div>
			) : (
				<table className="text-black w-full table-fixed">
					<thead className="sticky top-0 border-b border-b-4 border-gray-50 text-gray-400 text-left bg-white">
						<tr className="">
							<th className="">Action</th>
							<th className="">Price ($)</th>
							<th className="">Amount {selectedWallet === "BTC" ? "sats" : "$"}</th>
						</tr>
					</thead>

					<tbody className="text-left text-gray-500">
						<>
							{rows.map(row => (
								<tr className="border-b border-gray-50 h-10" key={row.order_id}>
									<td className="flex flex-row h-full">
										{
											row.side === "Bid" ? (
												<div className="flex my-auto h-full mt-2">
													<div className="my-auto">🇺🇸</div>
													<div className="my-auto">
														<BsArrowRightShort />
													</div>
													<div className="my-auto">
														<RiBitCoinFill className="text-yellow-600" />
													</div>
												</div>
											) : (
												<div className="flex my-auto h-full mt-2">
													<div className="my-auto">
														<RiBitCoinFill className="text-yellow-600" />
													</div>
													<div className="my-auto">
														<BsArrowRightShort />
													</div>
													<div className="my-auto">🇺🇸</div>
												</div>
											)
										}
									</td>
									<td>{row.price}</td>
									{
										selectedWallet === "BTC" ? (
											<>
												{
													row.side === "Bid" ? (
														<td className="text-green-400">+ {roundDecimal((1 / row.price) * row.quantity * 100000000, 0)}</td>
													) : (
														<td className="text-red-400">- {roundDecimal((1 / row.price) * row.quantity * 100000000, 0)}</td>
													)
												}
											</>
										) :
											<>
												{
													row.side === "Ask" ? (
														<td className="text-green-400">+ ${row.quantity}</td>
													) : (
														<td className="text-red-400">- ${row.quantity}</td>
													)
												}
											</>
									}
								</tr>
							))}
						</>
					</tbody>
				</table>
			)}
		</div>
	);
};

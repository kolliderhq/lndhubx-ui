import { useState } from "react"
import Img from "react-cool-img";
import { MdBolt, MdOutlineSyncAlt, MdLock } from "react-icons/md";
import { postRequest } from "utils/api";
import { API_NAMES } from "consts";
import { displayToast, TOAST_LEVEL } from "utils/toast";

export const Landing = () => {
	return (
		<div className="h-full bg-white w-full">
			<div className="h-full">
				<div className="">
					<Hero />
				</div>
				<div className="">
					<About />
				</div>
			</div>
		</div>
	)
}

const Hero = () => {
	const [email, setEmail] = useState("");
	const onPresignup = async () => {
		if (!email) return
		try {
			const res = await postRequest(API_NAMES.PRESIGNUP, [], { email: email });
			displayToast('Early Access Registered!', {
				type: 'success',
				level: TOAST_LEVEL.CRITICAL,
				toastId: 'copy-invoice',
			});
		} catch (err) {
			console.log(err)
			displayToast('Error Registering', {
				type: 'error',
				level: TOAST_LEVEL.CRITICAL,
				toastId: 'copy-invoice',
			});

		}

	}
	return (
		<div className="lg:grid lg:grid-cols-2 flex flex-col text-black bg-white">
			<div className="flex flex-col h-full">
				<div className="m-auto lg:w-1/2 w-96 ">
					<div className="text-4xl font-bold">
						Protect your Bitcoin from price drops
					</div>
					<div className="mt-8">
						The Lightning wallet that lets you peg your Bitcoin balance to fiat currency.
					</div>
					<div className="mt-8">
						<div className="flex flex-row">
							<div className="w-3/4 border rounded-l-lg">
								<input
									value={email}
									onInput={e => setEmail(e.target.value)}
									placeholder="Your Email"
									type="text"
									style={{ textAlign: 'left' }}
									className="input-default inline-block w-full border rounded-md border-transparent h-12"
								/>
							</div>
							<div className="flex w-3/5 bg-black rounded-r-lg text-md">
								<button onClick={() => onPresignup()}className="m-auto text-white"> Get early access</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex">
				<div className="">
					<Img src="/assets/landing/landing_hero.png" className="w-3/4 m-auto" />
				</div>
			</div>
		</div>
	)
}

const About = () => {
	return (
		<div className="w-full h-full flex bg-white mb-12">
			<div className="lg:grid lg:grid-cols-3 text-black m-auto flex flex-col lg:w-4/5">
				<div className="mx-auto w-3/5 mt-4">
					<div className="text-center text-4xl"><MdLock /></div>
					<div className="text-md font-bold mt-6">Lock in value</div>
					<div className="text-sm">Got a purchase coming up? Secure your Bitcoin to the current price in fiat.</div>
				</div>

				<div className="mx-auto w-3/5 mt-4">
					<div className="text-center text-4xl"><MdOutlineSyncAlt /></div>
					<div className="text-md font-bold mt-6">Instant transaction in any currency</div>
					<div className="text-sm">Make and receive payments in fiat over the lightning network.</div>
				</div>
				<div className="mx-auto w-3/5 mt-4">
					<div className="text-center text-4xl"><MdBolt /></div>
					<div className="text-md font-bold mt-6">Always ready to trade</div>
					<div className="text-sm">All balances stay on the network and are ready to trade at any time.</div>
				</div>
			</div>
		</div>
	)
}
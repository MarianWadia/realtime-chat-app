"use client";
import { cn, toPusherChannel } from "@/libs/utils";
import { Message } from "@/libs/validations/message";
import { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/libs/pusher";
interface MessagesProps {
	initialMessages: Message[] | [];
	sessionId: string;
	sessionImg: string;
	chatPartnerImg: string;
	chatId: string;
}

const Messages: FC<MessagesProps> = ({
	initialMessages,
	sessionId,
	chatPartnerImg,
	sessionImg,
	chatId,
}) => {
	const scrollDownRef = useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	console.log(initialMessages);
	function formatDate(timestamp: number) {
		return format(timestamp, "dd/MM hh:mm aa");
	}
	useEffect(() => {
		pusherClient.subscribe(toPusherChannel(`chat:${chatId}`));
		const handleMessages = (message: Message) => {
			setMessages((prev) => [message, ...prev]);
		};
		console.log("pusher subscribed");
		pusherClient.bind("incoming_messages", handleMessages);
		return () => {
			pusherClient.unsubscribe(toPusherChannel(`chat:${chatId}`));
			pusherClient.unbind("incoming_messages", handleMessages);
		};
	}, []);
	return (
		<div
			id="messages"
			className="flex-1 flex flex-col-reverse gap-4 p-3 max-h-[calc(100vh-6rem)] overflow-y-auto w-full my-8 scrollbar-w-2 scrollbar-thumb-green scrollbar-track-green-lighter scrolling-touch scrollbar-thumb-rounded"
		>
			<div ref={scrollDownRef}></div>
			{messages?.map((msg, index) => {
				const isCurrentUser = msg.senderId === sessionId;
				const hasNextMessageFromSameUser =
					index > 0 &&
					messages[index - 1].senderId === messages[index].senderId;
				return (
					<div
						className="chat-message"
						key={`${msg.senderId} - ${msg.timestamp}`}
					>
						<div
							className={cn("flex items-end", {
								"justify-end": isCurrentUser,
							})}
						>
							<div
								className={cn("flex flex-col max-w-xs space-y-2 text-base", {
									"items-end order-1": isCurrentUser,
									"order-2 items-start": !isCurrentUser,
								})}
							>
								<span
									className={cn("px-4 py-2 rounded-lg inline-block", {
										"bg-primary text-white": isCurrentUser,
										"bg-gray-200 text-gray-900": !isCurrentUser,
										"rounded-br-none":
											isCurrentUser && !hasNextMessageFromSameUser,
										"rounded-bl-none":
											!isCurrentUser && !hasNextMessageFromSameUser,
									})}
								>
									{msg.text}{" "}
									<span className="text-xs ml-2 text-gray-400">
										{formatDate(msg.timestamp)}
									</span>
								</span>
							</div>
							<div
								className={cn("relative w-6 h-6", {
									"order-2 ml-2": isCurrentUser,
									"order-1 mr-2": !isCurrentUser,
									invisible: hasNextMessageFromSameUser,
								})}
							>
								<Image
									src={isCurrentUser ? (sessionImg as string) : chatPartnerImg}
									alt={
										isCurrentUser ? "your profile image" : "your friend image"
									}
									fill
									referrerPolicy="no-referrer"
									className="rounded-full"
								/>
							</div>
						</div>
					</div>
				);
			})}
			{/* <p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, voluptatum
				dolore libero unde earum iure veniam minus necessitatibus. Id doloribus
				beatae nisi iusto vitae minus sequi, modi tenetur ratione dicta
				accusantium tempora ducimus expedita nemo veniam autem. Magni id nobis
				minus officiis, consequatur velit autem ipsum? Voluptatum numquam
				blanditiis autem nesciunt. Exercitationem sint aliquam, quidem, minus
				omnis autem odio neque quos at voluptas debitis distinctio assumenda
				recusandae magnam ea nesciunt optio quasi nemo quam ab impedit. Cum,
				laudantium? Delectus inventore magnam suscipit architecto, voluptatum
				nobis aliquid. Tenetur deserunt facere nam nihil itaque fuga. Ab
				deleniti harum quos voluptate eos corporis, vero aliquam rem placeat
				quidem fugit non nam voluptatibus earum incidunt provident magni hic
				distinctio repudiandae natus. Esse pariatur eveniet unde neque,
				asperiores soluta corrupti incidunt adipisci eligendi, id praesentium
				earum dolorum illum laudantium necessitatibus est velit nemo ex quis
				repudiandae similique deserunt nam recusandae ipsam? Blanditiis
				molestias, nihil quibusdam aperiam explicabo, nobis eius ut veritatis
				quos porro harum tenetur esse officiis ipsa maxime pariatur id, eum
				adipisci! Odio, maiores rerum mollitia dolores fuga molestiae, maxime
				accusamus voluptates aliquid enim nihil delectus. At consectetur eaque
				explicabo reprehenderit alias quae quasi voluptates illo laudantium cum
				ullam tenetur ad suscipit eum soluta consequuntur, numquam porro culpa?
				Illum omnis ex repudiandae, commodi tenetur animi dolor est alias.
				Officia tempore quisquam quae debitis, harum dicta nesciunt suscipit
				earum accusantium, molestias temporibus eligendi ut iste illo odit
				distinctio autem impedit tempora minima reprehenderit modi similique
				laudantium omnis maiores. Nam temporibus dolor, nemo ut voluptates sequi
				excepturi dicta quia aperiam sapiente pariatur corrupti accusantium
				magnam, dolorum aspernatur rerum nesciunt quisquam ad eaque! Consectetur
				alias quibusdam ratione autem veniam ipsa, commodi doloremque
				repudiandae temporibus iusto, id, consequatur quisquam vero excepturi
				qui amet delectus fugiat tempore? Omnis magnam quibusdam illum eaque,
				repudiandae ut nemo temporibus nulla explicabo ratione blanditiis
				perspiciatis excepturi expedita? Cupiditate deserunt ipsam eligendi,
				autem a, similique velit perspiciatis consequuntur, voluptates facilis
				excepturi optio minus saepe odio eveniet quisquam. Et, eveniet ex quod,
				architecto dolor incidunt nemo sint nam est nostrum mollitia, quisquam
				fugit quo! Hic, esse! Similique voluptatibus, recusandae totam placeat
				quidem reiciendis assumenda molestiae dolorum id libero voluptatem a
				molestias exercitationem ipsum natus minima laboriosam quasi sunt nobis
				magnam quia facere nesciunt! Fugit inventore consectetur esse saepe
				excepturi quo commodi provident quis blanditiis aut veritatis alias
				impedit, sit exercitationem vel, nihil, harum quod aliquid cumque
				laudantium? Maiores et fugit iusto, voluptas, impedit, natus ab eum
				tempora magni quae maxime in vel perferendis repellendus beatae minus
				doloremque laboriosam. Minus, sequi. Distinctio, cum repudiandae.
				Corporis magni porro voluptate excepturi rerum amet omnis temporibus
				laboriosam delectus, commodi cumque consectetur fugiat nulla quae eaque
				eveniet explicabo laborum culpa. Eius accusantium, culpa magni debitis
				ab architecto nihil consequuntur explicabo. Voluptates sint eius earum
				odio ratione nulla architecto eligendi corrupti accusamus sit, impedit
				ipsa cum quas voluptatem illo, fugiat esse repellendus veritatis
				similique aspernatur placeat ab magni minima. Omnis molestiae numquam
				quaerat aspernatur nesciunt dolor voluptate magnam necessitatibus eos
				alias tenetur unde atque qui, dolores nam itaque laborum sed commodi.
				Voluptate, nam cumque. Quos fuga quasi assumenda veritatis sunt
				doloremque, officiis dolor mollitia, doloribus in earum libero nam
				laborum ut incidunt corrupti aliquid. Unde, provident accusamus
				blanditiis cumque earum sint ea ullam. Aspernatur doloremque recusandae,
				officiis tempora natus corrupti! Repellat, deleniti iste doloribus
				veritatis quam cum ducimus explicabo consequuntur, laborum odio quia
				necessitatibus natus quos voluptas, recusandae animi itaque nisi at
				magnam nulla quas. Earum, distinctio quisquam. Expedita minima adipisci
				sint quae eligendi fugit, earum nihil sequi placeat qui recusandae
				quidem perspiciatis tempora doloremque quia numquam consectetur, ad,
				quis sed rerum rem iusto perferendis ullam. Quasi officia repellat
				veritatis adipisci odio autem voluptatibus aut quae ipsum laudantium
				sequi, saepe, ullam sed, ex unde eaque temporibus vitae placeat. Cumque
				reiciendis eaque suscipit esse earum consequatur. Odio voluptatem, id
				doloremque tempore deserunt quos possimus? Repellat necessitatibus
				fugiat reiciendis animi cumque accusantium dolorem illum quidem
				architecto labore. Aspernatur quod sint reprehenderit, eligendi pariatur
				suscipit tenetur odit omnis impedit rem velit placeat maiores
				consequuntur ex blanditiis deserunt modi unde exercitationem expedita
				qui minima perspiciatis. Molestias officia distinctio ipsam at
				aspernatur sequi fugiat debitis necessitatibus consequuntur commodi
				vitae consequatur accusamus harum enim aliquid rem tenetur eveniet
				molestiae, aperiam pariatur! Culpa quasi totam sunt, distinctio ratione
				repellat ex officia animi optio accusamus esse autem eaque quis deleniti
				inventore vitae aperiam. Ea repellendus maxime dignissimos, minima illum
				voluptates in explicabo enim optio inventore cupiditate architecto ipsam
				laborum repellat deserunt? Cupiditate, enim expedita repellat
				laboriosam, dolorem quas non dicta beatae ratione rerum consequatur quos
				odit accusantium tempora corporis tenetur aperiam eos incidunt fugiat,
				quam velit! Rem ut minima facilis voluptates ipsum, ipsam, tempore quos,
				incidunt ex ab nulla suscipit inventore molestias? Corporis expedita sit
				alias assumenda a atque dignissimos sapiente temporibus. Ab eos placeat
				veniam quam ullam inventore earum quae molestiae enim. Doloribus iusto
				accusantium, laudantium doloremque reprehenderit quos cum quibusdam
				nulla tenetur eius? Ullam mollitia ut earum aliquid. Facere voluptatem
				architecto sint illo aspernatur sequi labore unde eum, a itaque dolorem
				illum earum nihil quibusdam officia deserunt animi eaque minima cumque?
				Veniam aliquam laudantium voluptatibus, vitae rerum cupiditate
				repudiandae corporis ullam porro quaerat, velit quidem ea. Quod, quis
				tenetur, quaerat ducimus ullam facilis sapiente itaque numquam odit
				porro sint sequi vitae? Eius rerum ipsa architecto fugit sunt eum
				praesentium dolores illum voluptatem, ab minima odio omnis rem itaque,
				veniam sequi maxime pariatur sint officia dicta porro odit laboriosam.
				Natus excepturi inventore beatae repellat laudantium sunt praesentium
				quasi, cum eaque illum dolor nostrum voluptate reiciendis, qui sed,
				assumenda recusandae laboriosam modi omnis ratione? Porro architecto
				fugiat dignissimos tenetur corporis! Fugit ipsum qui labore, aperiam
				praesentium nesciunt, ea odit culpa corrupti est quam dolorem magnam
				quidem nam at eum tempora modi? Inventore ad repellat assumenda odit,
				qui sed itaque esse, voluptatibus possimus dolorem voluptatum expedita
				nobis maiores quam nesciunt ipsa quas, adipisci iusto magni molestias
				dignissimos odio debitis? Esse voluptatum, possimus delectus autem
				libero veritatis aut alias reprehenderit laboriosam eius ut est neque
				eaque tempora. Debitis dolorem odit eos voluptatem deleniti repudiandae
				excepturi, nisi provident minima esse fugit velit.
			</p> */}
		</div>
	);
};

export default Messages;

import { FastifyRequest, FastifyReply } from "fastify";

import { robloxActionRequestedBody } from "../../../interfaces/robloxBodies";
import { robloxActionRequestedHeaders } from "../../../interfaces/robloxHeaders";

import NetworkComponent from "../../../components/networkComponent";

export default function(networkComponent: NetworkComponent, request: FastifyRequest<{ Body: robloxActionRequestedBody, Headers: robloxActionRequestedHeaders }>, reply: FastifyReply) {
	try {
		networkComponent.extensionInstance.onActionReceived.emit({
			ActionType: request.body.actionType,
			OutputChannelId: request.headers["unique-id"]
		});

		reply.code(200).send({ success: true, message: "" });
	}
	catch(exception) {
		reply.code(500).send({ success: false, message: exception });
	}
}
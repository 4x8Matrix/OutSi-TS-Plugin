import { FastifyRequest, FastifyReply } from "fastify";

import { robloxIdentifyRequestedBody } from "../../interfaces/robloxBodies";
import { robloxIdentifyRequestedHeaders } from "../../interfaces/robloxHeaders";

import NetworkComponent from "../../components/networkComponent";

export default function(networkComponent: NetworkComponent, request: FastifyRequest<{ Body: robloxIdentifyRequestedBody, Headers: robloxIdentifyRequestedHeaders }>, reply: FastifyReply) {
	reply.code(200).send({
		success: true,
		message: networkComponent.extensionInstance.version
	});
}
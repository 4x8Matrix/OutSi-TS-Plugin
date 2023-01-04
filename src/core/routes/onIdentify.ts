
import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";

import NetworkInterface from "../NetworkInterface";

export const onIdentifySchema: FastifySchema = {
	body: {
		type: "object",
		required: [],
		properties: {}
	}
};

export interface IdentifyInterface {
	Body: { }
}

export function onIdentify(networkInterface: NetworkInterface, request: FastifyRequest<IdentifyInterface>, reply: FastifyReply) {
	reply.code(200).send({
		message: "OutSi",
		version: networkInterface.extensionInstance.version
	});
};
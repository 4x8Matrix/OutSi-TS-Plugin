
import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";

import NetworkInterface from "../NetworkInterface";

export const onVersionSchema: FastifySchema = {
	body: {
		type: "object",
		required: [],
		properties: {}
	}
};

export interface VersionInterface {
	Body: { }
}

export function onVersion(networkInterface: NetworkInterface, request: FastifyRequest<VersionInterface>, reply: FastifyReply) {
	reply.code(200).send({
		message: networkInterface.extensionInstance.version
	});
};
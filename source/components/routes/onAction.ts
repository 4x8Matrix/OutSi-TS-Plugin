import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import { ActionObject } from "../types/actionObject";

import NetworkInterface from "../NetworkInterface";

export const onActionSchema: FastifySchema = {
	body: {
		type: 'object',
		required: ["action"],
		properties: {
			action: {
				type: "number",
				
				minimum: 0,
				maximum: 3
			}
		}
	}
};

export interface ActionInterface {
	Body: {
		actionObject: ActionObject
	}
}

export function onAction(networkInterface: NetworkInterface, request: FastifyRequest<ActionInterface>, reply: FastifyReply) {
	const { actionObject } = request.body;

	try {
		networkInterface.extensionInstance.onActionReceived.emit(actionObject);

		reply.code(200).send({ message: "success" });
	}
	catch(exception) {
		reply.code(500).send({ message: exception });
	}
};
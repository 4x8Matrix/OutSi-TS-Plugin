
import { FastifyReply, FastifyRequest, FastifySchema, RouteGenericInterface } from "fastify";

import NetworkInterface from "../NetworkInterface";
import { MessageObject } from "../types";

export const onReportSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["batch"],
		properties: {
			batch: {
				type: "array",

				maxItems: 1000,
				minItems: 1,

				items: {
					type: "object",
					required: ["messageType", "message"],
					properties: {
						messageType: {
							type: "number",
							
							minimum: 0,
							maximum: 3
						},

						message: {
							type: "string"
						}
					}
				}
			}
		},
	}
};

export interface ReportInterface {
	Body: {
		batch: MessageObject[]
	}
}

export function onReport(networkInterface: NetworkInterface, request: FastifyRequest<ReportInterface>, reply: FastifyReply) {
	const { batch } = request.body;

	try {
		batch.forEach((messageObject) => {
			networkInterface.extensionInstance.onMessageReceived.emit(messageObject);
		});

		reply.code(200).send({ message: "success" });
	}
	catch(exception) {
		console.warn(exception);

		reply.code(500).send({ message: exception });
	}
}
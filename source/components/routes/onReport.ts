
import { FastifyReply, FastifyRequest, FastifySchema, RouteGenericInterface } from "fastify";
import { MessageObjectArray } from "../types/messageObjectArray";

import NetworkInterface from "../NetworkInterface";

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
							type: "string",
							
							maxLength: 200
						}
					}
				}
			}
		},
	}
};

export interface ReportInterface {
	Body: {
		messageObjectArray: MessageObjectArray
	}
}

export function onReport(networkInterface: NetworkInterface, request: FastifyRequest<ReportInterface>, reply: FastifyReply) {
	const { messageObjectArray } = request.body;

	try {
		messageObjectArray.forEach(messageObject => {
			networkInterface.extensionInstance.onMessageReceived.emit(messageObject);
		});

		reply.code(200).send({ message: "success" });
	}
	catch(exception) {
		reply.code(500).send({ message: exception });
	}
}
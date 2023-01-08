import { FastifyRequest, FastifyReply } from "fastify";

import { robloxUploadRequestedBody } from "../../../interfaces/robloxBodies";
import { robloxUploadRequestedHeaders } from "../../../interfaces/robloxHeaders";

import { robloxLogObject } from "../../../types/robloxTypes";

import NetworkComponent from "../../../components/networkComponent";

const messageChannelOutputKey = "MessageOutputChannelId";

export default function(networkComponent: NetworkComponent, request: FastifyRequest<{ Body: robloxUploadRequestedBody, Headers: robloxUploadRequestedHeaders }>, reply: FastifyReply) {
	try {
		request.body.batch.forEach((logObject: robloxLogObject) => {
			logObject[messageChannelOutputKey] = request.headers["unique-id"];

			networkComponent.extensionInstance.onLogReceived.emit(logObject);
		});

		reply.code(200).send({ success: true, message: "" });
	}
	catch(exception) {
		console.warn(exception);

		reply.code(500).send({ success: false, message: exception });
	}
}
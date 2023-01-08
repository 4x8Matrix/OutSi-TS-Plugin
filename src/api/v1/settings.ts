import { workspace } from "vscode";

import { FastifyRequest, FastifyReply } from "fastify";

import { robloxSettingsRequestedBody } from "../../interfaces/robloxBodies";
import { robloxSettingsRequestedHeaders } from "../../interfaces/robloxHeaders";

import NetworkComponent from "../../components/networkComponent";

export default function(networkComponent: NetworkComponent, request: FastifyRequest<{ Body: robloxSettingsRequestedBody, Headers: robloxSettingsRequestedHeaders }>, reply: FastifyReply) {
	try {
		reply.code(200).send({
			success: true,
			settings: {
				HttpResourcePercent: workspace.getConfiguration("outsi.rbx").get("resourcePercent"),
				AttemptDelay: workspace.getConfiguration("outsi.rbx").get("reconnectionDelay"),
				MaxLogsInMemory: workspace.getConfiguration("outsi.rbx").get("maxLogsInMemory")
			}
		});
	}
	catch(exception) {
		console.warn(exception);

		reply.code(500).send({ success: false, message: exception });
	}
}
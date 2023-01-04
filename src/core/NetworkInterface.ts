import { default as fastify, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ExtensionInstance } from "../extension";

import { onAction, onActionSchema, ActionInterface } from "./routes/onAction";
import { onReport, onReportSchema, ReportInterface } from "./routes/onReport";
import { onIdentify, onIdentifySchema, IdentifyInterface } from "./routes/onIdentify";

export default class {
	extensionInstance: ExtensionInstance;

	targetHost: string = "127.0.0.1";
	targetPort: number = 3012;

	server: FastifyInstance;

	constructor(extensionInstance: ExtensionInstance) {
		this.extensionInstance = extensionInstance;
		this.server = fastify();

		let instance = this;

		this.server.post("/api/report", { schema: onReportSchema }, (request: FastifyRequest<ReportInterface>, reply: FastifyReply) => onReport(instance, request, reply));
		this.server.post("/api/action", { schema: onActionSchema }, (request: FastifyRequest<ActionInterface>, reply: FastifyReply) => onAction(instance, request, reply));

		this.server.post("/api/identify", { schema: onIdentifySchema }, (request: FastifyRequest<IdentifyInterface>, reply: FastifyReply) => onIdentify(instance, request, reply));

		this.extensionInstance.onExtensionReady.connect(() => this.server.listen({
			host: this.targetHost,
			port: this.targetPort,
		}));
	}
}
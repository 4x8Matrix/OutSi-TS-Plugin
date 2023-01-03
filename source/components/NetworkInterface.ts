import { default as fastify, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ExtensionInstance } from "../extension";

import { onAction, onActionSchema, ActionInterface } from "./routes/onAction";
import { onReport, onReportSchema, ReportInterface } from "./routes/onReport";
import { onVersion, onVersionSchema, VersionInterface } from "./routes/onVersion";

export default class {
	extensionInstance: ExtensionInstance;

	targetHost: string = "localhost";
	targetPort: number = 3012;

	server: FastifyInstance;

	constructor(extensionInstance: ExtensionInstance) {
		this.extensionInstance = extensionInstance;
		this.server = fastify();

		var instance = this;

		this.server.post("/api/report", { schema: onReportSchema }, (request: FastifyRequest<ReportInterface>, reply: FastifyReply) => onReport(instance, request, reply));
		this.server.post("/api/action", { schema: onActionSchema }, (request: FastifyRequest<ActionInterface>, reply: FastifyReply) => onAction(instance, request, reply));

		this.server.post("/api/version", { schema: onVersionSchema }, (request: FastifyRequest<VersionInterface>, reply: FastifyReply) => onVersion(instance, request, reply));

		this.extensionInstance.onExtensionReady.connect(() => this.server.listen({
			host: this.targetHost,
			port: this.targetPort,
		}));
	}
}
import { default as fastify, FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ExtensionInstance } from "../instance";

import { serverAddress, serverPort } from "../configuration/serverConfiguration";

import { robloxIdentifyRequestedBody, robloxSettingsRequestedBody, robloxActionRequestedBody, robloxUploadRequestedBody } from "../interfaces/robloxBodies";
import { robloxIdentifyRequestedHeaders, robloxSettingsRequestedHeaders, robloxActionRequestedHeaders, robloxUploadRequestedHeaders } from "../interfaces/robloxHeaders";

import { onIdentifyRequestedSchema, onSettingsRequestedSchema, onUploadRequestedSchema, onActionRequestedSchema, } from "../api/v1/schema/inbound";

import action from "../api/v1/event/action";
import upload from "../api/v1/event/upload";
import identify from "../api/v1/identify";
import settings from "../api/v1/settings";

export default class {
	extensionInstance: ExtensionInstance;
	serverInstance: FastifyInstance;

	constructor(extensionInstance: ExtensionInstance) {
		this.extensionInstance = extensionInstance;
		this.serverInstance = fastify();

		this.postConstructorStep();

		this.extensionInstance.onExtensionActivated.connect(() => { this.onExtensionActivated(); });
		this.extensionInstance.onExtensionDeactivated.connect(() => { this.onExtensionDeactivated(); });
	}

	postConstructorStep() {
		let networkComponent: this = this;

		this.serverInstance.get("/api/v1/identify", {
			handler(request: FastifyRequest<{ Body: robloxIdentifyRequestedBody, Headers: robloxIdentifyRequestedHeaders }>, reply: FastifyReply) { return identify(networkComponent, request, reply); },
			schema: onIdentifyRequestedSchema
		});

		this.serverInstance.get('/api/v1/settings', {
			handler(request: FastifyRequest<{ Body: robloxSettingsRequestedBody, Headers: robloxSettingsRequestedHeaders }>, reply: FastifyReply) { return settings(networkComponent, request, reply); },
			schema: onSettingsRequestedSchema
		});

		this.serverInstance.post("/api/v1/event/action", {
			handler(request: FastifyRequest<{ Body: robloxActionRequestedBody, Headers: robloxActionRequestedHeaders }>, reply: FastifyReply) { return action(networkComponent, request, reply); },
			schema: onActionRequestedSchema
		});

		this.serverInstance.post('/api/v1/event/upload', {
			handler(request: FastifyRequest<{ Body: robloxUploadRequestedBody, Headers: robloxUploadRequestedHeaders }>, reply: FastifyReply) { return upload(networkComponent, request, reply); },
			schema: onUploadRequestedSchema
		});
	}

	onExtensionActivated() { this.serverInstance.listen({ host: serverAddress, port: serverPort }); }
	onExtensionDeactivated() { this.serverInstance.close(); }
}
import { default as fastify, FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { window, commands, StatusBarAlignment, StatusBarItem, Disposable } from "vscode";
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

	statusBarItem: StatusBarItem;
	disposableCommands: Disposable[];

	constructor(extensionInstance: ExtensionInstance) {
		this.extensionInstance = extensionInstance;
		this.serverInstance = fastify();
		this.statusBarItem = window.createStatusBarItem(
			StatusBarAlignment.Right, 200
		);

		this.statusBarItem.text = "$(warning) OutSi";
		this.statusBarItem.command = "outsi.plugin.startServer";

		this.instantiateFastifyRoutes();

		this.extensionInstance.onExtensionActivated.connect(() => { this.onExtensionActivated(); });
		// this.extensionInstance.onExtensionDeactivated.connect(() => { this.onExtensionDeactivated(); });
	
		this.disposableCommands = [
			commands.registerCommand("outsi.plugin.startServer", () => {
				this.onExtensionActivated();
			}),
	
			commands.registerCommand("outsi.plugin.stopServer", () => {
				this.serverInstance.close();
				this.serverInstance = fastify();

				this.instantiateFastifyRoutes();
	
				this.statusBarItem.show();
			})
		];
	}

	instantiateFastifyRoutes() {
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

	onExtensionActivated() {
		this.serverInstance.listen({ host: serverAddress, port: serverPort }).then(() => {
			this.statusBarItem.hide();
		}).catch((reason: string) => {
			window.showWarningMessage("OutSi Server has not been started; Refer to 'Output' channels for more information.");
			console.warn(reason);

			this.statusBarItem.show();
		});
	}
	// This will now be handled by the controlComponent.

	// onExtensionDeactivated() {
	// 	this.serverInstance.close();
	// 	this.statusBarItem.dispose();

	// 	this.disposableCommands.forEach((disposableObject: Disposable) => {
	// 		disposableObject.dispose();
	// 	});
	// }
}
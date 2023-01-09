import { ExtensionInstance } from "../instance";

import { workspace, window } from "vscode";
import { terminalSession } from "../types/terminalTypes";
import { robloxLogObject, robloxActionObject } from "../types/robloxTypes";

const illegalStringMutations: string[] = [
	"'", "\""
];

export default class {
	extensionInstance: ExtensionInstance;

	existingSessions: terminalSession[] = [];

	constructor(extensionInstance: ExtensionInstance) {
		this.extensionInstance = extensionInstance;
		this.existingSessions = [];

		workspace.onDidChangeConfiguration.bind(this.onPluginSettingsUpdated);

		this.extensionInstance.onLogReceived.connect((robloxLogObject: robloxLogObject) => {
			this.onMessageLogReceived(robloxLogObject);
		});

		this.extensionInstance.onActionReceived.connect((robloxActionObject: robloxActionObject) => {
			this.onActionReceived(robloxActionObject);
		});
	}

	getSession(sessionName: string) {
		let instantiatedSessionObject: terminalSession | undefined = this.existingSessions.find((terminalSession: terminalSession) => {
			return terminalSession.sessionName === sessionName;
		});

		return instantiatedSessionObject || this.generateSession(sessionName);
	}

	generateSession(sessionName: string) {
		let multiInstanceEnabled: boolean | undefined = workspace.getConfiguration("outsi.plugin").get("multiInstanceEnabled");
		let outputLanguageId: string | undefined = workspace.getConfiguration("outsi.plugin").get("outputLanguageId");
		let autoFocus: boolean | undefined = workspace.getConfiguration("outsi.plugin").get("autoFocus");

		let terminalSessionInstance: terminalSession = {
			sessionName: sessionName,
			sessionTerminal: window.createOutputChannel(sessionName, outputLanguageId)
		};

		if ((this.existingSessions.length >= 1) && (!multiInstanceEnabled)) {
			let lastActiveSession: terminalSession | undefined = this.existingSessions.pop();

			lastActiveSession?.sessionTerminal.dispose();
		}
		
		this.existingSessions.push(terminalSessionInstance);

		if (autoFocus) { terminalSessionInstance.sessionTerminal.show(); }

		return terminalSessionInstance;
	}

	sanitizeMessage(message: string) {
		illegalStringMutations.forEach((illegalString: string) => {
			message = message.split(illegalString).join("");
		});

		return message;
	}

	onPluginSettingsUpdated() {
		let multiInstanceEnabled: boolean | undefined = workspace.getConfiguration("outsi.plugin").get("multiInstanceEnabled");

		if (!multiInstanceEnabled) {
			this.existingSessions.reverse();

			while (this.existingSessions.length > 1) {
				let lastActiveSession: terminalSession | undefined = this.existingSessions.pop();

				lastActiveSession?.sessionTerminal.dispose();
			}
		}
	}

	onMessageLogReceived(robloxLogObject: robloxLogObject) {
		let sessionObject: terminalSession = this.getSession(robloxLogObject.MessageOutputChannelId);

		let logTag: string | undefined = workspace.getConfiguration("outsi.plugin").get("logTag");

		let errorTag: string | undefined = workspace.getConfiguration("outsi.plugin").get("errorTag");
		let warningTag: string | undefined = workspace.getConfiguration("outsi.plugin").get("warningTag");
		let informationTag: string | undefined = workspace.getConfiguration("outsi.plugin").get("informationTag");

		let duplicateMessageTag: string | undefined = workspace.getConfiguration("outsi.plugin").get("duplicateMessageTag");
		let ignoreDuplicateMessages: boolean | undefined = workspace.getConfiguration("outsi.plugin").get("ignoreDuplicateMessages");

		if (ignoreDuplicateMessages) { robloxLogObject.RepeatCount = 0; }

		for (let messageIndex = 0; messageIndex < (robloxLogObject.RepeatCount + 1); messageIndex++) {
			let messageResolve: string = this.sanitizeMessage(robloxLogObject.Message);
			let timeString = new Date().toLocaleTimeString();

			switch (robloxLogObject.MessageType) {
				case 0:
					messageResolve = `[${timeString}][${logTag}]: ${messageResolve}`;
	
					break;
				case 1:
					messageResolve = `[${timeString}][${informationTag}]: ${messageResolve}`;
	
					break;
				case 2:
					messageResolve = `[${timeString}][${warningTag}]: ${messageResolve}`;

					break;
				case 3:
					messageResolve = `[${timeString}][${errorTag}]: '${messageResolve}'`;

					if (robloxLogObject.StackTrace) {
						robloxLogObject.StackTrace.split("\n").forEach((splitString) => {
							messageResolve += "\n " + splitString;
						});
					}

					break;
			}

			if ((messageIndex !== 0) || (messageResolve === sessionObject.lastMessage)) {
				if (robloxLogObject.MessageType === 3) { return; }

				messageResolve = `[${duplicateMessageTag}] ` + messageResolve;
			}

			sessionObject.sessionTerminal.appendLine(messageResolve);
			sessionObject.sessionTerminal.show();
		}

		sessionObject.lastMessage = robloxLogObject.Message;
	}

	onActionReceived(robloxActionObject: robloxActionObject) {
		let sessionObject: terminalSession = this.getSession(robloxActionObject.OutputChannelId);

		let clearOnRunContextChanged: boolean | undefined = workspace.getConfiguration("outsi.plugin").get("clearOnRunContextChanged");

		switch (robloxActionObject.ActionType) {
			case 0:
				if (clearOnRunContextChanged === true) {
					sessionObject.sessionTerminal.clear();
				}

				break;
			case 1:
				let sessionObjectIndex = this.existingSessions.findIndex((sessionObjectMatch: terminalSession) => {
					return sessionObjectMatch === sessionObject;
				});

				this.existingSessions.splice(sessionObjectIndex, 1);
				sessionObject.sessionTerminal.dispose();

				break;
		}
	}
}
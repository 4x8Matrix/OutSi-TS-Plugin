import { window, OutputChannel } from "vscode";
import { ExtensionInstance } from "../extension";
import { MessageObject } from "./types";

export default class {
	extensionInstance: ExtensionInstance;
	outputChannel: OutputChannel;

	constructor(extensionInstance: ExtensionInstance) {
		this.extensionInstance = extensionInstance;
		this.outputChannel = window.createOutputChannel("Roblox Output");

		this.outputChannel.appendLine("");

		this.extensionInstance.onMessageReceived.connect((messageObject: MessageObject) => {
			let message = this.instantiateMessageObject(messageObject);

			this.outputChannel.appendLine(message);
			this.outputChannel.show();
		});
	}

	instantiateMessageObject(messageObject: MessageObject) {
		return messageObject.message;
	}
}
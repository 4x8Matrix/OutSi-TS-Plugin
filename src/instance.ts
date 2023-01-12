import { ExtensionContext } from "vscode";
import { Signal } from "typed-signals";

import { branch } from "./enumeration/branch";
import { robloxLogObject, robloxActionObject } from "./types/robloxTypes";

import NetworkComponent from "./components/networkComponent";
import TerminalComponent from "./components/terminalComponent";

import InitializeServer from "./modules/initializeServer"

export class ExtensionInstance {
	branch: branch = branch.development;

	version: string = "0.1.0";

	context: ExtensionContext;

	networkComponent?: NetworkComponent;
	terminalComponent?: TerminalComponent;

	onExtensionActivated: Signal<() => void> = new Signal();
	onExtensionDeactivated: Signal<() => void> = new Signal();

	onLogReceived: Signal<(messageObject: robloxLogObject) => void> = new Signal();
	onActionReceived: Signal<(actionObject: robloxActionObject) => void> = new Signal();

	constructor(context: ExtensionContext) {
		this.context = context;

		InitializeServer(this).then(() => {
			this.terminalComponent = new TerminalComponent(this);

			this.onExtensionActivated.connect(() => console.log("Plugin Active!"));
		})
	}
}
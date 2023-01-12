import { ExtensionContext } from "vscode";
import { Signal } from "typed-signals";

import { branch } from "./enumeration/branch";
import { robloxLogObject, robloxActionObject } from "./types/robloxTypes";

import NetworkComponent from "./components/networkComponent";
import TerminalComponent from "./components/terminalComponent";

import { spawn } from "child_process";
import * as path from "path"

export class ExtensionInstance {
	branch: branch = branch.development;

	version: string = "0.1.0";

	context: ExtensionContext;

	networkComponent?: NetworkComponent;
	terminalComponent: TerminalComponent;

	onExtensionActivated: Signal<() => void> = new Signal();
	onExtensionDeactivated: Signal<() => void> = new Signal();

	onLogReceived: Signal<(messageObject: robloxLogObject) => void> = new Signal();
	onActionReceived: Signal<(actionObject: robloxActionObject) => void> = new Signal();

	constructor(context: ExtensionContext) {
		this.context = context;

		const controlInstance = spawn("node", [ 
			path.join(this.context.extensionPath, "components", "controlComponent.js")
		])

		this.terminalComponent = new TerminalComponent(this);
 
		this.onExtensionActivated.connect(() => console.log("Plugin Active!"));

		controlInstance.on('close', (exitStatus) => {
			exitStatus 
			? 
				console.log("controlInstance :: Instance shut down improperly with an error! Abort.")
			: 
				console.log("controlInstance :: Shut down API server.")
		})

		controlInstance.stderr.on('data', (err) => {
			console.log("controlInstance :: ERROR: ", err)
		})

		controlInstance.stdout.on('data', (stream) => {
			console.log("controlInstance :: ", stream)
		})

		this.onExtensionDeactivated.connect(() => {
			controlInstance.kill(0)
		})
	}
}
/**
 * @name OutSi
 * @description OutSi is a Roblox -> Visual Studio Code output replication tool
**/

import { ExtensionContext } from "vscode";
import { ExtensionInstance } from "./instance";

let runtimeInstance: ExtensionInstance;

export function activate(context: ExtensionContext) {
	runtimeInstance = new ExtensionInstance(context);

	runtimeInstance.onExtensionActivated.emit();
}

export function deactivate() {
	if (!runtimeInstance) { return; }

	runtimeInstance.onExtensionDeactivated.emit();
}
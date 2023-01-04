/**
 * @name OutSi
 * @author AsyncMatrix
 * @version 0.0.1
**/

import { ActionObject, MessageObject } from './core/types';

import { ExtensionContext } from 'vscode';
import { Signal } from "typed-signals";

import { branchType as pluginBranch } from './enums/pluginBranch';

import NetworkInterface from './core/NetworkInterface';
import TerminalInterface from './core/TerminalInterface';


export class ExtensionInstance {
	name: string = "OutSi";
	version: string = "0.0.1";
	author: string = "AsyncMatrix";
	description: string = "OutSi is a Roblox -> Visual Studio Code output replication tool";
	branch: string = pluginBranch.development;

	context: ExtensionContext;

	networkInterface: NetworkInterface;
	terminalInterface: TerminalInterface;

	onExtensionReady: Signal<() => void> = new Signal();

	onMessageReceived: Signal<(messageObject: MessageObject) => void> = new Signal();
	onActionReceived: Signal<(actionObject: ActionObject) => void> = new Signal();

	constructor(context: ExtensionContext) {
		this.context = context;

		this.networkInterface = new NetworkInterface(this);
		this.terminalInterface = new TerminalInterface(this);

		this.onExtensionReady.connect(() => console.log("Plugin Active!"));
	}

	onExtensionActivated() { this.onExtensionReady.emit(); }
}

export function activate(context: ExtensionContext) {
	const extensionInstance: ExtensionInstance = new ExtensionInstance(context);

	extensionInstance.onExtensionActivated();
}
import { spawn } from "child_process";
import * as path from "path"
import { Signal } from "typed-signals";
import { ExtensionContext } from "vscode";
import networkComponent from "../components/networkComponent";
import terminalComponent from "../components/terminalComponent";
import { branch } from "../enumeration/branch";
import { robloxActionObject, robloxLogObject } from "../types/robloxTypes";

export default async function main(prototype: {
    branch: branch,
    version: string, 
    context: ExtensionContext,

    networkComponent?: networkComponent,
    terminalComponent?: terminalComponent,

    onExtensionActivated: Signal<() => void>,
    onExtensionDeactivated: Signal<() => void>,

    onLogReceived: Signal<(messageObject: robloxLogObject) => void>,
	onActionReceived: Signal<(actionObject: robloxActionObject) => void>,

}) {
    const controlInstance = spawn("node", [ 
        path.join(prototype.context.extensionPath, "components", "controlComponent.js")
    ])
    
    controlInstance.on('close', (exitStatus: number) => {
        exitStatus 
        ? 
            console.log("controlInstance :: Instance shut down improperly with an error! Abort.")
        : 
            console.log("controlInstance :: Shut down API server.")
    })
    
    controlInstance.stderr.on('data', (err: any) => {
        console.log("controlInstance :: ERROR: ", err)
    })
    
    controlInstance.stdout.on('data', (stream: any) => {
        console.log("controlInstance :: ", stream)
    })
    
    prototype.onExtensionDeactivated.connect(() => {
        controlInstance.kill(0)
    })

    Promise.resolve()
}

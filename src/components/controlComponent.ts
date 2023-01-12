import { format } from "util";
import { ExtensionInstance } from "../instance";
import networkComponent from "./networkComponent";

let self = ExtensionInstance.prototype
let serverInstance = new networkComponent(self)

self.networkComponent = serverInstance

console.log(format("controlComponent :: Server instantiated at %s", self.context.extensionPath))
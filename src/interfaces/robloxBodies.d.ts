import { robloxLogObject } from "../types/robloxTypes"

export type robloxSettingsRequestedBody = { }
export type robloxIdentifyRequestedBody = { }

export type robloxActionRequestedBody = {
	"actionType": number
}

export type robloxUploadRequestedBody = {
	"batch": robloxLogObject[]
}
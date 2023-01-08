export type robloxActionObject = {
	ActionType: number,
	OutputChannelId: string,
}

export type robloxLogObject = {
	MessageType: number,
	Message: string,
	RepeatCount: number,

	MessageOutputChannelId: string,
	FilePath?: string,
	StackTrace?: string
}

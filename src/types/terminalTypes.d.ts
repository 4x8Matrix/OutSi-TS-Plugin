import { OutputChannel } from "vscode"

export type terminalSession = {
	sessionTerminal: OutputChannel
	sessionName: string,

	lastMessage?: string
}
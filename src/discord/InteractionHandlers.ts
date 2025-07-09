import { ButtonFactory_AcceptAuthentication, ButtonFactory_RejectAuthentication } from "./buttons/AuthenticationResponse.js";
import ButtonFactoryBase from "./buttons/ButtonBase.js";
import SlashCommand_Info from "./commands/Info.js";
import SlashCommand_RequestAuthentication from "./commands/RequestAuthentication.js";
import SlashCommandBase from "./commands/SlashCommandBase.js";

// prettier-ignore
export const slashComamnds: SlashCommandBase[] = [
    new SlashCommand_RequestAuthentication(),
    new SlashCommand_Info()
];

// prettier-ignore
export const buttons: ButtonFactoryBase[] = [
    new ButtonFactory_AcceptAuthentication(),
    new ButtonFactory_RejectAuthentication()
]

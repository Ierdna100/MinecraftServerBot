import { ButtonFactory_AcceptAuthentication, ButtonFactory_RejectAuthentication } from "./buttons/AuthenticationResponse.js";
import ButtonFactoryBase from "./buttons/ButtonBase.js";
import { ButtonFactory_ConfirmIP, ButtonFactory_DenyIP } from "./buttons/UnregisteredIPResponse.js";
import { SlashCommand_Administrators } from "./commands/Administrators.js";
import { SlashCommand_ForceBackup } from "./commands/ForceBackup.js";
import SlashCommand_Info from "./commands/Info.js";
import SlashCommand_RequestAuthentication from "./commands/RequestAuthentication.js";
import SlashCommandBase from "./commands/SlashCommandBase.js";

// prettier-ignore
export const slashComamnds: SlashCommandBase[] = [
    new SlashCommand_RequestAuthentication(),
    new SlashCommand_Info(),
    new SlashCommand_Administrators(),
    new SlashCommand_ForceBackup()
];

// prettier-ignore
export const buttons: ButtonFactoryBase[] = [
    new ButtonFactory_AcceptAuthentication(),
    new ButtonFactory_RejectAuthentication(),
    new ButtonFactory_ConfirmIP(),
    new ButtonFactory_DenyIP()
]

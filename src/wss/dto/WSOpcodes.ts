export enum WSOpcodes {
    Discard = -1,
    M2D_Message,
    M2D_Death,
    M2D_ServerStarting, // UNUSED
    M2D_ServerStarted,
    M2D_ServerStopping,
    M2D_ServerStopped,
    M2D_PlayerLeft,
    M2D_PlayerJoin,
    M2D_Advancement,
    M2D_ServerInfo,
    M2D_SavedGame,
    D2M_ServerInfoRequest,
    M2D_PlayerJoinSuccess = 11_000,
    M2D_PlayerJoinFail_AuthServersDown,
    M2D_PlayerJoinFail_IPBanned,
    M2D_PlayerJoinFail_NotWhitelisted,
    M2D_PlayerJoinFail_UnregisteredIP,
    M2D_AuthenticationRequest = 10_000,
    D2M_AuthenticationResponse
}

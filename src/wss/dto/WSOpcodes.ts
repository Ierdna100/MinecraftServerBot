export enum WSOpcodes {
    Discard = -1,
    M2D_PlayerJoinSuccess = 11_000,
    M2D_PlayerJoinFail_AuthServersDown,
    M2D_PlayerJoinFail_IPBanned,
    M2D_PlayerJoinFail_NotWhitelisted,
    M2D_PlayerJoinFail_UnregisteredIP,
    M2D_AuthenticationRequest = 10_000,
    D2M_AuthenticationResponse
}

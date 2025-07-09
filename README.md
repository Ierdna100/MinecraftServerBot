Run:

`npm install`
`npm run build`
`npm run run`

## Code 0 : Successful login

| Type        | Message                                          |
| ----------- | ------------------------------------------------ |
| Discord log | User {user} successfully logged in with IP {ip}. |

## Code 1 : Rejected login: No IP registered to that name

| Type                    | Message                                                                                                                                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discord log             | User {user} attempted to login from IP {ip} but the IP is not associated with the user.                                                                                                                                                                          |
| MC Refusal Message      | The IP from which you are trying to login from is not registered with your username. This happens when you first join the server or your IP changes dynamically. A confirmation message has been sent to you through Discord to confirm your new IP.             |
| Discord message to user | A player with a username (`{user}`) registered to your Discord account has attempted to join the server with an unrecognized IP. If this was you, please confirm your new IP with the confirmation button below. If it was not you, please report this incident. |

Buttons the user can press:
Type | Message
-|-
Confirmation | Confirm new IP Address
Error | Deny IP Adress and report incident

> NB: Buttons expire after 5 minutes.

## Code 2 : Rejected login: No IP registered to that name AND the user is not in any related guild

| Type               | Message                                                                                                                                                                                                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discord log        | User {user} attempted to login from IP {ip} but the IP is not associated with the user. The user does not share any guilds with the bot.                                                                                                                                                                                               |
| MC Refusal Message | The IP from which you are trying to login from is not associated with your username. This happens when you first join the server or your IP changes dynamically. You also do not share any guilds with the login Discord bot, therefore we cannot confirm your new IP. Please join the Discord server at {discord link} and try again. |

## Code 3 : Rejected login: not whitelisted and no request to whitelist is found

| Type               | Message                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discord log        | User {user} attempted to login but that user is not whitelisted.                                                                                                                                        |
| MC Refusal Message | The username with which you are trying to join is not whitelisted. If you think this is a mistake, please submit a whitelist request with the `{whitelist command help}` command in the Discord server! |

Buttons the administrator can press:
Type | Message
-|-
Error | Block IP Address from further attempts

> NB: Buttons never expire.

> NB: Auto-IP block occurs after 3 attempts.

## Code 4 : Rejected login: not whitelisted and a request to whitelist is found

| Type               | Message                                                                                                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discord log        | User {user} attempted to login but the user is not whitelisted. **There is a pending request for that username.**                                                                                                                              |
| MC Refusal Message | The username from which you are trying to join is not whitelisted but we have found a request to whitelist. If you think this was a mistake, please contact an administrator in the Discord server so they can confirm your whitelist request! |

Buttons the administrator can press:
Type | Message
-|-
Confirmation | Confirm whitelist request and IP association with the whitelist entry
Confirmation | Confirm whitelist request
Error | Deny whitelist request
Error | Deny whitelist request and block user from interacting with the login system.

> NB: Buttons never expire.

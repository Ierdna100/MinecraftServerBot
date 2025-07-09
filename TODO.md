1. Dynmap?

-   Additionally:

    -   JFR implementation?
    -   New whitelist system
    -   restart command
    -   stop command
    -   backup command (MC & discord)
    -   new skin system?
    -   backup warnings

-   Change datapack with scoreboards:
    -   Only show:
        -   Below name: HP
        -   Server list: Time played (minutes? hours?)

3. Test for Discord log mod
4. Add proper logging
5. Server MOTD randomizer?
6. Setgamerules (init script?)
7. Rename "CollegeMod" to "andreimod" or smth
8. Players metadata
    - Deaths
    - Kills
    - Time Played
    - Time Played This Session
9. New stuff on internal leaderboards
10. Add logging to DB

-   HTTP endpoint to restart WS connection
-   Console args:

    -   noDiscordAnnouncements
    -   detail
    -   noDiscordLogging
    -   noANSI

-   Rework datapack to remove all the scoreboard shit

-   Split mods:

    -   Authentication Mod
    -   Logging Mod

-   Automate registration process

    -   Certain Discord IDs are registered, then from there they can link their accounts
    -   Authenticate if they have role
    -   Authenticate manually
    -   => Change websocket system to subscribe to certain events/update certain things

-   Fix generic string type
    -   Specify UUID
    -   Specify DiscordID

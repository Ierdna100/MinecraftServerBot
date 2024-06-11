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
4. Test death by player
5. Proper death logs
6. Add proper logging
7. Server MOTD randomizer?
8. Setgamerules (init script?)
9. Rename "CollegeMod" to "andreimod" or smth
10. Players metadata
    - Deaths
    - Kills
    - Time Played
    - Time Played This Session
11. New stuff on internal leaderboards
12. Add logging to DB

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

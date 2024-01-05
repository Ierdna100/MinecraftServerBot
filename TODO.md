1. Commands
    - MINECRAFT:
        - /initMod: reset up the websocket between the two servers
        - /allowIdling: self-explanatory
        - /warn-day: self-explanatory
    - DISCORD:
        - /help
        - /registerName: registers mc name
        - /registerMember: admin Only, whitelist member
        - /getAchiviementData
    - MODALS:
        - confirm IP
    - Continously updated stuff:
        - panel with server info:
            - Players online
            - Server status
            - timestamp
            - IP
            - authenticated players
2. Shell script for starting everything in order
    - Mongo server
    - This server
    - Minecraft server
3. Test for Discord log mod
4. Test death by player
5. Ticksbehind not working?
6. Messages dont send to DB? (forgot to add handler)
7. Automate updating allowedMembers
8. Add proper logging
9. Datapack
10. In case of bot lack of response, send directly via webhook, then immediately stop the server from attempting to heartbeat or do else
11. Some kind of messageID (UID - Unique ID) system to track messages that expect responses?
12. Server MOTD randomizer?
13. server icon and such
14. Install script
15. Register commands script
16. Setgamerules (init script?)
17. Rename "CollegeMod" to "andreimod" or smth

18. fabric-tailor
19. lithium
20. starlight
21. faric API 0.85
    > `taskset -c 0-5 java -Xmx10G -Xms1G -jar fabric-server.jar nogui`
22. proper auth for discord commands
23. rework websocket to be able to send data only to MC server

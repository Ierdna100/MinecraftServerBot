import { Stream } from "./CustomDataStream.js";
import { MinecraftUser } from "./MinecraftUser.js";

export async function generateDeathMessage(
    key: string,
    killed: string,
    killer?: string,
    killedByPlayer?: boolean,
    killerEntityType?: string,
    itemName?: string
): Promise<string> {
    const rawMessageStream = new Stream(DeathMessages[key].split(""));
    let output = "";
    while (!rawMessageStream.eof()) {
        output += rawMessageStream.readUntil("%", false).join("");
        rawMessageStream.next(); // Discard '%'
        switch (rawMessageStream.next()) {
            case "1": // Always killed user
                const killedUser = await MinecraftUser.getUserByUUID(killed);
                output += killedUser == undefined ? `**${killed}**` : `**${killedUser.displayName}**`;
                break;
            case "2": // Always killer user / entity
                if (killer == undefined) {
                    console.log("Killer was undefined!");
                    break;
                } else if (killedByPlayer) {
                    const killerUser = await MinecraftUser.getUserByUUID(killer);
                    output += `**${killerUser!.displayName}**`;
                } else {
                    output += `**${EntityTypes["entity.minecraft." + killerEntityType!.split(":")[1]]}**`;
                }

                break;
            case "3": // Always kill item
                output += `*__${itemName!}__*`;
                break;
        }

        rawMessageStream.next(); // Discard '$'
        rawMessageStream.next(); // Discard 's'
    }

    return output;
}

// prettier-ignore
const EntityTypes: Record<string, string> = {
    "entity.minecraft.allay": "Allay",
    "entity.minecraft.area_effect_cloud": "Area Effect Cloud",
    "entity.minecraft.armor_stand": "Armor Stand",
    "entity.minecraft.arrow": "Arrow",
    "entity.minecraft.axolotl": "Axolotl",
    "entity.minecraft.bat": "Bat",
    "entity.minecraft.bee": "Bee",
    "entity.minecraft.blaze": "Blaze",
    "entity.minecraft.block_display": "Block Display",
    "entity.minecraft.boat": "Boat",
    "entity.minecraft.breeze": "Breeze",
    "entity.minecraft.camel": "Camel",
    "entity.minecraft.cat": "Cat",
    "entity.minecraft.cave_spider": "Cave Spider",
    "entity.minecraft.chest_boat": "Boat with Chest",
    "entity.minecraft.chest_minecart": "Minecart with Chest",
    "entity.minecraft.chicken": "Chicken",
    "entity.minecraft.cod": "Cod",
    "entity.minecraft.command_block_minecart": "Minecart with Command Block",
    "entity.minecraft.cow": "Cow",
    "entity.minecraft.creeper": "Creeper",
    "entity.minecraft.dolphin": "Dolphin",
    "entity.minecraft.donkey": "Donkey",
    "entity.minecraft.dragon_fireball": "Dragon Fireball",
    "entity.minecraft.drowned": "Drowned",
    "entity.minecraft.egg": "Thrown Egg",
    "entity.minecraft.elder_guardian": "Elder Guardian",
    "entity.minecraft.end_crystal": "End Crystal",
    "entity.minecraft.ender_dragon": "Ender Dragon",
    "entity.minecraft.ender_pearl": "Thrown Ender Pearl",
    "entity.minecraft.enderman": "Enderman",
    "entity.minecraft.endermite": "Endermite",
    "entity.minecraft.evoker": "Evoker",
    "entity.minecraft.evoker_fangs": "Evoker Fangs",
    "entity.minecraft.experience_bottle": "Thrown Bottle o' Enchanting",
    "entity.minecraft.experience_orb": "Experience Orb",
    "entity.minecraft.eye_of_ender": "Eye of Ender",
    "entity.minecraft.falling_block": "Falling Block",
    "entity.minecraft.falling_block_type": "Falling %s",
    "entity.minecraft.fireball": "Fireball",
    "entity.minecraft.firework_rocket": "Firework Rocket",
    "entity.minecraft.fishing_bobber": "Fishing Bobber",
    "entity.minecraft.fox": "Fox",
    "entity.minecraft.frog": "Frog",
    "entity.minecraft.furnace_minecart": "Minecart with Furnace",
    "entity.minecraft.ghast": "Ghast",
    "entity.minecraft.giant": "Giant",
    "entity.minecraft.glow_item_frame": "Glow Item Frame",
    "entity.minecraft.glow_squid": "Glow Squid",
    "entity.minecraft.goat": "Goat",
    "entity.minecraft.guardian": "Guardian",
    "entity.minecraft.hoglin": "Hoglin",
    "entity.minecraft.hopper_minecart": "Minecart with Hopper",
    "entity.minecraft.horse": "Horse",
    "entity.minecraft.husk": "Husk",
    "entity.minecraft.illusioner": "Illusioner",
    "entity.minecraft.interaction": "Interaction",
    "entity.minecraft.iron_golem": "Iron Golem",
    "entity.minecraft.item": "Item",
    "entity.minecraft.item_display": "Item Display",
    "entity.minecraft.item_frame": "Item Frame",
    "entity.minecraft.killer_bunny": "The Killer Bunny",
    "entity.minecraft.leash_knot": "Leash Knot",
    "entity.minecraft.lightning_bolt": "Lightning Bolt",
    "entity.minecraft.llama": "Llama",
    "entity.minecraft.llama_spit": "Llama Spit",
    "entity.minecraft.magma_cube": "Magma Cube",
    "entity.minecraft.marker": "Marker",
    "entity.minecraft.minecart": "Minecart",
    "entity.minecraft.mooshroom": "Mooshroom",
    "entity.minecraft.mule": "Mule",
    "entity.minecraft.ocelot": "Ocelot",
    "entity.minecraft.painting": "Painting",
    "entity.minecraft.panda": "Panda",
    "entity.minecraft.parrot": "Parrot",
    "entity.minecraft.phantom": "Phantom",
    "entity.minecraft.pig": "Pig",
    "entity.minecraft.piglin": "Piglin",
    "entity.minecraft.piglin_brute": "Piglin Brute",
    "entity.minecraft.pillager": "Pillager",
    "entity.minecraft.player": "Player",
    "entity.minecraft.polar_bear": "Polar Bear",
    "entity.minecraft.potion": "Potion",
    "entity.minecraft.pufferfish": "Pufferfish",
    "entity.minecraft.rabbit": "Rabbit",
    "entity.minecraft.ravager": "Ravager",
    "entity.minecraft.salmon": "Salmon",
    "entity.minecraft.sheep": "Sheep",
    "entity.minecraft.shulker": "Shulker",
    "entity.minecraft.shulker_bullet": "Shulker Bullet",
    "entity.minecraft.silverfish": "Silverfish",
    "entity.minecraft.skeleton": "Skeleton",
    "entity.minecraft.skeleton_horse": "Skeleton Horse",
    "entity.minecraft.slime": "Slime",
    "entity.minecraft.small_fireball": "Small Fireball",
    "entity.minecraft.sniffer": "Sniffer",
    "entity.minecraft.snow_golem": "Snow Golem",
    "entity.minecraft.snowball": "Snowball",
    "entity.minecraft.spawner_minecart": "Minecart with Monster Spawner",
    "entity.minecraft.spectral_arrow": "Spectral Arrow",
    "entity.minecraft.spider": "Spider",
    "entity.minecraft.squid": "Squid",
    "entity.minecraft.stray": "Stray",
    "entity.minecraft.strider": "Strider",
    "entity.minecraft.tadpole": "Tadpole",
    "entity.minecraft.text_display": "Text Display",
    "entity.minecraft.tnt": "Primed TNT",
    "entity.minecraft.tnt_minecart": "Minecart with TNT",
    "entity.minecraft.trader_llama": "Trader Llama",
    "entity.minecraft.trident": "Trident",
    "entity.minecraft.tropical_fish": "Tropical Fish",
    "entity.minecraft.tropical_fish.predefined.0": "Anemone",
    "entity.minecraft.tropical_fish.predefined.1": "Black Tang",
    "entity.minecraft.tropical_fish.predefined.2": "Blue Tang",
    "entity.minecraft.tropical_fish.predefined.3": "Butterflyfish",
    "entity.minecraft.tropical_fish.predefined.4": "Cichlid",
    "entity.minecraft.tropical_fish.predefined.5": "Clownfish",
    "entity.minecraft.tropical_fish.predefined.6": "Cotton Candy Betta",
    "entity.minecraft.tropical_fish.predefined.7": "Dottyback",
    "entity.minecraft.tropical_fish.predefined.8": "Emperor Red Snapper",
    "entity.minecraft.tropical_fish.predefined.9": "Goatfish",
    "entity.minecraft.tropical_fish.predefined.10": "Moorish Idol",
    "entity.minecraft.tropical_fish.predefined.11": "Ornate Butterflyfish",
    "entity.minecraft.tropical_fish.predefined.12": "Parrotfish",
    "entity.minecraft.tropical_fish.predefined.13": "Queen Angelfish",
    "entity.minecraft.tropical_fish.predefined.14": "Red Cichlid",
    "entity.minecraft.tropical_fish.predefined.15": "Red Lipped Blenny",
    "entity.minecraft.tropical_fish.predefined.16": "Red Snapper",
    "entity.minecraft.tropical_fish.predefined.17": "Threadfin",
    "entity.minecraft.tropical_fish.predefined.18": "Tomato Clownfish",
    "entity.minecraft.tropical_fish.predefined.19": "Triggerfish",
    "entity.minecraft.tropical_fish.predefined.20": "Yellowtail Parrotfish",
    "entity.minecraft.tropical_fish.predefined.21": "Yellow Tang",
    "entity.minecraft.tropical_fish.type.betty": "Betty",
    "entity.minecraft.tropical_fish.type.blockfish": "Blockfish",
    "entity.minecraft.tropical_fish.type.brinely": "Brinely",
    "entity.minecraft.tropical_fish.type.clayfish": "Clayfish",
    "entity.minecraft.tropical_fish.type.dasher": "Dasher",
    "entity.minecraft.tropical_fish.type.flopper": "Flopper",
    "entity.minecraft.tropical_fish.type.glitter": "Glitter",
    "entity.minecraft.tropical_fish.type.kob": "Kob",
    "entity.minecraft.tropical_fish.type.snooper": "Snooper",
    "entity.minecraft.tropical_fish.type.spotty": "Spotty",
    "entity.minecraft.tropical_fish.type.stripey": "Stripey",
    "entity.minecraft.tropical_fish.type.sunstreak": "Sunstreak",
    "entity.minecraft.turtle": "Turtle",
    "entity.minecraft.vex": "Vex",
    "entity.minecraft.villager": "Villager",
    "entity.minecraft.villager.armorer": "Armorer",
    "entity.minecraft.villager.butcher": "Butcher",
    "entity.minecraft.villager.cartographer": "Cartographer",
    "entity.minecraft.villager.cleric": "Cleric",
    "entity.minecraft.villager.farmer": "Farmer",
    "entity.minecraft.villager.fisherman": "Fisherman",
    "entity.minecraft.villager.fletcher": "Fletcher",
    "entity.minecraft.villager.leatherworker": "Leatherworker",
    "entity.minecraft.villager.librarian": "Librarian",
    "entity.minecraft.villager.mason": "Mason",
    "entity.minecraft.villager.nitwit": "Nitwit",
    "entity.minecraft.villager.none": "Villager",
    "entity.minecraft.villager.shepherd": "Shepherd",
    "entity.minecraft.villager.toolsmith": "Toolsmith",
    "entity.minecraft.villager.weaponsmith": "Weaponsmith",
    "entity.minecraft.vindicator": "Vindicator",
    "entity.minecraft.wandering_trader": "Wandering Trader",
    "entity.minecraft.warden": "Warden",
    "entity.minecraft.wind_charge": "Wind Charge",
    "entity.minecraft.witch": "Witch",
    "entity.minecraft.wither": "Wither",
    "entity.minecraft.wither_skeleton": "Wither Skeleton",
    "entity.minecraft.wither_skull": "Wither Skull",
    "entity.minecraft.wolf": "Wolf",
    "entity.minecraft.zoglin": "Zoglin",
    "entity.minecraft.zombie": "Zombie",
    "entity.minecraft.zombie_horse": "Zombie Horse",
    "entity.minecraft.zombie_villager": "Zombie Villager",
    "entity.minecraft.zombified_piglin": "Zombified Piglin",
}

// prettier-ignore
const DeathMessages: Record<string, string> = {
    "death.attack.anvil": "%1$s was squashed by a falling anvil",
    "death.attack.anvil.player": "%1$s was squashed by a falling anvil while fighting %2$s",
    "death.attack.arrow": "%1$s was shot by %2$s",
    "death.attack.arrow.item": "%1$s was shot by %2$s using %3$s",
    "death.attack.badRespawnPoint.link": "Intentional Game Design",
    "death.attack.badRespawnPoint.message": "%1$s was killed by %2$s",
    "death.attack.cactus": "%1$s was pricked to death",
    "death.attack.cactus.player": "%1$s walked into a cactus while trying to escape %2$s",
    "death.attack.cramming": "%1$s was squished too much",
    "death.attack.cramming.player": "%1$s was squashed by %2$s",
    "death.attack.dragonBreath": "%1$s was roasted in dragon's breath",
    "death.attack.dragonBreath.player": "%1$s was roasted in dragon's breath by %2$s",
    "death.attack.drown": "%1$s drowned",
    "death.attack.drown.player": "%1$s drowned while trying to escape %2$s",
    "death.attack.dryout": "%1$s died from dehydration",
    "death.attack.dryout.player": "%1$s died from dehydration while trying to escape %2$s",
    "death.attack.even_more_magic": "%1$s was killed by even more magic",
    "death.attack.explosion": "%1$s blew up",
    "death.attack.explosion.player": "%1$s was blown up by %2$s",
    "death.attack.explosion.player.item": "%1$s was blown up by %2$s using %3$s",
    "death.attack.fall": "%1$s hit the ground too hard",
    "death.attack.fall.player": "%1$s hit the ground too hard while trying to escape %2$s",
    "death.attack.fallingBlock": "%1$s was squashed by a falling block",
    "death.attack.fallingBlock.player": "%1$s was squashed by a falling block while fighting %2$s",
    "death.attack.fallingStalactite": "%1$s was skewered by a falling stalactite",
    "death.attack.fallingStalactite.player": "%1$s was skewered by a falling stalactite while fighting %2$s",
    "death.attack.fireball": "%1$s was fireballed by %2$s",
    "death.attack.fireball.item": "%1$s was fireballed by %2$s using %3$s",
    "death.attack.fireworks": "%1$s went off with a bang",
    "death.attack.fireworks.item": "%1$s went off with a bang due to a firework fired from %3$s by %2$s",
    "death.attack.fireworks.player": "%1$s went off with a bang while fighting %2$s",
    "death.attack.flyIntoWall": "%1$s experienced kinetic energy",
    "death.attack.flyIntoWall.player": "%1$s experienced kinetic energy while trying to escape %2$s",
    "death.attack.freeze": "%1$s froze to death",
    "death.attack.freeze.player": "%1$s was frozen to death by %2$s",
    "death.attack.generic": "%1$s died",
    "death.attack.generic.player": "%1$s died because of %2$s",
    "death.attack.genericKill": "%1$s was killed",
    "death.attack.genericKill.player": "%1$s was killed while fighting %2$s",
    "death.attack.hotFloor": "%1$s discovered the floor was lava",
    "death.attack.hotFloor.player": "%1$s walked into the danger zone due to %2$s",
    "death.attack.indirectMagic": "%1$s was killed by %2$s using magic",
    "death.attack.indirectMagic.item": "%1$s was killed by %2$s using %3$s",
    "death.attack.inFire": "%1$s went up in flames",
    "death.attack.inFire.player": "%1$s walked into fire while fighting %2$s",
    "death.attack.inWall": "%1$s suffocated in a wall",
    "death.attack.inWall.player": "%1$s suffocated in a wall while fighting %2$s",
    "death.attack.lava": "%1$s tried to swim in lava",
    "death.attack.lava.player": "%1$s tried to swim in lava to escape %2$s",
    "death.attack.lightningBolt": "%1$s was struck by lightning",
    "death.attack.lightningBolt.player": "%1$s was struck by lightning while fighting %2$s",
    "death.attack.magic": "%1$s was killed by magic",
    "death.attack.magic.player": "%1$s was killed by magic while trying to escape %2$s",
    "death.attack.message_too_long": "Actually, the message was too long to deliver fully. Sorry! Here's a stripped version: %s",
    "death.attack.mob": "%1$s was slain by %2$s",
    "death.attack.mob.item": "%1$s was slain by %2$s using %3$s",
    "death.attack.onFire": "%1$s burned to death",
    "death.attack.onFire.item": "%1$s was burned to a crisp while fighting %2$s wielding %3$s",
    "death.attack.onFire.player": "%1$s was burned to a crisp while fighting %2$s",
    "death.attack.outOfWorld": "%1$s fell out of the world",
    "death.attack.outOfWorld.player": "%1$s didn't want to live in the same world as %2$s",
    "death.attack.outsideBorder": "%1$s left the confines of this world",
    "death.attack.outsideBorder.player": "%1$s left the confines of this world while fighting %2$s",
    "death.attack.player": "%1$s was slain by %2$s",
    "death.attack.player.item": "%1$s was slain by %2$s using %3$s",
    "death.attack.sonic_boom": "%1$s was obliterated by a sonically-charged shriek",
    "death.attack.sonic_boom.item": "%1$s was obliterated by a sonically-charged shriek while trying to escape %2$s wielding %3$s",
    "death.attack.sonic_boom.player": "%1$s was obliterated by a sonically-charged shriek while trying to escape %2$s",
    "death.attack.stalagmite": "%1$s was impaled on a stalagmite",
    "death.attack.stalagmite.player": "%1$s was impaled on a stalagmite while fighting %2$s",
    "death.attack.starve": "%1$s starved to death",
    "death.attack.starve.player": "%1$s starved to death while fighting %2$s",
    "death.attack.sting": "%1$s was stung to death",
    "death.attack.sting.item": "%1$s was stung to death by %2$s using %3$s",
    "death.attack.sting.player": "%1$s was stung to death by %2$s",
    "death.attack.sweetBerryBush": "%1$s was poked to death by a sweet berry bush",
    "death.attack.sweetBerryBush.player": "%1$s was poked to death by a sweet berry bush while trying to escape %2$s",
    "death.attack.thorns": "%1$s was killed while trying to hurt %2$s",
    "death.attack.thorns.item": "%1$s was killed by %3$s while trying to hurt %2$s",
    "death.attack.thrown": "%1$s was pummeled by %2$s",
    "death.attack.thrown.item": "%1$s was pummeled by %2$s using %3$s",
    "death.attack.trident": "%1$s was impaled by %2$s",
    "death.attack.trident.item": "%1$s was impaled by %2$s with %3$s",
    "death.attack.wither": "%1$s withered away",
    "death.attack.wither.player": "%1$s withered away while fighting %2$s",
    "death.attack.witherSkull": "%1$s was shot by a skull from %2$s",
    "death.attack.witherSkull.item": "%1$s was shot by a skull from %2$s using %3$s",
    "death.fell.accident.generic": "%1$s fell from a high place",
    "death.fell.accident.ladder": "%1$s fell off a ladder",
    "death.fell.accident.other_climbable": "%1$s fell while climbing",
    "death.fell.accident.scaffolding": "%1$s fell off scaffolding",
    "death.fell.accident.twisting_vines": "%1$s fell off some twisting vines",
    "death.fell.accident.vines": "%1$s fell off some vines",
    "death.fell.accident.weeping_vines": "%1$s fell off some weeping vines",
    "death.fell.assist": "%1$s was doomed to fall by %2$s",
    "death.fell.assist.item": "%1$s was doomed to fall by %2$s using %3$s",
    "death.fell.finish": "%1$s fell too far and was finished by %2$s",
    "death.fell.finish.item": "%1$s fell too far and was finished by %2$s using %3$s",
    "death.fell.killer": "%1$s was doomed to fall"
};
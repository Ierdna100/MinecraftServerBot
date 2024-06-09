import { Stream } from "./CustomDataStream.js";
import { MinecraftUser } from "./MinecraftUser.js";

export async function generateDeathMessage(key: string, killed: string, killer?: string, itemName?: string): Promise<string> {
    const rawMessageStream = new Stream(DeathMessages[key].split(""));
    let output = "";
    while (!rawMessageStream.eof()) {
        output += rawMessageStream.readUntil("%", false).join("");
        rawMessageStream.next(); // Discard '%'
        switch (rawMessageStream.next()) {
            case "1":
                output += `**${(await MinecraftUser.getUserByUUID(killed))!.displayName}**`;
                break;
            case "2":
                output += `**${(await MinecraftUser.getUserByUUID(killer!))!.displayName}**`;
                break;
            case "3":
                output += `*__${itemName!}__*`;
                break;
        }

        rawMessageStream.next(); // Discard '$'
        rawMessageStream.next(); // Discard 's'
    }

    return output;
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

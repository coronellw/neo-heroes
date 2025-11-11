import Character from "../models/characters";
import { Job } from "../types/job";
import { BASE_STATS } from "../constants";

describe("Character Model", () => {
    describe("Character Creation", () => {
        it("should create a Warrior character with default attributes", () => {
            const warrior = new Character({
                name: "TestWarrior",
                job: Job.Warrior
            });

            expect(warrior.name).toBe("TestWarrior");
            expect(warrior.job).toBe(Job.Warrior);
            expect(warrior.attributes.hp).toBe(BASE_STATS[Job.Warrior].hp);
            expect(warrior.attributes.health).toBe(BASE_STATS[Job.Warrior].hp);
            expect(warrior.attributes.strength).toBe(BASE_STATS[Job.Warrior].strength);
            expect(warrior.attributes.dexterity).toBe(BASE_STATS[Job.Warrior].dexterity);
            expect(warrior.attributes.intelligence).toBe(BASE_STATS[Job.Warrior].intelligence);
        });

        it("should create a Mage character with default attributes", () => {
            const mage = new Character({
                name: "TestMage",
                job: Job.Mage
            });

            expect(mage.name).toBe("TestMage");
            expect(mage.job).toBe(Job.Mage);
            expect(mage.attributes.hp).toBe(BASE_STATS[Job.Mage].hp);
            expect(mage.attributes.health).toBe(BASE_STATS[Job.Mage].hp);
            expect(mage.attributes.intelligence).toBe(BASE_STATS[Job.Mage].intelligence);
        });

        it("should create a Thief character with default attributes", () => {
            const thief = new Character({
                name: "TestThief",
                job: Job.Thief
            });

            expect(thief.name).toBe("TestThief");
            expect(thief.job).toBe(Job.Thief);
            expect(thief.attributes.hp).toBe(BASE_STATS[Job.Thief].hp);
            expect(thief.attributes.health).toBe(BASE_STATS[Job.Thief].hp);
            expect(thief.attributes.dexterity).toBe(BASE_STATS[Job.Thief].dexterity);
        });
    });

    describe("Character Attributes", () => {
        it("should have correct attack modifiers for Warrior", () => {
            const warrior = new Character({
                name: "WarriorTest",
                job: Job.Warrior
            });

            expect(warrior.attributes.attack_modifier.multipliers.strength).toBe(0.8);
            expect(warrior.attributes.attack_modifier.multipliers.dexterity).toBe(0.2);
        });

        it("should have correct speed modifiers for Thief", () => {
            const thief = new Character({
                name: "ThiefTest",
                job: Job.Thief
            });

            expect(thief.attributes.speed_modifier.multipliers.dexterity).toBe(0.8);
        });

        it("should have correct stats for Mage", () => {
            const mage = new Character({
                name: "MageTest",
                job: Job.Mage
            });

            expect(mage.attributes.intelligence).toBeGreaterThan(mage.attributes.strength);
            expect(mage.attributes.attack_modifier.multipliers.intelligence).toBe(1.2);
        });
    });

    describe("Character Health", () => {
        it("should initialize health equal to hp for new characters", () => {
            const warrior = new Character({
                name: "HealthTest",
                job: Job.Warrior
            });

            expect(warrior.attributes.health).toBe(warrior.attributes.hp);
        });

        it("should allow different health and hp values", () => {
            const damagedWarrior = new Character({
                name: "DamagedWarrior",
                job: Job.Warrior,
                attributes: {
                    ...BASE_STATS[Job.Warrior],
                    health: 10 // Lower than max hp
                }
            });

            expect(damagedWarrior.attributes.health).toBe(10);
            expect(damagedWarrior.attributes.hp).toBe(BASE_STATS[Job.Warrior].hp);
        });
    });
});

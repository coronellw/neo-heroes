import Character from "../models/characters";
import { Job } from "@neo-heroes/types";
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

    describe("Domain Methods", () => {
        describe("isAlive()", () => {
            it("should return true when health is greater than 0", () => {
                const warrior = new Character({
                    name: "AliveWarrior",
                    job: Job.Warrior
                });

                expect(warrior.isAlive()).toBe(true);
            });

            it("should return false when health is 0", () => {
                const deadWarrior = new Character({
                    name: "DeadWarrior",
                    job: Job.Warrior,
                    attributes: {
                        ...BASE_STATS[Job.Warrior],
                        health: 0
                    }
                });

                expect(deadWarrior.isAlive()).toBe(false);
            });

            it("should return false when health is negative", () => {
                const warrior = new Character({
                    name: "NegativeHealth",
                    job: Job.Warrior,
                    attributes: {
                        ...BASE_STATS[Job.Warrior],
                        health: -5
                    }
                });

                expect(warrior.isAlive()).toBe(false);
            });
        });

        describe("takeDamage()", () => {
            it("should reduce health by damage amount", () => {
                const warrior = new Character({
                    name: "DamageTest",
                    job: Job.Warrior
                });

                const initialHealth = warrior.attributes.health;
                warrior.takeDamage(5);

                expect(warrior.attributes.health).toBe(initialHealth - 5);
            });

            it("should not reduce health below 0", () => {
                const warrior = new Character({
                    name: "OverkillTest",
                    job: Job.Warrior
                });

                warrior.takeDamage(999);

                expect(warrior.attributes.health).toBe(0);
            });

            it("should handle multiple damage applications", () => {
                const warrior = new Character({
                    name: "MultiDamage",
                    job: Job.Warrior
                });

                warrior.takeDamage(3);
                warrior.takeDamage(5);
                warrior.takeDamage(2);

                expect(warrior.attributes.health).toBe(BASE_STATS[Job.Warrior].hp - 10);
            });

            it("should update alive status after lethal damage", () => {
                const warrior = new Character({
                    name: "LethalTest",
                    job: Job.Warrior
                });

                expect(warrior.isAlive()).toBe(true);
                warrior.takeDamage(warrior.attributes.health);
                expect(warrior.isAlive()).toBe(false);
            });
        });

        describe("canBattle()", () => {
            it("should return true when character is alive with attributes", () => {
                const warrior = new Character({
                    name: "BattleReady",
                    job: Job.Warrior
                });

                expect(warrior.canBattle()).toBe(true);
            });

            it("should return false when character is dead", () => {
                const warrior = new Character({
                    name: "DeadFighter",
                    job: Job.Warrior,
                    attributes: {
                        ...BASE_STATS[Job.Warrior],
                        health: 0
                    }
                });

                expect(warrior.canBattle()).toBe(false);
            });

            it("should return false after taking lethal damage", () => {
                const warrior = new Character({
                    name: "DyingFighter",
                    job: Job.Warrior
                });

                expect(warrior.canBattle()).toBe(true);
                warrior.takeDamage(warrior.attributes.health);
                expect(warrior.canBattle()).toBe(false);
            });
        });

        describe("getAttackModifier()", () => {
            it("should calculate attack modifier for Warrior correctly", () => {
                const warrior = new Character({
                    name: "WarriorAttack",
                    job: Job.Warrior
                });

                const expectedAttack = 
                    BASE_STATS[Job.Warrior].strength * 0.8 + 
                    BASE_STATS[Job.Warrior].dexterity * 0.2;

                expect(warrior.getAttackModifier()).toBe(expectedAttack);
            });

            it("should calculate attack modifier for Mage correctly", () => {
                const mage = new Character({
                    name: "MageAttack",
                    job: Job.Mage
                });

                const expectedAttack = 
                    BASE_STATS[Job.Mage].strength * 0.2 + 
                    BASE_STATS[Job.Mage].dexterity * 0.2 + 
                    BASE_STATS[Job.Mage].intelligence * 1.2;

                expect(mage.getAttackModifier()).toBe(expectedAttack);
            });

            it("should calculate attack modifier for Thief correctly", () => {
                const thief = new Character({
                    name: "ThiefAttack",
                    job: Job.Thief
                });

                const expectedAttack = 
                    BASE_STATS[Job.Thief].strength * 0.25 + 
                    BASE_STATS[Job.Thief].dexterity * 1.0 + 
                    BASE_STATS[Job.Thief].intelligence * 0.25;

                expect(thief.getAttackModifier()).toBe(expectedAttack);
            });
        });

        describe("getSpeedModifier()", () => {
            it("should calculate speed modifier for Warrior correctly", () => {
                const warrior = new Character({
                    name: "WarriorSpeed",
                    job: Job.Warrior
                });

                const expectedSpeed = 
                    BASE_STATS[Job.Warrior].dexterity * 0.6 + 
                    BASE_STATS[Job.Warrior].intelligence * 0.2;

                expect(warrior.getSpeedModifier()).toBe(expectedSpeed);
            });

            it("should calculate speed modifier for Mage correctly", () => {
                const mage = new Character({
                    name: "MageSpeed",
                    job: Job.Mage
                });

                const expectedSpeed = 
                    BASE_STATS[Job.Mage].strength * 0.1 + 
                    BASE_STATS[Job.Mage].dexterity * 0.4;

                expect(mage.getSpeedModifier()).toBe(expectedSpeed);
            });

            it("should calculate speed modifier for Thief correctly", () => {
                const thief = new Character({
                    name: "ThiefSpeed",
                    job: Job.Thief
                });

                const expectedSpeed = BASE_STATS[Job.Thief].dexterity * 0.8;

                expect(thief.getSpeedModifier()).toBe(expectedSpeed);
            });
        });

        describe("getFormattedCharacter()", () => {
            it("should return formatted character with all properties", () => {
                const warrior = new Character({
                    name: "FormattedWarrior",
                    job: Job.Warrior
                });
                warrior.id = 1;

                const formatted = warrior.getFormattedCharacter();

                expect(formatted).toHaveProperty("id", 1);
                expect(formatted).toHaveProperty("name", "FormattedWarrior");
                expect(formatted).toHaveProperty("job", Job.Warrior);
                expect(formatted).toHaveProperty("current_health");
                expect(formatted).toHaveProperty("max_health");
                expect(formatted).toHaveProperty("stats");
                expect(formatted).toHaveProperty("battle_modifiers");
            });

            it("should include calculated attack and speed modifiers", () => {
                const mage = new Character({
                    name: "FormattedMage",
                    job: Job.Mage
                });

                const formatted = mage.getFormattedCharacter();

                expect(formatted.battle_modifiers.attack_modifier.value).toBe(mage.getAttackModifier());
                expect(formatted.battle_modifiers.speed_modifier.value).toBe(mage.getSpeedModifier());
            });

            it("should reflect current health after damage", () => {
                const warrior = new Character({
                    name: "DamagedFormatted",
                    job: Job.Warrior
                });

                warrior.takeDamage(5);
                const formatted = warrior.getFormattedCharacter();

                expect(formatted.current_health).toBe(BASE_STATS[Job.Warrior].hp - 5);
                expect(formatted.max_health).toBe(BASE_STATS[Job.Warrior].hp);
            });

            it("should include modifier descriptions", () => {
                const warrior = new Character({
                    name: "DescriptionTest",
                    job: Job.Warrior
                });

                const formatted = warrior.getFormattedCharacter();

                expect(formatted.battle_modifiers.attack_modifier.description).toBeDefined();
                expect(formatted.battle_modifiers.speed_modifier.description).toBeDefined();
            });
        });
    });
});

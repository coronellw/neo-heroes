import { CharacterService } from "../services/characters";
import { CharacterRepository } from "../repositories/characters";
import { Job } from "../types/job";
import { ICalculatedCharacter } from "../types";

describe("CharacterService", () => {
    // Clear repository state before each test for proper isolation
    beforeEach(() => {
        (CharacterRepository as any).characters = [];
        (CharacterRepository as any).nextId = 1;
    });

    describe("Character Creation", () => {
        it("should create a new character", () => {
            const characterData = {
                name: "TestHero",
                job: Job.Warrior
            };

            const result = CharacterService.createCharacter(characterData);

            expect(result.id).toBe(1);
            expect(result.name).toBe("TestHero");
            expect(result.job).toBe(Job.Warrior);
            expect(result.current_health).toBeGreaterThan(0);
            expect(result.max_health).toBeGreaterThan(0);
        });

        it("should validate character name length (minimum)", () => {
            const characterData = {
                name: "Bob", // Too short (< 4 characters)
                job: Job.Warrior
            };

            expect(() => {
                CharacterService.createCharacter(characterData);
            }).toThrow("Character name must be between 4 and 15 characters");
        });

        it("should validate character name length (maximum)", () => {
            const characterData = {
                name: "VeryLongCharacterName", // Too long (> 15 characters)
                job: Job.Warrior
            };

            expect(() => {
                CharacterService.createCharacter(characterData);
            }).toThrow("Character name must be between 4 and 15 characters");
        });

        it("should validate character name characters (only letters and underscores)", () => {
            const characterData = {
                name: "Hero123", // Contains numbers
                job: Job.Warrior
            };

            expect(() => {
                CharacterService.createCharacter(characterData);
            }).toThrow("Character name can only contain letters and underscores");
        });

        it("should allow underscores in character name", () => {
            const characterData = {
                name: "Hero_Warrior",
                job: Job.Warrior
            };

            const result = CharacterService.createCharacter(characterData);
            expect(result.name).toBe("Hero_Warrior");
        });

        it("should return multiple validation errors", () => {
            const characterData = {
                name: "ab#", // Too short AND invalid characters
                job: Job.Warrior
            };

            expect(() => {
                CharacterService.createCharacter(characterData);
            }).toThrow(/Character name must be between 4 and 15 characters; Character name can only contain letters and underscores/);
        });
    });

    describe("Get All Characters", () => {
        it("should return empty array when no characters exist", () => {
            const characters = CharacterService.getAllCharacters();
            expect(Array.isArray(characters)).toBe(true);
        });

        it("should return array of characters with name, job, and status", () => {
            CharacterService.createCharacter({
                name: "TestWarrior",
                job: Job.Warrior
            });

            const characters = CharacterService.getAllCharacters();
            expect(characters.length).toBeGreaterThan(0);
            expect(characters[0]).toHaveProperty("name");
            expect(characters[0]).toHaveProperty("job");
            expect(characters[0]).toHaveProperty("status");
        });

        it("should show alive status for healthy character", () => {
            CharacterService.createCharacter({
                name: "AliveHero",
                job: Job.Warrior
            });

            const characters = CharacterService.getAllCharacters();
            const aliveChar = characters.find(c => c.name === "AliveHero");
            expect(aliveChar?.status).toBe("alive");
        });

        it("should show dead status for character with 0 health", () => {
            CharacterService.createCharacter({
                name: "DeadHero",
                job: Job.Warrior,
                attributes: {
                    hp: 20,
                    health: 0,
                    strength: 10,
                    dexterity: 5,
                    intelligence: 5,
                    attack_modifier: {
                        multipliers: {
                            strength: 0.8
                        }
                    },
                    speed_modifier: {
                        multipliers: {
                            dexterity: 0.6
                        }
                    }
                }
            });

            const characters = CharacterService.getAllCharacters();
            const deadChar = characters.find(c => c.name === "DeadHero");
            expect(deadChar?.status).toBe("dead");
        });
    });

    describe("Calculate Modifiers", () => {
        it("should calculate attack modifier correctly", () => {
            const character = CharacterService.createCharacter({
                name: "ModTest",
                job: Job.Warrior
            });

            expect(character.battle_modifiers.attack_modifier.value).toBeGreaterThan(0);
            expect(typeof character.battle_modifiers.attack_modifier.value).toBe("number");
        });

        it("should calculate speed modifier correctly", () => {
            const character = CharacterService.createCharacter({
                name: "SpeedTest",
                job: Job.Thief
            });

            expect(character.battle_modifiers.speed_modifier.value).toBeGreaterThan(0);
            expect(typeof character.battle_modifiers.speed_modifier.value).toBe("number");
        });

        it("should include stats in calculated character", () => {
            const character = CharacterService.createCharacter({
                name: "StatsTest",
                job: Job.Mage
            });

            expect(character.stats).toHaveProperty("strength");
            expect(character.stats).toHaveProperty("dexterity");
            expect(character.stats).toHaveProperty("intelligence");
        });
    });

    describe("Update Character", () => {
        it("should update character name", () => {
            const created = CharacterService.createCharacter({
                name: "OldName",
                job: Job.Warrior
            });

            const updated = CharacterService.updateCharacter(created.id!, {
                name: "NewName"
            });

            expect(updated).not.toBeNull();
            expect(updated?.name).toBe("NewName");
            expect(updated?.id).toBe(created.id);
        });

        it("should update character job", () => {
            const created = CharacterService.createCharacter({
                name: "JobChange",
                job: Job.Warrior
            });

            const updated = CharacterService.updateCharacter(created.id!, {
                job: Job.Mage
            });

            expect(updated?.job).toBe(Job.Mage);
            expect(updated?.name).toBe("JobChange");
        });

        it("should return null for non-existent character", () => {
            const result = CharacterService.updateCharacter(9999, {
                name: "NotFound"
            });

            expect(result).toBeNull();
        });

        it("should validate name on update", () => {
            const created = CharacterService.createCharacter({
                name: "ValidName",
                job: Job.Warrior
            });

            expect(() => {
                CharacterService.updateCharacter(created.id!, {
                    name: "Bad" // Too short
                });
            }).toThrow("Character name must be between 4 and 15 characters");
        });

        it("should update partial attributes", () => {
            const created = CharacterService.createCharacter({
                name: "PartialUpdate",
                job: Job.Warrior
            });

            const updated = CharacterService.updateCharacter(created.id!, {
                attributes: { health: 10 }
            });

            expect(updated?.current_health).toBe(10);
            expect(updated?.stats.strength).toBe(created.stats.strength); // Other stats unchanged
        });

        it("should preserve character ID on update", () => {
            const created = CharacterService.createCharacter({
                name: "PreserveID",
                job: Job.Warrior
            });

            const originalId = created.id;
            const updated = CharacterService.updateCharacter(originalId!, {
                name: "UpdatedName",
                job: Job.Mage
            });

            expect(updated?.id).toBe(originalId);
        });
    });

    describe("Delete Character", () => {
        it("should delete existing character", () => {
            const created = CharacterService.createCharacter({
                name: "DeleteMe",
                job: Job.Warrior
            });

            const result = CharacterService.deleteCharacter(created.id!);
            
            expect(result).toBe(true);
            
            const found = CharacterService.getCharacterById(created.id!);
            expect(found).toBeUndefined();
        });

        it("should return false when deleting non-existent character", () => {
            const result = CharacterService.deleteCharacter(9999);
            expect(result).toBe(false);
        });

        it("should remove character from getAllCharacters", () => {
            const char1 = CharacterService.createCharacter({ name: "Keep", job: Job.Warrior });
            const char2 = CharacterService.createCharacter({ name: "Delete", job: Job.Mage });

            expect(CharacterService.getAllCharacters().length).toBe(2);

            CharacterService.deleteCharacter(char2.id!);

            const all = CharacterService.getAllCharacters();
            expect(all.length).toBe(1);
            expect(all[0].name).toBe("Keep");
        });
    });

    describe("Get Character Instance", () => {
        it("should return Character instance for valid ID", () => {
            const created = CharacterService.createCharacter({
                name: "InstanceTest",
                job: Job.Warrior
            });

            const instance = CharacterService.getCharacterInstanceById(created.id!);

            expect(instance).toBeDefined();
            expect(instance?.name).toBe("InstanceTest");
            expect(typeof instance?.isAlive).toBe("function");
            expect(typeof instance?.takeDamage).toBe("function");
        });

        it("should return undefined for non-existent ID", () => {
            const instance = CharacterService.getCharacterInstanceById(9999);
            expect(instance).toBeUndefined();
        });

        it("should return same instance as repository", () => {
            const created = CharacterService.createCharacter({
                name: "SameInstance",
                job: Job.Warrior
            });

            const fromService = CharacterService.getCharacterInstanceById(created.id!);
            const fromRepo = CharacterRepository.findById(created.id!);

            expect(fromService).toBe(fromRepo);
        });
    });

    describe("Character Status Integration", () => {
        it("should show alive status when using isAlive() method", () => {
            const created = CharacterService.createCharacter({
                name: "AliveTest",
                job: Job.Warrior
            });

            const instance = CharacterService.getCharacterInstanceById(created.id!);
            const all = CharacterService.getAllCharacters();
            const status = all.find(c => c.name === "AliveTest")?.status;

            expect(instance?.isAlive()).toBe(true);
            expect(status).toBe("alive");
        });

        it("should show dead status after health reaches 0", () => {
            const created = CharacterService.createCharacter({
                name: "DeadTest",
                job: Job.Warrior
            });

            CharacterService.updateCharacter(created.id!, {
                attributes: { health: 0 }
            });

            const all = CharacterService.getAllCharacters();
            const status = all.find(c => c.name === "DeadTest")?.status;

            expect(status).toBe("dead");
        });
    });
});

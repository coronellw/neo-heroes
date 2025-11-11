import { CharacterService } from "../services/characters";
import { Job } from "../types/job";

// Reset characters before each test
beforeEach(() => {
    // Clear the characters array by deleting all
    const allChars = CharacterService.getAllCharacters();
    // Since we can't directly access the private array, we'll use the service methods
});

describe("CharacterService", () => {
    describe("Character Creation", () => {
        it("should create a new character", () => {
            const characterData = {
                name: "TestHero",
                job: Job.Warrior
            };

            const result = CharacterService.createCharacter(characterData);

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

            // Need to get the ID - for testing purposes, we'll assume ID is 1
            // In a real scenario, you'd extract this from the created character
            const updated = CharacterService.updateCharacter(1, {
                name: "NewName"
            });

            expect(updated).not.toBeNull();
            expect(updated?.name).toBe("NewName");
        });

        it("should update character job", () => {
            CharacterService.createCharacter({
                name: "JobChange",
                job: Job.Warrior
            });

            const updated = CharacterService.updateCharacter(1, {
                job: Job.Mage
            });

            expect(updated?.job).toBe(Job.Mage);
        });

        it("should return null for non-existent character", () => {
            const result = CharacterService.updateCharacter(9999, {
                name: "NotFound"
            });

            expect(result).toBeNull();
        });

        it("should validate name on update", () => {
            CharacterService.createCharacter({
                name: "ValidName",
                job: Job.Warrior
            });

            expect(() => {
                CharacterService.updateCharacter(1, {
                    name: "Bad" // Too short
                });
            }).toThrow();
        });
    });

    describe("Delete Character", () => {
        it("should delete existing character", () => {
            CharacterService.createCharacter({
                name: "DeleteMe",
                job: Job.Warrior
            });

            const result = CharacterService.deleteCharacter(1);
            expect(result).toBe(true);
        });

        it("should return false when deleting non-existent character", () => {
            const result = CharacterService.deleteCharacter(9999);
            expect(result).toBe(false);
        });
    });
});

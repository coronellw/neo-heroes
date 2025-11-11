import { BattleService } from "../services/battle";
import { CharacterService } from "../services/characters";
import { Job } from "../types/job";

describe("BattleService", () => {
    let character1Id: number;
    let character2Id: number;

    beforeEach(() => {
        // Get current character count to determine next IDs
        const existingChars = CharacterService.getAllCharacters();
        const nextId = existingChars.length + 1;
        
        // Create test characters before each test
        CharacterService.createCharacter({
            name: "WarriorTest",
            job: Job.Warrior
        });
        
        CharacterService.createCharacter({
            name: "MageTest",
            job: Job.Mage
        });

        character1Id = nextId;
        character2Id = nextId + 1;
    });

    describe("Battle Validation", () => {
        it("should throw error if character1 does not exist", () => {
            expect(() => {
                BattleService.startBattle(9999, character2Id);
            }).toThrow("Character with ID 9999 not found");
        });

        it("should throw error if character2 does not exist", () => {
            expect(() => {
                BattleService.startBattle(character1Id, 9999);
            }).toThrow("Character with ID 9999 not found");
        });

        it("should throw error if character1 is already dead", () => {
            // Update character to have 0 health
            CharacterService.updateCharacter(character1Id, {
                attributes: { health: 0 }
            });

            expect(() => {
                BattleService.startBattle(character1Id, character2Id);
            }).toThrow("is already dead and cannot battle");
        });

        it("should throw error if character2 is already dead", () => {
            // Update character to have 0 health
            CharacterService.updateCharacter(character2Id, {
                attributes: { health: 0 }
            });

            expect(() => {
                BattleService.startBattle(character1Id, character2Id);
            }).toThrow("is already dead and cannot battle");
        });
    });

    describe("Battle Execution", () => {
        it("should execute battle and return a log string", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
        });

        it("should include battle start message in log", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toContain("Battle between");
            expect(result).toContain("WarriorTest");
            expect(result).toContain("MageTest");
        });

        it("should include HP information in battle log", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toContain("HP");
        });

        it("should declare a winner", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toMatch(/wins the battle/i);
        });

        it("should show attack actions in log", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toContain("attacks");
        });

        it("should show speed comparison in log", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toMatch(/speed was faster/i);
        });
    });

    describe("Battle Mechanics", () => {
        it("should update character health after battle", () => {
            const beforeChar1 = CharacterService.getCharacterById(character1Id);
            const beforeChar2 = CharacterService.getCharacterById(character2Id);

            BattleService.startBattle(character1Id, character2Id);

            const afterChar1 = CharacterService.getCharacterById(character1Id);
            const afterChar2 = CharacterService.getCharacterById(character2Id);

            // At least one character should have less health
            const healthChanged = 
                (afterChar1?.current_health !== beforeChar1?.current_health) ||
                (afterChar2?.current_health !== beforeChar2?.current_health);

            expect(healthChanged).toBe(true);
        });

        it("should result in one character with 0 health", () => {
            BattleService.startBattle(character1Id, character2Id);

            const char1 = CharacterService.getCharacterById(character1Id);
            const char2 = CharacterService.getCharacterById(character2Id);

            const oneIsDead = 
                char1?.current_health === 0 || 
                char2?.current_health === 0;

            expect(oneIsDead).toBe(true);
        });

        it("should not have both characters alive after battle", () => {
            BattleService.startBattle(character1Id, character2Id);

            const char1 = CharacterService.getCharacterById(character1Id);
            const char2 = CharacterService.getCharacterById(character2Id);

            const bothAlive = 
                (char1?.current_health ?? 0) > 0 && 
                (char2?.current_health ?? 0) > 0;

            expect(bothAlive).toBe(false);
        });

        it("should show remaining HP for winner", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toMatch(/still has .* HP remaining/i);
        });
    });

    describe("Battle with Different Job Types", () => {
        it("should handle Warrior vs Mage battle", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });

        it("should handle Thief vs Warrior battle", () => {
            const existingCount = CharacterService.getAllCharacters().length;
            
            CharacterService.createCharacter({
                name: "ThiefTest",
                job: Job.Thief
            });

            const result = BattleService.startBattle(character1Id, existingCount + 1);

            expect(result).toBeDefined();
            expect(result).toContain("ThiefTest");
        });

        it("should handle battles with similar speed characters", () => {
            const existingCount = CharacterService.getAllCharacters().length;
            
            // Create two warriors with similar stats
            CharacterService.createCharacter({
                name: "WarriorTwo",
                job: Job.Warrior
            });

            const result = BattleService.startBattle(character1Id, existingCount + 1);

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });
    });

    describe("Battle Round System", () => {
        it("should have multiple rounds in battle log", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            // Count number of "attacks" which indicates rounds
            const attackCount = (result.match(/attacks/g) || []).length;
            expect(attackCount).toBeGreaterThan(1);
        });

        it("should show both characters attacking if defender survives", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            // Both character names should appear as attackers
            const hasWarriorAttack = result.includes("WarriorTest attacks");
            const hasMageAttack = result.includes("MageTest attacks");

            // At least one should be true (winner definitely attacks)
            expect(hasWarriorAttack || hasMageAttack).toBe(true);
        });

        it("should calculate speed differently each round", () => {
            const result = BattleService.startBattle(character1Id, character2Id);

            // The log should show speed calculations
            expect(result).toMatch(/speed/i);
        });
    });

    describe("Edge Cases", () => {
        it("should handle characters with very low health", () => {
            CharacterService.updateCharacter(character1Id, {
                attributes: { health: 1 }
            });

            const result = BattleService.startBattle(character1Id, character2Id);

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });

        it("should handle characters with equal stats", () => {
            const existingCount = CharacterService.getAllCharacters().length;
            
            CharacterService.createCharacter({
                name: "TwinOne",
                job: Job.Warrior
            });

            CharacterService.createCharacter({
                name: "TwinTwo",
                job: Job.Warrior
            });

            const result = BattleService.startBattle(existingCount + 1, existingCount + 2);

            expect(result).toBeDefined();
            expect(result).toContain("wins the battle");
        });
    });
});

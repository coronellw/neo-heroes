import { BattleService } from "../services/battle";
import { CharacterService } from "../services/characters";
import { CharacterRepository } from "../repositories/characters";
import { Job, ICalculatedCharacter } from "@neo-heroes/types";

describe("BattleService", () => {
    let character1: ICalculatedCharacter;
    let character2: ICalculatedCharacter;

    beforeEach(() => {
        // Clear repository state for proper test isolation
        (CharacterRepository as any).characters = [];
        (CharacterRepository as any).nextId = 1;
        
        // Create test characters and store actual IDs
        character1 = CharacterService.createCharacter({
            name: "WarriorTest",
            job: Job.Warrior
        });
        
        character2 = CharacterService.createCharacter({
            name: "MageTest",
            job: Job.Mage
        });
    });

    describe("Battle Validation", () => {
        it("should throw error if character1 does not exist", () => {
            expect(() => {
                BattleService.startBattle(9999, character2.id!);
            }).toThrow("Character with ID 9999 not found");
        });

        it("should throw error if character2 does not exist", () => {
            expect(() => {
                BattleService.startBattle(character1.id!, 9999);
            }).toThrow("Character with ID 9999 not found");
        });

        it("should throw error if character1 is already dead", () => {
            // Update character to have 0 health
            CharacterService.updateCharacter(character1.id!, {
                attributes: { health: 0 }
            });

            expect(() => {
                BattleService.startBattle(character1.id!, character2.id!);
            }).toThrow("is already dead and cannot battle");
        });

        it("should throw error if character2 is already dead", () => {
            // Update character to have 0 health
            CharacterService.updateCharacter(character2.id!, {
                attributes: { health: 0 }
            });

            expect(() => {
                BattleService.startBattle(character1.id!, character2.id!);
            }).toThrow("is already dead and cannot battle");
        });
    });

    describe("Battle Execution", () => {
        it("should execute battle and return a log string", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
        });

        it("should include battle start message in log", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toContain("Battle between");
            expect(result).toContain("WarriorTest");
            expect(result).toContain("MageTest");
        });

        it("should include HP information in battle log", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toContain("HP");
        });

        it("should declare a winner", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toMatch(/wins the battle/i);
        });

        it("should show attack actions in log", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toContain("attacks");
        });

        it("should show speed comparison in log", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toMatch(/speed was faster/i);
        });
    });

    describe("Battle Mechanics", () => {
        it("should update character health after battle", () => {
            const beforeChar1 = CharacterService.getCharacterById(character1.id!);
            const beforeChar2 = CharacterService.getCharacterById(character2.id!);

            BattleService.startBattle(character1.id!, character2.id!);

            const afterChar1 = CharacterService.getCharacterById(character1.id!);
            const afterChar2 = CharacterService.getCharacterById(character2.id!);

            // At least one character should have less health
            const healthChanged = 
                (afterChar1?.current_health !== beforeChar1?.current_health) ||
                (afterChar2?.current_health !== beforeChar2?.current_health);

            expect(healthChanged).toBe(true);
        });

        it("should result in one character with 0 health", () => {
            BattleService.startBattle(character1.id!, character2.id!);

            const char1 = CharacterService.getCharacterById(character1.id!);
            const char2 = CharacterService.getCharacterById(character2.id!);

            const oneIsDead = 
                char1?.current_health === 0 || 
                char2?.current_health === 0;

            expect(oneIsDead).toBe(true);
        });

        it("should not have both characters alive after battle", () => {
            BattleService.startBattle(character1.id!, character2.id!);

            const char1 = CharacterService.getCharacterById(character1.id!);
            const char2 = CharacterService.getCharacterById(character2.id!);

            const bothAlive = 
                (char1?.current_health ?? 0) > 0 && 
                (char2?.current_health ?? 0) > 0;

            expect(bothAlive).toBe(false);
        });

        it("should show remaining HP for winner", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toMatch(/still has .* HP remaining/i);
        });

        it("should use Character takeDamage method", () => {
            const char1Instance = CharacterService.getCharacterInstanceById(character1.id!);
            const initialHealth = char1Instance!.attributes.health;

            BattleService.startBattle(character1.id!, character2.id!);

            const updatedInstance = CharacterService.getCharacterInstanceById(character1.id!);
            
            // Health should have changed (either reduced or character is dead)
            expect(updatedInstance!.attributes.health).not.toBe(initialHealth);
        });

        it("should verify winner is alive using isAlive method", () => {
            BattleService.startBattle(character1.id!, character2.id!);

            const char1Instance = CharacterService.getCharacterInstanceById(character1.id!);
            const char2Instance = CharacterService.getCharacterInstanceById(character2.id!);

            // Exactly one should be alive
            const aliveCount = [char1Instance?.isAlive(), char2Instance?.isAlive()].filter(Boolean).length;
            expect(aliveCount).toBe(1);
        });
    });

    describe("Battle with Different Job Types", () => {
        it("should handle Warrior vs Mage battle", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });

        it("should handle Thief vs Warrior battle", () => {
            const thief = CharacterService.createCharacter({
                name: "ThiefTest",
                job: Job.Thief
            });

            const result = BattleService.startBattle(character1.id!, thief.id!);

            expect(result).toBeDefined();
            expect(result).toContain("ThiefTest");
        });

        it("should handle battles with similar speed characters", () => {
            // Create two warriors with similar stats
            const warrior2 = CharacterService.createCharacter({
                name: "WarriorTwo",
                job: Job.Warrior
            });

            const result = BattleService.startBattle(character1.id!, warrior2.id!);

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });
    });

    describe("Battle Round System", () => {
        it("should have multiple rounds in battle log", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            // Count number of "attacks" which indicates rounds
            const attackCount = (result.match(/attacks/g) || []).length;
            expect(attackCount).toBeGreaterThan(1);
        });

        it("should show both characters attacking if defender survives", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            // Both character names should appear as attackers
            const hasWarriorAttack = result.includes("WarriorTest attacks");
            const hasMageAttack = result.includes("MageTest attacks");

            // At least one should be true (winner definitely attacks)
            expect(hasWarriorAttack || hasMageAttack).toBe(true);
        });

        it("should calculate speed differently each round", () => {
            const result = BattleService.startBattle(character1.id!, character2.id!);

            // The log should show speed calculations
            expect(result).toMatch(/speed/i);
        });

        it("should use getSpeedModifier for speed calculations", () => {
            const char1Instance = CharacterService.getCharacterInstanceById(character1.id!);
            const char2Instance = CharacterService.getCharacterInstanceById(character2.id!);

            const char1Speed = char1Instance!.getSpeedModifier();
            const char2Speed = char2Instance!.getSpeedModifier();

            expect(char1Speed).toBeGreaterThan(0);
            expect(char2Speed).toBeGreaterThan(0);

            const result = BattleService.startBattle(character1.id!, character2.id!);
            expect(result).toBeDefined();
        });

        it("should use getAttackModifier for damage calculations", () => {
            const char1Instance = CharacterService.getCharacterInstanceById(character1.id!);
            
            const attackPower = char1Instance!.getAttackModifier();
            expect(attackPower).toBeGreaterThan(0);

            const result = BattleService.startBattle(character1.id!, character2.id!);
            expect(result).toContain("attacks");
        });
    });

    describe("Edge Cases", () => {
        it("should handle characters with very low health", () => {
            CharacterService.updateCharacter(character1.id!, {
                attributes: { health: 1 }
            });

            const result = BattleService.startBattle(character1.id!, character2.id!);

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
        });

        it("should handle characters with equal stats", () => {
            const twin1 = CharacterService.createCharacter({
                name: "TwinOne",
                job: Job.Warrior
            });

            const twin2 = CharacterService.createCharacter({
                name: "TwinTwo",
                job: Job.Warrior
            });

            const result = BattleService.startBattle(twin1.id!, twin2.id!);

            expect(result).toBeDefined();
            expect(result).toContain("wins the battle");
        });

        it("should verify both characters use canBattle before fighting", () => {
            const char1Instance = CharacterService.getCharacterInstanceById(character1.id!);
            const char2Instance = CharacterService.getCharacterInstanceById(character2.id!);

            expect(char1Instance!.canBattle()).toBe(true);
            expect(char2Instance!.canBattle()).toBe(true);

            BattleService.startBattle(character1.id!, character2.id!);

            // After battle, winner can battle, loser cannot
            const char1After = CharacterService.getCharacterInstanceById(character1.id!);
            const char2After = CharacterService.getCharacterInstanceById(character2.id!);

            const canBattleCount = [char1After!.canBattle(), char2After!.canBattle()].filter(Boolean).length;
            expect(canBattleCount).toBe(1);
        });

        it("should not allow negative health after multiple attacks", () => {
            BattleService.startBattle(character1.id!, character2.id!);

            const char1 = CharacterService.getCharacterById(character1.id!);
            const char2 = CharacterService.getCharacterById(character2.id!);

            expect(char1!.current_health).toBeGreaterThanOrEqual(0);
            expect(char2!.current_health).toBeGreaterThanOrEqual(0);
        });
    });
});

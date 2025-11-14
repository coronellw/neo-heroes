import { CharacterRepository } from "../repositories/characters";
import Character from "../models/characters";
import { Job } from "@neo-heroes/types";

describe("CharacterRepository", () => {
    // Helper to clear repository state between tests
    beforeEach(() => {
        // Access the private characters array and clear it
        // This is a test-only approach to reset state
        (CharacterRepository as any).characters = [];
        (CharacterRepository as any).nextId = 1;
    });

    describe("findAll()", () => {
        it("should return empty array when no characters exist", () => {
            const characters = CharacterRepository.findAll();

            expect(characters).toEqual([]);
            expect(characters.length).toBe(0);
        });

        it("should return all saved characters", () => {
            const warrior = new Character({ name: "Warrior1", job: Job.Warrior });
            const mage = new Character({ name: "Mage1", job: Job.Mage });

            CharacterRepository.save(warrior);
            CharacterRepository.save(mage);

            const all = CharacterRepository.findAll();

            expect(all.length).toBe(2);
            expect(all[0].name).toBe("Warrior1");
            expect(all[1].name).toBe("Mage1");
        });
    });

    describe("findById()", () => {
        it("should return character with matching id", () => {
            const warrior = new Character({ name: "FindMe", job: Job.Warrior });
            const saved = CharacterRepository.save(warrior);

            const found = CharacterRepository.findById(saved.id!);

            expect(found).toBeDefined();
            expect(found?.name).toBe("FindMe");
            expect(found?.id).toBe(saved.id);
        });

        it("should return undefined for non-existent id", () => {
            const found = CharacterRepository.findById(9999);

            expect(found).toBeUndefined();
        });

        it("should find correct character among multiple", () => {
            const char1 = CharacterRepository.save(new Character({ name: "First", job: Job.Warrior }));
            const char2 = CharacterRepository.save(new Character({ name: "Second", job: Job.Mage }));
            const char3 = CharacterRepository.save(new Character({ name: "Third", job: Job.Thief }));

            const found = CharacterRepository.findById(char2.id!);

            expect(found?.name).toBe("Second");
            expect(found?.job).toBe(Job.Mage);
        });
    });

    describe("save()", () => {
        it("should assign auto-incrementing id to new character", () => {
            const warrior = new Character({ name: "NewWarrior", job: Job.Warrior });
            
            expect(warrior.id).toBeUndefined();
            
            const saved = CharacterRepository.save(warrior);

            expect(saved.id).toBe(1);
            expect(warrior.id).toBe(1);
        });

        it("should increment id for each saved character", () => {
            const char1 = new Character({ name: "First", job: Job.Warrior });
            const char2 = new Character({ name: "Second", job: Job.Mage });
            const char3 = new Character({ name: "Third", job: Job.Thief });

            const saved1 = CharacterRepository.save(char1);
            const saved2 = CharacterRepository.save(char2);
            const saved3 = CharacterRepository.save(char3);

            expect(saved1.id).toBe(1);
            expect(saved2.id).toBe(2);
            expect(saved3.id).toBe(3);
        });

        it("should add character to repository", () => {
            const warrior = new Character({ name: "Added", job: Job.Warrior });

            expect(CharacterRepository.findAll().length).toBe(0);
            
            CharacterRepository.save(warrior);

            expect(CharacterRepository.findAll().length).toBe(1);
        });

        it("should return the saved character", () => {
            const warrior = new Character({ name: "Returned", job: Job.Warrior });
            const saved = CharacterRepository.save(warrior);

            expect(saved).toBe(warrior);
            expect(saved.name).toBe("Returned");
        });
    });

    describe("update()", () => {
        it("should update existing character", () => {
            const warrior = new Character({ name: "Original", job: Job.Warrior });
            const saved = CharacterRepository.save(warrior);

            const updated = new Character({ name: "Updated", job: Job.Mage });
            updated.id = saved.id;

            const result = CharacterRepository.update(saved.id!, updated);

            expect(result).toBe(true);
            
            const found = CharacterRepository.findById(saved.id!);
            expect(found?.name).toBe("Updated");
            expect(found?.job).toBe(Job.Mage);
        });

        it("should return false for non-existent id", () => {
            const warrior = new Character({ name: "DoesNotExist", job: Job.Warrior });
            warrior.id = 9999;

            const result = CharacterRepository.update(9999, warrior);

            expect(result).toBe(false);
        });

        it("should not change repository size on update", () => {
            const char1 = CharacterRepository.save(new Character({ name: "Char1", job: Job.Warrior }));
            const char2 = CharacterRepository.save(new Character({ name: "Char2", job: Job.Mage }));

            expect(CharacterRepository.findAll().length).toBe(2);

            const updated = new Character({ name: "Char1Updated", job: Job.Warrior });
            updated.id = char1.id;
            CharacterRepository.update(char1.id!, updated);

            expect(CharacterRepository.findAll().length).toBe(2);
        });

        it("should preserve character id during update", () => {
            const warrior = new Character({ name: "Original", job: Job.Warrior });
            const saved = CharacterRepository.save(warrior);
            const originalId = saved.id;

            const updated = new Character({ name: "Updated", job: Job.Warrior });
            updated.id = originalId;
            CharacterRepository.update(originalId!, updated);

            const found = CharacterRepository.findById(originalId!);
            expect(found?.id).toBe(originalId);
        });
    });

    describe("delete()", () => {
        it("should delete existing character", () => {
            const warrior = new Character({ name: "DeleteMe", job: Job.Warrior });
            const saved = CharacterRepository.save(warrior);

            expect(CharacterRepository.findAll().length).toBe(1);

            const result = CharacterRepository.delete(saved.id!);

            expect(result).toBe(true);
            expect(CharacterRepository.findAll().length).toBe(0);
        });

        it("should return false for non-existent id", () => {
            const result = CharacterRepository.delete(9999);

            expect(result).toBe(false);
        });

        it("should remove only the specified character", () => {
            const char1 = CharacterRepository.save(new Character({ name: "Keep1", job: Job.Warrior }));
            const char2 = CharacterRepository.save(new Character({ name: "Delete", job: Job.Mage }));
            const char3 = CharacterRepository.save(new Character({ name: "Keep2", job: Job.Thief }));

            CharacterRepository.delete(char2.id!);

            const remaining = CharacterRepository.findAll();
            expect(remaining.length).toBe(2);
            expect(remaining.find(c => c.id === char1.id)).toBeDefined();
            expect(remaining.find(c => c.id === char3.id)).toBeDefined();
            expect(remaining.find(c => c.id === char2.id)).toBeUndefined();
        });

        it("should make character unfindable after deletion", () => {
            const warrior = new Character({ name: "WillBeDeleted", job: Job.Warrior });
            const saved = CharacterRepository.save(warrior);

            CharacterRepository.delete(saved.id!);

            const found = CharacterRepository.findById(saved.id!);
            expect(found).toBeUndefined();
        });
    });

    describe("Edge Cases", () => {
        it("should handle multiple save and delete operations", () => {
            const char1 = CharacterRepository.save(new Character({ name: "Char1", job: Job.Warrior }));
            const char2 = CharacterRepository.save(new Character({ name: "Char2", job: Job.Mage }));
            
            CharacterRepository.delete(char1.id!);
            
            const char3 = CharacterRepository.save(new Character({ name: "Char3", job: Job.Thief }));

            expect(CharacterRepository.findAll().length).toBe(2);
            expect(CharacterRepository.findById(char1.id!)).toBeUndefined();
            expect(CharacterRepository.findById(char2.id!)).toBeDefined();
            expect(CharacterRepository.findById(char3.id!)).toBeDefined();
        });

        it("should maintain id uniqueness after deletions", () => {
            const char1 = CharacterRepository.save(new Character({ name: "Char1", job: Job.Warrior }));
            CharacterRepository.delete(char1.id!);
            
            const char2 = CharacterRepository.save(new Character({ name: "Char2", job: Job.Mage }));

            // New character should have a different ID even after deletion
            expect(char2.id).not.toBe(char1.id);
            expect(char2.id).toBeGreaterThan(char1.id!);
        });
    });
});

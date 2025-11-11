# Neo Hero - RPG Character Battle System

A simple TypeScript-based RPG game API that allows you to create characters, manage their attributes, and simulate battles between them.

## 🚀 Features

- **Character Management**: Create, read, update, and delete RPG characters
- **Three Job Classes**: Warrior, Mage, and Thief with unique stats
- **Battle System**: Turn-based combat with speed and attack modifiers
- **Type-Safe**: Built with TypeScript for enhanced code quality
- **Unit Tested**: Comprehensive test coverage with Jest
- **RESTful API**: Clean and intuitive HTTP endpoints

## 📋 Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Character Endpoints](#character-endpoints)
  - [Battle Endpoints](#battle-endpoints)
- [Character Jobs](#character-jobs)
- [Battle Mechanics](#battle-mechanics)
- [Testing](#testing)
- [Project Structure](#project-structure)

## 🔧 Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## 🏃 Getting Started

### Development Mode
```bash
npm run dev
```
The server will start at `http://localhost:5555`

### Production Mode
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Character Endpoints

#### **GET** `/api/characters`
Get all characters with their name, job, and status (alive/dead).

**Response:**
```json
[
  {
    "name": "Hero_Warrior",
    "job": "WARRIOR",
    "status": "alive"
  }
]
```

---

#### **GET** `/api/characters/:id`
Get detailed information about a specific character including calculated battle modifiers.

**Response:**
```json
{
  "name": "Hero_Warrior",
  "job": "WARRIOR",
  "current_health": 20,
  "max_health": 20,
  "stats": {
    "strength": 10,
    "dexterity": 5,
    "intelligence": 5
  },
  "battle_modifiers": {
    "attack_modifier": {
      "value": 9.0,
      "description": "80% of strength + 20% of dexterity"
    },
    "speed_modifier": {
      "value": 4.0,
      "description": "60% of dexterity + 20% of intelligence"
    }
  }
}
```

---

#### **POST** `/api/characters`
Create a new character.

**Request Body:**
```json
{
  "name": "Hero_Warrior",
  "job": "WARRIOR"
}
```

**Validation Rules:**
- Name must be 4-15 characters long
- Name can only contain letters and underscores
- Job must be one of: `WARRIOR`, `MAGE`, `THIEF`

```json
{
  "name": "Hero_Warrior",
  "job": "WARRIOR",
  "attributes": {
    "hp": 30,
    "health": 30,
    "strength": 15,
    "dexterity": 8,
    "intelligence": 7,
    "attack_modifier": {
      "multipliers": {
        "strength": 1.0,
        "dexterity": 0.3
      }
    },
    "speed_modifier": {
      "multipliers": {
        "dexterity": 0.7
      }
    }
  }
}
```

**Response:** Same as GET `/api/characters/:id`

---

#### **PUT** `/api/characters/:id`
Update an existing character. Supports partial updates.

**Request Body:**
```json
{
  "name": "Updated_Hero",
  "job": "MAGE",
  "attributes": {
    "health": 15
  }
}
```

**Response:** Updated character details

---

#### **DELETE** `/api/characters/:id`
Delete a character.

**Response:** `204 No Content` on success

---

### Battle Endpoints

#### **POST** `/api/battle`
Start a battle between two characters.

**Request Body:**
```json
{
  "characterId1": 1,
  "characterId2": 2
}
```

**Validation:**
- Both characters must exist
- Both characters must be alive (health > 0)
- Characters cannot battle themselves

**Response:**
```
Battle between Hero_Warrior (WARRIOR) - 20 HP and Magic_User (MAGE) - 12 HP begins!

Hero_Warrior 3.84 speed was faster than Magic_User 0.66 speed and will attack first.
Hero_Warrior attacks Magic_User for 8.06. Magic_User has 3.94 HP remaining.
Magic_User attacks Hero_Warrior for 3.82. Hero_Warrior has 16.18 HP remaining.

Magic_User 1.62 speed was faster than Hero_Warrior 1.39 speed and will attack first.
Magic_User attacks Hero_Warrior for 6.68. Hero_Warrior has 9.50 HP remaining.
Hero_Warrior attacks Magic_User for 6.89. Magic_User has 0.00 HP remaining.

Hero_Warrior wins the battle! Hero_Warrior still has 9.50 HP remaining!
```

**Note:** Character health is permanently updated after battle.

---

## ⚔️ Character Jobs

### Warrior
- **HP:** 20
- **Strength:** 10
- **Dexterity:** 5
- **Intelligence:** 5
- **Attack:** 80% strength + 20% dexterity
- **Speed:** 60% dexterity + 20% intelligence

### Mage
- **HP:** 12
- **Strength:** 5
- **Dexterity:** 6
- **Intelligence:** 10
- **Attack:** 20% strength + 20% dexterity + 120% intelligence
- **Speed:** 40% dexterity + 10% strength

### Thief
- **HP:** 15
- **Strength:** 4
- **Dexterity:** 10
- **Intelligence:** 4
- **Attack:** 25% strength + 100% dexterity + 25% intelligence
- **Speed:** 80% dexterity

---

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### Test Coverage
- **Character Model**: 9 tests
- **Character Service**: 19 tests
- **Battle Service**: 23 tests
- **Total:** 51 tests

---

## 📝 Examples

See `test.http` for complete API examples that can be run with the REST Client VS Code extension.

---

## 👤 Author

**Wiston Coronell**

---

## 📄 License

ISC

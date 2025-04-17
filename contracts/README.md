## 📋 Functions and Associated Events

| **Function**                    | **Event**                                        | **Type**     |
|---------------------------------|--------------------------------------------------|--------------|
| 🔒 `start_game(players)`        | `GameStarted { players: [AztecAddress; 3] }`     | 📣 Public     |
|                                 | Emission of `Note<PlayerState>` per player       | 🔐 Private    |
|                                 |                                                  |              |
| 🔒 `play_turn(action, target?)` | `PlayerHasPlayed { player, turn }`               | 📣 Public     |
|                                 | `TurnPlayed { player, action, target? }`         | 🔐 Private    |
|                                 | `YouWereAttacked { attacker, turn }`             | 🔐 Private    |
|                                 |                                                  |              |
| 🔒 `claim_victory()`            | `VictoryClaimed { player }`                      | 📣 Public     |
|                                 | `GameEnded { winner }`                           | 📣 Public     |
|                                 | `YouWonTheGame { turn, position }`               | 🔐 Private    |
|                                 |                                                  |              |
| 🔓 `advance_turn()`             | `TurnAdvanced { new_turn }`                      | 📣 Public     |
|                                 | `DisclosureRevealed { turn, disclosed }`         | 📣 Public     |
|                                 |                                                  |              |
| 🔓 `get_current_turn()`         | —                                                | —             |
| 🔓 `get_disclosure_flag()`      | —                                                | —             |
| 🔓 `get_winner()`               | —                                                | —             |

---

### 🔍 Legend

- 🔒 = Private function  
- 🔓 = Public function  
- 📣 = Public event (via `encode_event`)  
- 🔐 = Private event (via `encode_and_encrypt_event`)


## Sequence Diagram
```mermaid
sequenceDiagram
    participant FrontendA as 🧑 Frontend A (Player A)
    participant FrontendB as 🧑 Frontend B (Player B)
    participant API as 🛠 API (Turn Keeper)
    participant Contract as 📜 LadderWar Contract

    %% 1. Game initialization
    API->>Contract: start_game([A, B, C])
    Note right of Contract: emits 📣 GameStarted(players)<br/>stores PlayerState notes for each player
    Contract-->>FrontendA: 📣 GameStarted([...])
    Contract-->>FrontendB: 📣 GameStarted([...])

    %% 2. Player A takes turn
    FrontendA->>Contract: play_turn(Climb)
    Note right of Contract: 🔐 TurnPlayed(A), 📣 PlayerHasPlayed(A)<br/>updates state & note
    Contract-->>FrontendA: 🔐 You advanced 1 step

    %% 3. Player B takes turn
    FrontendB->>Contract: play_turn(Attack, target=A)
    Note right of Contract: 🔐 TurnPlayed(B), 📣 PlayerHasPlayed(B)<br/>modifies A’s note
    Contract-->>FrontendA: 🔐 YouWereAttacked(B)

    %% 4. API advances the turn
    API->>Contract: advance_turn()
    Note right of Contract: 📣 TurnAdvanced(N+1)
    Contract-->>FrontendA: 📣 TurnAdvanced(N+1)
    Contract-->>FrontendB: 📣 TurnAdvanced(N+1)

    alt every 5 turns
        Contract-->>FrontendA: 📣 DisclosureRevealed(disclosed = true/false)
        Contract-->>FrontendB: 📣 DisclosureRevealed(disclosed = true/false)
    end

    %% 5. Player A reaches step 20 and wins
    FrontendA->>Contract: play_turn(Climb)
    FrontendA->>Contract: claim_victory()
    Note right of Contract: 🔐 YouWonTheGame<br/>📣 VictoryClaimed, 📣 GameEnded
    Contract-->>FrontendA: 📣 VictoryClaimed(A), 📣 GameEnded(winner=A)
    Contract-->>FrontendB: 📣 VictoryClaimed(A), 📣 GameEnded(winner=A)
```

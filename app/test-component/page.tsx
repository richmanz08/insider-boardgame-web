"use client";
import { DraftRoleCard } from "@/src/components/card/DraftRoleCard";
import { RoleGame } from "@/src/hooks/interface";
import { useState } from "react";

export default function TestComponentPage() {
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  return (
    <div>
      <DraftRoleCard
        isCardFlipped={isCardFlipped}
        onFlipCard={() => setIsCardFlipped(!isCardFlipped)}
        my={{
          role: RoleGame.MASTER,
          answer: "New york", // MASTER จะรู้คำตอบที่แท้จริง
        }}
        activeGame={{
          id: "aaa", // UUID string
          roomCode: "222",
          roles: { "222": RoleGame.MASTER }, // playerUuid -> role name
          startedAt: null, // ISO string (server LocalDateTime.toString())
          endsAt: null, // ISO string
          durationSeconds: 0,
          finished: false,
          cardOpened: {},
          privateMessage: null,
          votes: {},
          playerInGame: [],
          summary: null,
          word: "",
          wordRevealed: false,
        }}
      />
      <DraftRoleCard
        isCardFlipped={isCardFlipped}
        onFlipCard={() => setIsCardFlipped(!isCardFlipped)}
        my={{
          role: RoleGame.INSIDER,
          answer: "New york", // MASTER จะรู้คำตอบที่แท้จริง
        }}
        activeGame={{
          id: "aaa", // UUID string
          roomCode: "222",
          roles: { "222": RoleGame.MASTER }, // playerUuid -> role name
          startedAt: null, // ISO string (server LocalDateTime.toString())
          endsAt: null, // ISO string
          durationSeconds: 0,
          finished: false,
          cardOpened: {},
          privateMessage: null,
          votes: {},
          playerInGame: [],
          summary: null,
          word: "",
          wordRevealed: false,
        }}
      />
      <DraftRoleCard
        isCardFlipped={isCardFlipped}
        onFlipCard={() => setIsCardFlipped(!isCardFlipped)}
        my={{
          role: RoleGame.CITIZEN,
          answer: "", // MASTER จะรู้คำตอบที่แท้จริง
        }}
        activeGame={{
          id: "aaa", // UUID string
          roomCode: "222",
          roles: { "222": RoleGame.MASTER }, // playerUuid -> role name
          startedAt: null, // ISO string (server LocalDateTime.toString())
          endsAt: null, // ISO string
          durationSeconds: 0,
          finished: false,
          cardOpened: {},
          privateMessage: null,
          votes: {},
          playerInGame: [],
          summary: null,
          word: "",
          wordRevealed: false,
        }}
      />
    </div>
  );
}

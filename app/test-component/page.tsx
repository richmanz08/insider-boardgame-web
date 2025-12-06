"use client";
import { DraftRoleCard } from "@/src/components/card/DraftRoleCard";
import { MatchResult } from "@/src/containers/scoreboard/MatchResult";
import { VotePlayer } from "@/src/containers/vote/VotePlayer";
import { RoleGame } from "@/src/hooks/interface";
import { useState } from "react";

// export default function TestComponentPage() {
//   const [isCardFlipped, setIsCardFlipped] = useState(false);

//   return (
//     <div>
//       <DraftRoleCard
//         isCardFlipped={isCardFlipped}
//         onFlipCard={() => setIsCardFlipped(!isCardFlipped)}
//         my={{
//           role: RoleGame.MASTER,
//           answer: "New york", // MASTER จะรู้คำตอบที่แท้จริง
//         }}
//         activeGame={{
//           id: "aaa", // UUID string
//           roomCode: "222",
//           roles: { "222": RoleGame.MASTER }, // playerUuid -> role name
//           startedAt: null, // ISO string (server LocalDateTime.toString())
//           endsAt: null, // ISO string
//           durationSeconds: 0,
//           finished: false,
//           cardOpened: {},
//           privateMessage: null,
//           votes: {},
//           playerInGame: [],
//           summary: null,
//           word: "",
//           wordRevealed: false,
//         }}
//       />
//       <DraftRoleCard
//         isCardFlipped={isCardFlipped}
//         onFlipCard={() => setIsCardFlipped(!isCardFlipped)}
//         my={{
//           role: RoleGame.INSIDER,
//           answer: "New york", // MASTER จะรู้คำตอบที่แท้จริง
//         }}
//         activeGame={{
//           id: "aaa", // UUID string
//           roomCode: "222",
//           roles: { "222": RoleGame.MASTER }, // playerUuid -> role name
//           startedAt: null, // ISO string (server LocalDateTime.toString())
//           endsAt: null, // ISO string
//           durationSeconds: 0,
//           finished: false,
//           cardOpened: {},
//           privateMessage: null,
//           votes: {},
//           playerInGame: [],
//           summary: null,
//           word: "",
//           wordRevealed: false,
//         }}
//       />
//       <DraftRoleCard
//         isCardFlipped={isCardFlipped}
//         onFlipCard={() => setIsCardFlipped(!isCardFlipped)}
//         my={{
//           role: RoleGame.CITIZEN,
//           answer: "", // MASTER จะรู้คำตอบที่แท้จริง
//         }}
//         activeGame={{
//           id: "aaa", // UUID string
//           roomCode: "222",
//           roles: { "222": RoleGame.MASTER }, // playerUuid -> role name
//           startedAt: null, // ISO string (server LocalDateTime.toString())
//           endsAt: null, // ISO string
//           durationSeconds: 0,
//           finished: false,
//           cardOpened: {},
//           privateMessage: null,
//           votes: {},
//           playerInGame: [],
//           summary: null,
//           word: "",
//           wordRevealed: false,
//         }}
//       />
//     </div>
//   );
// }

// export default function TestComponentPage() {
//   return (
//     <VotePlayer
//       onMyVote={(playerUuid: string) => {}}
//       onHostSummary={() => {}}
//       onVoteFinished={() => {}}
//       activeGame={{
//         id: "aaa", // UUID string
//         roomCode: "222",
//         roles: {
//           "222": RoleGame.CITIZEN,
//           "333": RoleGame.INSIDER,
//           "444": RoleGame.MASTER,
//           "555": RoleGame.CITIZEN,
//           "666": RoleGame.CITIZEN,
//           "777": RoleGame.CITIZEN,
//           "888": RoleGame.CITIZEN,
//           "999": RoleGame.CITIZEN,
//         }, // playerUuid -> role name
//         startedAt: null, // ISO string (server LocalDateTime.toString())
//         endsAt: null, // ISO string
//         durationSeconds: 0,
//         finished: false,
//         cardOpened: {},
//         privateMessage: {
//           playerUuid: "222",
//           role: RoleGame.MASTER,
//           word: "New york",
//         },
//         votes: {
//           "333": "222",
//           "444": "222",
//           "555": "222",
//           "666": "222",
//         },
//         playerInGame: [
//           { uuid: "222", playerName: "Daniel" },
//           { uuid: "333", playerName: "Jesse" },
//           { uuid: "444", playerName: "Amorin" },
//           { uuid: "555", playerName: "natarika" },
//           { uuid: "666", playerName: "Chinnawut kaewchim" },
//           { uuid: "777", playerName: "Player7" },
//           { uuid: "888", playerName: "Player8" },
//           { uuid: "999", playerName: "Player9" },
//         ],
//         summary: {
//           scores: {
//             "222": 10,
//             "333": 0,
//             "444": 5,
//             "555": 0,
//             "666": 0,
//           },
//           voteTally: {
//             "222": 4,
//             "777": 0,
//             "888": 0,
//             "999": 0,
//           },
//           mostVoted: ["222"],
//           insiderCaught: true, // INSIDER ถูกจับได้
//           citizensAnsweredCorrectly: true, // CITIZENs ตอบถูก
//           insiderUuid: "333",
//           masterUuid: "444",
//           word: "New york",
//         },
//         // summary: null,
//         word: "New york",
//         wordRevealed: true,
//       }}
//     />
//   );
// }

export default function TestComponentPage() {
  return (
    <MatchResult
      activeGame={{
        id: "aaa", // UUID string
        roomCode: "222",
        roles: {
          "222": RoleGame.CITIZEN,
          "333": RoleGame.INSIDER,
          "444": RoleGame.MASTER,
          "555": RoleGame.CITIZEN,
          "666": RoleGame.CITIZEN,
          "777": RoleGame.CITIZEN,
          "888": RoleGame.CITIZEN,
          "999": RoleGame.CITIZEN,
        }, // playerUuid -> role name
        startedAt: "2023-03-15T12:00:00Z", // ISO string (server LocalDateTime.toString())
        endsAt: "2023-03-15T12:30:00Z", // ISO string
        durationSeconds: 0,
        finished: false,
        cardOpened: {},
        privateMessage: {
          playerUuid: "222",
          role: RoleGame.MASTER,
          word: "New york",
        },
        votes: {
          "333": "222",
          "444": "222",
          "555": "222",
          "666": "222",
        },
        playerInGame: [
          { uuid: "222", playerName: "Daniel" },
          { uuid: "333", playerName: "Jesse" },
          { uuid: "444", playerName: "Amorin" },
          { uuid: "555", playerName: "natarika" },
          { uuid: "666", playerName: "Chinnawut kaewchim" },
          { uuid: "777", playerName: "Player7" },
          { uuid: "888", playerName: "Player8" },
          { uuid: "999", playerName: "Player9" },
        ],
        summary: {
          scores: {
            "222": 10,
            "333": 0,
            "444": 5,
            "555": 0,
            "666": 0,
          },
          voteTally: {
            "222": 4,
            "777": 0,
            "888": 0,
            "999": 0,
          },
          mostVoted: ["222"],
          insiderCaught: true, // INSIDER ถูกจับได้
          citizensAnsweredCorrectly: true, // CITIZENs ตอบถูก
          insiderUuid: "333",
          masterUuid: "444",
          word: "New york",
        },
        word: "New york",
        wordRevealed: true,
      }}
      onBackToRooms={() => {}}
    />
  );
}

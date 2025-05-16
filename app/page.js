"use client";
import React, { useState } from "react";
import BoardList from "@/components/BoardList";
import Image from "next/image";

import { Plus } from "lucide-react";
import CreateBoardModal from "../components/CreateBoardModal"; // Step 3
import { useBoards } from "./context/BoardContext";
export default function HomePage() {
  const { boards, createBoard, deleteBoard, updateBoard } = useBoards();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredBoards = boards.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="relative min-h-screen">
        <div className="fixed top-0 left-0 p-4">
          <Image src="/Frame 2796.png" alt="Logo" width={80} height={80} />
        </div>

        <div className="flex justify-end items-center gap-2 mb-6 mt-6">
          <input
            type="text"
            placeholder="Search boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-72"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
            title="Create New Board"
          >
            <Plus />
          </button>
        </div>

        <BoardList
          boards={filteredBoards}
          deleteBoard={deleteBoard}
          updateBoard={updateBoard}
        />

        <CreateBoardModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={createBoard}
        />

      </div>
    </main>
  );
}

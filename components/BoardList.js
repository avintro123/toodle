"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Save, X } from "lucide-react";

export default function BoardList({ boards, deleteBoard, updateBoard }) {
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [hasMounted, setHasMounted] = useState(false);

    //useEffect to set hasMounted to true after the component mounts
    useEffect(() => {
        setHasMounted(true);
    }, [])

    if (!hasMounted) {
        return null
    }

    const startEdit = (board) => {
        setEditingId(board.id)
        setEditingTitle(board.title);
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditingTitle("")
    };

    const saveEdit = (boardId) => {
        if (!editingTitle.trim()) return alert("Title can't be empty");
        updateBoard(boardId, editingTitle.trim())
        cancelEdit();
    }

    if (boards.length === 0) {
        return <p className="text-center text-gray-500">No boards found</p>
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {boards.map((board) => (
                <div
                    key={board.id}
                    className="group relative rounded-xl shadow-md transition hover:shadow-xl p-4"
                    style={{ backgroundColor: board.color }}
                >
                    {editingId === board.id ? (
                        <>
                            <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                className='w-full mb-4 px-3 py-2 border rounded text-black'
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => saveEdit(board.id)}
                                    className="text-green-700 hover:text-green-900"
                                    title="Save"
                                >
                                    <Save size={20} />
                                </button>

                                // Cut btn
                                <button
                                    onClick={cancelEdit}
                                    className="text-gray-600 hover:text-gray-800"
                                    title="Cancel"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </>
                    ) :
                        // Display the board title and edit/delete buttons
                        (
                            <>
                                <Link
                                    href={`/board/${board.id}`}
                                    className="block text-xl font-semibold text-gray-800 hover:text-red-600 capitalize"
                                >
                                    {board.title}
                                </Link>

                                {/* Edit/Delete buttons appear only on hover */}
                                <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                                    {/* // Edit button */}
                                    <button
                                        onClick={() => startEdit(board)}
                                        className="text-gray-600 hover:text-yellow-600"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    {/* // Delete button */}
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this board?")) deleteBoard(board.id)
                                        }}

                                        className="text-gray-600 hover:text-red-600"
                                        title="Delete"
                                    >

                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                </div>
            )
            )}
        </div>
    );
}

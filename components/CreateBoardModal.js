"use client";

import React, { useState, useEffect } from "react";

const colors = [
    "#FEE2E2", "#FEF9C3", "#DCFCE7", "#E0E7FF", "#F3E8FF", "#FFE4E6", "#CCFBF1"
];

export default function CreateBoardModal({ isOpen, onClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [visible, setVisible] = useState(false);

    // When isOpen changes, trigger visible to true/false with delay for animation
    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            // Delay unmount after animation
            const timeout = setTimeout(() => setVisible(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!visible) return null;

    function handleCreate() {
        if (!title.trim()) return alert("Enter a board title");
        onCreate(title.trim(), selectedColor);
        onClose();
    }

    return (
        // Overlay
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center
        bg-black transition-opacity duration-500
        ${isOpen ? "bg-opacity-10" : "bg-opacity-0"}
      `}
            onClick={onClose}
        >
            {/* Modal Box */}
            <div
                className={`bg-white p-6 rounded-lg shadow-lg w-96 relative
          transition-all duration-500
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Add a name for your board</h2>

                <input
                    type="text"
                    placeholder="Board title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border px-3 py-2 mb-4 rounded"
                />

                <div className="mb-4">
                    <p className="mb-2">Select Post color:</p>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map((color) => (
                            <button
                                key={color}
                                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

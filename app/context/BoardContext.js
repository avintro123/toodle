"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const BoardContext = createContext();

export function BoardProvider({ children }) {
    const [boards, setBoards] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("boards");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("boards", JSON.stringify(boards));
    }, [boards]);

    // Color palette
    const colors = [
        "#FEE2E2", // light red
        "#FEF9C3", // light yellow
        "#DCFCE7", // light green
        "#E0E7FF", // light blue
        "#F3E8FF", // light purple
        "#FFE4E6", // pink
        "#CCFBF1", // teal
    ];

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ✅ Accept title and optional color
    const createBoard = (title, color = null) => {
        const newBoard = {
            id: uuidv4(),
            title,
            color: color || getRandomColor(), // use provided color or fallback
            posts: [],
        };
        setBoards((prev) => [...prev, newBoard]);
    };

    function updateBoard(id, title) {
        setBoards((b) =>
            b.map((board) => (board.id === id ? { ...board, title } : board))
        );
    }

    function deleteBoard(id) {
        setBoards((b) => b.filter((board) => board.id !== id));
    }

    function createPost(boardId, title, content, image = null) {
        setBoards((prevBoards) =>
            prevBoards.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        posts: [
                            ...board.posts,
                            {
                                id: crypto.randomUUID(),
                                title,
                                content,
                                likes: 0,
                                image, // store the image
                            },
                        ],
                    }
                    : board
            )
        );
    }


    function updatePost(boardId, postId, title, content) {
        setBoards((b) =>
            b.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        posts: board.posts.map((post) =>
                            post.id === postId ? { ...post, title, content } : post
                        ),
                    }
                    : board
            )
        );
    }

    function deletePost(boardId, postId) {
        setBoards((b) =>
            b.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        posts: board.posts.filter((post) => post.id !== postId),
                    }
                    : board
            )
        );
    }

    function likePost(boardId, postId) {
        setBoards((b) =>
            b.map((board) =>
                board.id === boardId
                    ? {
                        ...board,
                        posts: board.posts.map((post) =>
                            post.id === postId
                                ? { ...post, likes: post.likes + 1 }
                                : post
                        ),
                    }
                    : board
            )
        );
    }

    return (
        <BoardContext.Provider
            value={{
                boards,
                createBoard,
                updateBoard,
                deleteBoard,
                createPost,
                updatePost,
                deletePost,
                likePost,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export function useBoards() {
    return useContext(BoardContext);
}

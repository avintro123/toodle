"use client";

import React, { useState, use } from "react";
import { useBoards } from "../../context/BoardContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// SVG Icons
const BookmarkIcon = () => (
    <svg className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx={11} cy={11} r={7} strokeLinecap="round" strokeLinejoin="round" />
        <line x1={21} y1={21} x2={16.65} y2={16.65} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5h2m1 2l6 6-7 7-6-6 7-7z" />
    </svg>
);

const DeleteIcon = () => (
    <svg className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function BoardPage({ params }) {
    const { id } = use(params);
    const { boards, createPost, updatePost, deletePost, likePost } = useBoards();

    const board = boards.find((b) => b.id === id);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    if (!board) return <p className="p-4">Board not found</p>;

    const filteredPosts = board.posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    function handleCreatePost() {
        if (!newPostTitle.trim()) return alert("Enter post title");

        createPost(id, newPostTitle.trim(), newPostContent.trim(), imagePreview);

        setNewPostTitle("");
        setNewPostContent("");
        setImageFile(null);
        setImagePreview(null);
        setShowCreateForm(false);
    }

    function startEditing(post) {
        setEditingPostId(post.id);
        setEditTitle(post.title);
        setEditContent(post.content);
    }

    function saveEdit() {
        updatePost(id, editingPostId, editTitle.trim(), editContent.trim());
        setEditingPostId(null);
    }

    function cancelEdit() {
        setEditingPostId(null);
    }

    return (
        <main className="max-w-3xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold">{board.title}</h1>
                <div className="flex items-center space-x-2">
                    <button title="Bookmark" aria-label="Bookmark">
                        <BookmarkIcon />
                    </button>
                    <span className="select-none">|</span>
                    <button title="Search" aria-label="Search" onClick={() => setShowSearch((prev) => !prev)}>
                        <SearchIcon />
                    </button>
                </div>
            </div>

            {/* Search */}
            {showSearch && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        autoFocus
                    />
                </div>
            )}

            {/* Navigation */}
            <Link href="/" className="inline-block text-blue-600 mb-4 hover:underline">
                ← Back to Boards
            </Link>

            {/* Create Post Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-red-600 text-white w-10 h-10 rounded-full text-xl flex items-center justify-center hover:bg-green-700"
                    title="Create Post"
                >
                    +
                </button>
            </div>

            {/* Create Post Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
                        <input
                            type="text"
                            placeholder="New post title"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <textarea
                            placeholder="New post content"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="border rounded px-3 py-2 w-full resize-y"
                            rows={4}
                        />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="max-h-48 rounded border object-contain" />
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => setImagePreview(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={handleCreatePost} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Post
                            </button>
                            <button onClick={() => setShowCreateForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPosts.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-center p-10 text-gray-500">
                        <Image src={"/empty.png"} alt="no" className="w-40 h-40 mb-4y" width={60} height={60} />
                        <p className="text-lg font-semibold">No posts found</p>
                        <p className="text-sm text-gray-400">Try creating a new post using the + button above.</p>

                    </div>
                )}
                {filteredPosts.map((post) =>
                    editingPostId === post.id ? (
                        <li key={post.id} className="border rounded p-4 bg-gray-50">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="border rounded px-2 py-1 w-full mb-2"
                            />
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="border rounded px-2 py-1 w-full mb-2 resize-y"
                                rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={saveEdit} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                    Save
                                </button>
                                <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                                    Cancel
                                </button>
                            </div>
                        </li>
                    ) : (
                        <li key={post.id} className="border rounded p-4 bg-white flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                <div className="flex gap-3 items-center">
                                    <button onClick={() => likePost(id, post.id)} title="Like" className="text-red-500 hover:text-red-700">
                                        ❤️ {post.likes}
                                    </button>
                                    <button onClick={() => startEditing(post)} title="Edit" aria-label="Edit post">
                                        <EditIcon />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this post?")) deletePost(id, post.id);
                                        }}
                                        title="Delete"
                                        aria-label="Delete post"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                            {post.content && <p>{post.content}</p>}
                            {post.image && (
                                <img src={post.image} alt="Post image" className="mt-2 rounded max-h-64 object-cover border" />
                            )}
                        </li>
                    )
                )}
            </ul>
        </main>
    );
}

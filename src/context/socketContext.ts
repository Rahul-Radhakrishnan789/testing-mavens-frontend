import React, { createContext, useState, useEffect, useContext,type ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';



interface WebSocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    saveStatus: 'saving' | 'saved' | 'error';
    joinNote: (noteId: string) => void;
    leaveNote: (noteId: string) => void;
    editNote: (noteId: string, content: string, title: string, tag: string) => void;
    onNoteUpdate: (callback: (data: { noteId: string; content: string; title: string; tag: string }) => void) => void;
    offNoteUpdate: (callback: (data: { noteId: string; content: string; title: string; tag: string }) => void) => void;
}

// Create the context with a default undefined value initially
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

// Props for the WebSocketProvider component
interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
    const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved'); // 'saving', 'saved', 'error'

    const MAX_RECONNECT_ATTEMPTS = 5;
    // Type the useSelector hook to correctly infer the user state shape
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;

    console.log(user, 'user id from redux'); // Debugging line to check user ID

    // Use useCallback for connectSocket to prevent unnecessary re-creations
    const connectSocket = useCallback(() => {
        // Update with your actual backend URL
        const socketUrl = "http://localhost:5000";

        const newSocket: Socket = io(socketUrl, {
            transports: ["websocket", "polling"],
            upgrade: true
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket.IO connection established");
            setIsConnected(true);
            setReconnectAttempts(0);
        });

        newSocket.on("disconnect", (reason: Socket.DisconnectReason) => {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);

            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                setTimeout(() => {
                    console.log("Attempting to reconnect...");
                    setReconnectAttempts((prev) => prev + 1);
                    connectSocket(); // Recursive call
                }, 2000);
            }
        });

        newSocket.on("connect_error", (error: Error) => {
            console.log("Socket connection error:", error.message); // Access error message
        });

        // Handle note save confirmations
        newSocket.on('note-saved', (data: { noteId: string; userId: string }) => {
            console.log('Note saved successfully:', data);
            setSaveStatus('saved');
        });

        newSocket.on('note-save-error', (data: { error: string }) => {
            console.error('Note save error:', data.error);
            setSaveStatus('error');
        });

        // Clean up event listeners and socket on unmount or re-connection
        return () => {
            newSocket.off("connect");
            newSocket.off("disconnect");
            newSocket.off("connect_error");
            newSocket.off("note-saved");
            newSocket.off("note-save-error");
            newSocket.close(); // Use .close() for explicit socket closure
        };
    }, [reconnectAttempts]); // Dependency array for useCallback

    useEffect(() => {
        if (user?.id) {
            const cleanup = connectSocket(); // Call connectSocket and store its cleanup function
            return () => {
                if (cleanup) {
                    cleanup(); // Execute the cleanup function returned by connectSocket
                }
            };
        }
    }, [user?.id, connectSocket]); // Add connectSocket to the dependency array

    // Note collaboration methods
    const joinNote = useCallback((noteId: string) => {
        if (socket && isConnected) {
            socket.emit('join-note', noteId);
        }
    }, [socket, isConnected]);

    const leaveNote = useCallback((noteId: string) => {
        if (socket && isConnected) {
            socket.emit('leave-note', noteId);
        }
    }, [socket, isConnected]);

    const editNote = useCallback((noteId: string, content: string, title: string, tag: string) => {
        if (socket && isConnected) {
            setSaveStatus('saving');
            socket.emit('edit-note', { noteId, content, title, tag });
        }
    }, [socket, isConnected]);

    type NoteUpdateCallback = (data: { noteId: string; content: string; title: string; tag: string }) => void;

    const onNoteUpdate = useCallback((callback: NoteUpdateCallback) => {
        if (socket) {
            socket.on('note-updated', callback);
        }
    }, [socket]);

    const offNoteUpdate = useCallback((callback: NoteUpdateCallback) => {
        if (socket) {
            socket.off('note-updated', callback);
        }
    }, [socket]);

    const contextValue: WebSocketContextType = {
        socket,
        isConnected,
        saveStatus,
        joinNote,
        leaveNote,
        editNote,
        onNoteUpdate,
        offNoteUpdate
    };

    return React.createElement(
        WebSocketContext.Provider,
        { value: contextValue },
        children
    );
};

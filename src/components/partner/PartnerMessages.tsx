import React, { useState, useEffect, useRef, useCallback } from "react";
import { chatsApi, Message, Conversation, Chat } from "@/lib/api";

interface PartnerMessagesProps {
  token: string;
}

const PartnerMessages: React.FC<PartnerMessagesProps> = ({ token }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatsApi.getConversations(token);
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      try {
        const data = await chatsApi.getMessages(token, conversationId);
        // Convert Chat[] to Message[] format
        const formattedMessages: Message[] = data.map((chat: Chat) => ({
          id: chat.id,
          conversationId: conversationId,
          content: chat.message_content,
          senderId: chat.sender_id,
          senderName: chat.sender?.full_name || 'Unknown',
          senderRole: chat.sender?.role?.toLowerCase() || 'user',
          timestamp: chat.sent_at,
          imageUrl: undefined, // Add if Chat entity has image field
        }));
        setMessages(formattedMessages);

        // Mark messages as read
        await chatsApi.markAsRead(token, conversationId);

        // Update conversation unread count
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
          ),
        );
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },
    [token],
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConversation || (!newMessage.trim() && !imageFile)) {
      return;
    }

    setSending(true);

    try {
      const messageData = {
        receiver_id: 1, // This should be the actual receiver ID from conversation
        message: newMessage,
        booking_id: undefined, // Optional booking ID
      };

      await chatsApi.sendMessage(token, messageData);

      // Reset form
      setNewMessage("");
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh messages
      await fetchMessages(selectedConversation);
      await fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Có lỗi xảy ra khi gửi tin nhắn!");
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }
      setImageFile(file);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const startNewConversation = async () => {
    try {
      const conversation = await chatsApi.createConversation(token, {
        participant_id: 1, // Admin user ID - this should come from props or context
        booking_id: undefined, // Optional booking ID
      });
      await fetchConversations();
      setSelectedConversation(conversation.id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      alert("Có lỗi xảy ra khi tạo cuộc trò chuyện!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="h-96 flex border border-gray-200 rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Tin nhắn</h3>
          <button
            onClick={() => startNewConversation()}
            className="w-full bg-pink-600 text-white px-3 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
          >
            Nhắn tin với Admin
          </button>
        </div>

        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                  selectedConversation === conversation.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm text-gray-800">
                    {conversation.participantName}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {conversation.participantRole === "admin"
                        ? "Admin"
                        : "Khách hàng"}
                      )
                    </span>
                  </h4>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {conversation.lastMessageTime && formatTime(conversation.lastMessageTime)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderRole === "partner"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.senderRole === "partner"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {message.senderName} - {formatTime(message.timestamp)}
                    </div>
                    {message.imageUrl && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={message.imageUrl}
                          alt="Attachment"
                          className="max-w-full h-auto rounded mb-2"
                        />
                      </>
                    )}
                    {message.content && (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="space-y-2">
                {imageFile && (
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    <span className="text-sm text-gray-600">
                      Ảnh đã chọn: {imageFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    📷
                  </button>

                  <button
                    type="submit"
                    disabled={sending || (!newMessage.trim() && !imageFile)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50"
                  >
                    {sending ? "..." : "Gửi"}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu nhắn tin
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerMessages;

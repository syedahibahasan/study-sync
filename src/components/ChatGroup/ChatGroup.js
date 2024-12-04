import React, { useState } from "react";
import { PlaneIcon, ArrowLeftIcon} from "lucide-react";
import { useAuth } from "../../hooks/useauth";
import "./ChatGroup.css";

export default function ChatGroup({ group, onBack, userId, onDeleteGroup, onSendMessage }) {
  const { user, deleteGroup } = useAuth();
  const [message, setMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const isAdmin = group.createdBy === userId;

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); // Clear the input field
    }
  };

  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(user._id, groupId);
      onBack(); // Navigate back after successful deletion
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };
  
  

  return (
    <div className="chat-group-container">
      {/* Header with Back Button and Group Name */}
      <div className="group-header">
      <div className="tooltip-container">
        <button className="back-button" onClick={onBack}>
        < ArrowLeftIcon />
        </button>
        <span className="tooltip-text">Back</span>
        </div>
        <div className="tooltip-container">
        <h3 className="group-name" onClick={toggleGroupInfo}>
          {group.name}
        </h3>
        <span className="tooltip-text">Group-Info</span>
        </div>
      </div>

      {/* Group Info Popup */}
      {showGroupInfo && (
  <div className="group-info-popup">
    <div className="group-info-header">
      <h3>Group Info</h3>
      <button className="close-popup" onClick={toggleGroupInfo}>
        ×
      </button>
    </div>
    <div className="group-info-content">
        <p><strong>Course:</strong> {group.courseName}</p>
        <p><strong>Time:</strong> {group.time}</p>
        <p><strong>Location:</strong> {group.location}</p>
        <p><solid>_________________________________________</solid></p>
        <p><strong>Admin:</strong> {group.admin?.username}</p>
        <p><strong>Members:</strong></p>
        <ul>
            {group.members?.map((member) => (
            <li key={member._id}>{member.username}</li>
            ))}
        </ul>
            {isAdmin && (
              <div className="tooltip-container">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteGroup(group._id)}
                >
                  Delete Group
                </button>
                <span className="tooltip-text">
                  Only admin can delete group!
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-messages">
        {group.messages && group.messages.length > 0 ? (
          group.messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === userId ? "outgoing" : "incoming"}`}
            >
              <span className="sender">{msg.senderName}</span>
              <p>{msg.text}</p>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="tooltip-container">
        <button className="send-button" onClick={handleSendMessage}>
        <PlaneIcon />
        </button>
        <span className="tooltip-text">Send</span>
        </div>
      </div>
    </div>
  );
}

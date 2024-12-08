import React, { useState, useEffect } from "react";
import { PlaneIcon, SendHorizontal, ArrowLeftIcon, InfoIcon, Trash2 } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "../../hooks/useauth";
import { useParams, useNavigate } from "react-router-dom";
import "./ChatGroup.css";

// Initialize socket connection
const socket = io("http://localhost:5001");

export default function ChatGroup({ userId }) {
  const { groupId } = useParams(); // Fetch groupId from URL
  const { user, deleteGroup, leaveGroup, removeGroupUser, sendMessage, fetchGroupDetails } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const isAdmin = group && (group.admin?._id === user._id);

  // Fetch group details and messages
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupData = await fetchGroupDetails(groupId);
    setGroup(groupData);

    // Normalize sender field in messages
    const normalizedMessages = groupData.messages.map((msg) => ({
      ...msg,
      sender: typeof msg.sender === "object" ? msg.sender._id.toString() : msg.sender, // Ensure sender is a string
    }));
    setMessages(normalizedMessages);
  } catch (error) {
    console.error("Failed to load group details:", error);
  }
};
    // Fetch data
    fetchGroupData();
  
    // Join the group room
    socket.emit("joinGroup", groupId);
  
    // Listen for new messages
    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, sender: newMessage.sender.toString() }, // Normalize sender to string
      ]);
    };
    
    socket.on("newMessage", handleNewMessage);
  
    // Cleanup on component unmount
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveGroup", groupId); // Leave the room
    };
  }, [groupId, fetchGroupDetails]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          groupId,
          sender: user._id,
          senderName: user.username,
          text: message,
        };

        // Emit the message through the socket
        socket.emit("sendMessage", newMessage);

        // Save the message to the database
        await sendMessage(groupId, message);

        setMessage(""); // Clear input field
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Handle keypress in the input field
const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent default form submission
    handleSendMessage();
  }
};

  // Handle deleting the group
  const handleDeleteGroup = async () => {
    try {
        console.log("Group Data:", group); // Debugging
        console.log("User ID:", user._id); // Debugging
        console.log("Group Admin ID:", group.admin); // Debugging

        if (group.admin?._id === user._id) {
            await deleteGroup(user._id, group._id);

            // Update UI - remove from local group state or navigate
            setGroup(null); // Clear group data
            navigate("/userdashboard"); // Redirect after deletion
        } else {
            console.error("User is not authorized to delete this group.");
        }
    } catch (error) {
        console.error("Error deleting group:", error);
    }
  };

  // Handle remove user from group
  const handleRemoveGroupUser = async (deletedUser) => {
    try {

        if (group.admin?._id === user._id) {
            await removeGroupUser(user._id, deletedUser._id, group._id);

            // Update UI - remove from local group state or navigate
            setGroup(null); // Clear group data
            navigate("/userdashboard"); // Redirect after deletion
        } else {
            console.error("User is not authorized to remove other users.");
        }
    } catch (error) {
        console.error("Error removing user:", error);
    }
  };

  // Handle leave the group
  const handleLeaveGroup = async () => {
    try {
      
      await leaveGroup(user._id, group._id);
      navigate("/userdashboard")

    } catch (error) {
        console.error("Error deleting group:", error);
    }
  };


  const toggleGroupInfo = () => setShowGroupInfo(!showGroupInfo);

  if (!group) return <p>Loading group details...</p>;

  return (
    <div className="chat-group-container">
      {/* Header */}
      <div className="group-header">
  <div className="tooltip-container">
    <button
      className="back-button"
      onClick={() => navigate("/userdashboard")}
    >
      <ArrowLeftIcon />
    </button>
    <span className="tooltip-text">Back</span>

      </div>
      <h3 className="group-name">
        {group.name}
      </h3>
      <div className="tooltip-container info-button-container">
        <button
          className="info-button"
          onClick={toggleGroupInfo}
          aria-label="Group Info"
        >
          <InfoIcon />
        </button>
        <span className="tooltip-text">Group Info</span>
      </div>
    </div>

      {/* Group Info */}
      {showGroupInfo && (
        <div className="group-info-popup">
          <div className="group-info-header">
            <h3>Group Info</h3>
            <button className="close-popup" onClick={toggleGroupInfo}>
              ×
            </button>
          </div>
          <div className="group-info-content">
            <p>
              <strong>Course:</strong> {group.courseName}
            </p>
            <p>
              <strong>Time:</strong> {group.time} 
            </p>

            <div className="scrollable-context">
              {group.selectedTimes.map((schedule) => (
                <div key={schedule._id} style={{ marginBottom: "20px" }}>
                  <p>{schedule.day}</p>
                  <ul>
                    {schedule.times.map((time, index) => (
                    <li key={index}>{time}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p>
              <strong>Location:</strong> {group.location}
            </p>
            <p>
              <strong>Admin:</strong> {group.admin?.username}
            </p>
            <p>
              <strong>Members:</strong>
            </p>
            <ul>
              {group.members?.map((member) => (
                <li key={member._id}>{member.username} {isAdmin && (<button className="close-popup" onClick={() => handleRemoveGroupUser(member)}> × </button>)}</li> 
                
              ))}
            </ul>
            {isAdmin ? (
              <div className="tooltip-container">
                <button
                  className="delete-button"
                  onClick={handleDeleteGroup}
                >
                  <Trash2/>
                </button>
                <span className="tooltip-text">
                  Delete Group!
                </span>
              </div>
            ):(
              <div className="tooltip-container">
              <button
                className="delete-button"
                onClick={handleLeaveGroup}
              >
                Leave Group
              </button>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-messages">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`message ${msg.sender === user._id ? "outgoing" : "incoming"}`}
    >
      <span className="sender">{msg.senderName}</span>
      <p>{msg.text}</p>
      <span className="timestamp">
        {new Date(msg.timestamp).toLocaleString()}
      </span>
    </div>
  ))}
</div>

      {/* Message Input */}
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for Enter key
        />
        <div className="tooltip-container info-button-container">
        <button className="send-button" onClick={handleSendMessage}>
          <SendHorizontal />
        </button>
        <span className="tooltip-text">Send</span>
      </div>
    </div>
    </div>
  );
}

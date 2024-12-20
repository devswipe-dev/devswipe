import React, { FormEvent, useState, ChangeEvent, useEffect } from "react";
import "./Settings.css";
import Tabs from "./components/Tabs";
import { apiCall, User } from "./util/constants";
import { AttributesInput } from "./components/AttributesInput";

interface SettingsProp {
  chatNotifications: number;
  fetchUserStatus: () => Promise<void>;
  user: User | null;
}

const SettingsPage: React.FC<SettingsProp> = ({ chatNotifications, fetchUserStatus, user}: SettingsProp) => {

  const [bio, setBio] = useState<string>("");
  const [oldAttributesList, setOldAttributesList] = useState<string[]>([]);
  const [attributesList, setAttributesList] = useState<string[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const resetFields = () => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setBio(user.bio);
      setOldAttributesList([...user.attributes]);
    } else {
      setFirstName('');
      setLastName('');
      setBio('');
      setOldAttributesList([]);
    }
  }

  useEffect(() => {
    resetFields();
  }, [user]);
 
  const handleSave = async () => {
    try {
      // Validate input
      if (!firstName || !lastName || !bio) {
        alert("Please fill in all required fields.");
        return;
      }

      // Call the update user API
      const response = await apiCall.post("/user/update", {
        firstName,
        lastName,
        bio,
      });

      // Handle attributes separately

      for (const attribute of attributesList) {
        if (user && !user.attributes.includes(attribute)) {
          await apiCall.post("/user/attribute/add", { attribute: attribute });
        }
      }

      if (user) {
        for (const attribute of user.attributes) {
          if (!attributesList.includes(attribute)) {
            await apiCall.post("/user/attribute/delete", { attribute: attribute });
          }
        }
      }

      if (response.status === 200) {
        // alert("Profile updated successfully!");
        await fetchUserStatus();
        resetFields();
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };

  const handleCancel = () => {
    resetFields();
  };

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiCall.post("/login/logout");
      if (response.status === 200) {
        fetchUserStatus();
      }
    } catch (error) {
      console.log(error);
    }
    };

  // Input Handlers
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);
  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);
  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBio(e.target.value);

  const handleUndoAllLeftSwipes = async(e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiCall.post("/projects/undo-all-left-swipes");
      if (response.status === 200) {
        alert("Success!");
        fetchUserStatus();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="settings-page">
      {/* Tabs */}
      <Tabs chatNotifications={chatNotifications} currentTab="settings" />

      {/* Main Settings Content */}
      <div className="settings-container">
        <h1>Account Settings</h1>

        {/* User Information */}
        <div className="section">
          <h2>User Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder={user ? user.username : ''}
                
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder={user ? user.email : ''}
                readOnly // Make it read-only
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="section">
          <h2>Bio</h2>
          <textarea
            placeholder="Write a short bio about yourself"
            value={bio}
            onChange={handleBioChange}
          />
        </div>

        {/* Attributes */}
        <div className="section">
          <h2>Attributes</h2>
          {/* AttributesInput Component */}
          <AttributesInput
            oldAttributesList={oldAttributesList}
            setAttributesList={setAttributesList}
            limit={7}
            placeholder="Search and select attributes"
          />
        </div>

        {/* Action Buttons */}
        <div className="settings-actions-container">
          {/* Log Out Button */}
          <div className="logout-actions">
            <button className="log-out-btn" onClick={handleLogout}>
              Log Out
            </button>
            <button className="undo-btn" onClick={handleUndoAllLeftSwipes}>
              Undo all Left Swipes
              </button>
          </div>

          {/* Cancel and Save Buttons */}
          <div className="settings-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

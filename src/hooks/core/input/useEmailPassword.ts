import { useState } from "react";

export const useEmailPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };
  const handleUsernameChange = (newUsername: string) =>
    setUsername(newUsername);
  const handleConfirmPasswordChange = (newConfirmPassword: string) =>
    setConfirmPassword(newConfirmPassword);
  const handleNameChange = (newName: string) => setName(newName);
  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    confirmPassword,
    name,
    username,
    handleConfirmPasswordChange,
    handleUsernameChange,
    handleNameChange,
  };
};

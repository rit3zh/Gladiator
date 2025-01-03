export const validateName = (name: string | undefined): boolean => {
  if (name === undefined || name === null || name.trim() === "") {
    toast({
      title: "Invalid Name",
      message: "Name is required.",
      haptic: "error",
      preset: "error",
    });
    return false;
  }
  if (name.length > 32) {
    toast({
      title: "Invalid Name Length",
      message: "Name cannot be more than 32 characters long.",
      haptic: "error",
      preset: "error",
    });
    return false;
  }
  return true;
};
import { toast } from "@baronha/ting";

export const validateAge = (age: number | undefined): boolean => {
  if (age === undefined || age === null) {
    toast({
      title: "Invalid Age",
      message: "Age is required.",
      haptic: "error",
      preset: "error",
    });
    return false;
  }

  const ageNumber = Number(age);
  if (isNaN(ageNumber) || ageNumber < 10 || ageNumber > 65) {
    toast({
      title: "Invalid Age",
      message: "Age must be a valid number between 10 and 65.",
      haptic: "error",
      preset: "error",
    });
    return false;
  }
  return true;
};

export const validateBio = (bio: string | undefined): boolean => {
  if (bio === undefined || bio === null || bio.trim() === "") {
    toast({
      title: "Invalid Bio",
      message: "Bio is required.",
      haptic: "error",
      preset: "error",
    });
    return false;
  }
  if (bio.length < 50) {
    toast({
      title: "Invalid Bio Length",
      message: "Bio must be at least 50 characters long.",
      haptic: "error",
      preset: "error",
    });
    return false;
  }
  return true;
};

export const validateProfile = (
  age: number | undefined,
  name: string | undefined,
  bio: string | undefined
): boolean => {
  return validateName(name) && validateAge(age) && validateBio(bio);
};

export const validateBasicMagicProfile = (
  age: number | undefined,
  name: string | undefined
): boolean => {
  return validateName(name) && validateAge(age);
};

"use client"

export interface DropDownProps {
  notifications: Notification[];
  showDropDown: boolean;
  toggleDropDown: () => void; // Correct the function type definition if needed
}

export interface Notification {
  postId: string;
  userId: string;
  Type: string;
  FromUserId: string;
  Text: string;
  Time: string;
}

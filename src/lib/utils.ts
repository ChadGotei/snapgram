import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export function timeAgo(dateString: string): string {
  const date: Date = new Date(dateString);
  const now: Date = new Date();

  const secondsAgo: number = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutesAgo: number = Math.floor(secondsAgo / 60);
  const hoursAgo: number = Math.floor(minutesAgo / 60);
  const daysAgo: number = Math.floor(hoursAgo / 24);
  const weeksAgo: number = Math.floor(daysAgo / 7);
  const monthsAgo: number = Math.floor(daysAgo / 30);
  const yearsAgo: number = Math.floor(daysAgo / 365);

  if (yearsAgo > 0) {
      return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
  } else if (monthsAgo > 0) {
      return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
  } else if (weeksAgo > 0) {
      return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
  } else if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (minutesAgo > 0) {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else {
      return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
  }
}



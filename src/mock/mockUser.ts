export type User = {
  name: string;
  bio: string;
  icon: string;
  socialLink: string[];
};

export const mockUser: User[] = [
  {
    name: "motoki",
    bio: "これはユーザーの説明欄です",
    icon: "/logo.png",
    socialLink: [
      "https://youtube.com",
      "https://twitter.com",
      "https://google.com",
      "https://instagram.com",
    ],
  },
  {
    name: "masaki",
    bio: "これはユーザーの説明欄です",
    icon: "/logo.png",
    socialLink: [
      "https://youtube.com",
      "https://twitter.com",
      "https://google.com",
      "https://instagram.com",
    ],
  },
  {
    name: "taturou",
    bio: "これはユーザーの説明欄です",
    icon: "/logo.png",
    socialLink: [
      "https://youtube.com",
      "https://twitter.com",
      "https://google.com",
      "https://instagram.com",
    ],
  },
];

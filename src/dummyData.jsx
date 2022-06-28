import { getDefaultNormalizer } from "@testing-library/react";
import pfp from "./tempasset/1.jpeg";
import ball from "./tempasset/ball.jpeg"

export const Users = [
    {
      id:1,
      name: "JS114",
      email: "example@gmail.com",
      profilePicture: pfp,
      username: "John Smith",
    },
  ];
  
  export const Posts = [
    {
      id: 1,
      desc: "Random post",
      photo: ball,
      date: "19 mins ago",
      userId: 1,
      like: 32,
      comment: 9,
    },
];
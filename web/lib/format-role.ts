import { Role, Type } from "@prisma/client";

export const formatRole = (role: Role) => {
  switch (role) {
    case "member":
      return "Member";
    case "owner":
      return "Owner";
    default:
      return role;
  }
};

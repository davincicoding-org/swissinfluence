import type { Access, AccessArgs } from "payload";

import type { User } from "@/payload-types";

export const anyone: Access = () => true;

type isAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user);
};

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};

export const withAccess =
  (access: keyof NonNullable<User["access"]>): isAuthenticated =>
  ({ req: { user } }) =>
    user?.access?.[access] ?? false;

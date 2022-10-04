var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var auth_exports = {};
__export(auth_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(auth_exports);
var import_db = require("../lib/db");
var import_api = require("@redwoodjs/api");
const handler = async (event, context) => {
  const forgotPasswordOptions = {
    handler: (user) => {
      return user;
    },
    expires: 60 * 60 * 24,
    errors: {
      usernameNotFound: "Username not found",
      usernameRequired: "Username is required"
    }
  };
  const loginOptions = {
    handler: (user) => {
      return user;
    },
    errors: {
      usernameOrPasswordMissing: "Both username and password are required",
      usernameNotFound: "Username ${username} not found",
      incorrectPassword: "Incorrect password for ${username}"
    },
    expires: 60 * 60 * 24 * 365 * 10
  };
  const resetPasswordOptions = {
    handler: (user) => {
      return user;
    },
    allowReusedPassword: true,
    errors: {
      resetTokenExpired: "resetToken is expired",
      resetTokenInvalid: "resetToken is invalid",
      resetTokenRequired: "resetToken is required",
      reusedPassword: "Must choose a new password"
    }
  };
  const signupOptions = {
    handler: ({
      username,
      hashedPassword,
      salt,
      userAttributes
    }) => {
      return import_db.db.user.create({
        data: {
          email: username,
          hashedPassword,
          salt
        }
      });
    },
    errors: {
      fieldMissing: "${field} is required",
      usernameTaken: "Username `${username}` already in use"
    }
  };
  const authHandler = new import_api.DbAuthHandler(event, context, {
    db: import_db.db,
    authModelAccessor: "user",
    authFields: {
      id: "id",
      username: "email",
      hashedPassword: "hashedPassword",
      salt: "salt",
      resetToken: "resetToken",
      resetTokenExpiresAt: "resetTokenExpiresAt"
    },
    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
    cookie: {
      HttpOnly: true,
      Path: "/",
      SameSite: "Strict",
      Secure: true
    }
  });
  return await authHandler.invoke();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=auth.js.map

//import UserType from './types/users';

declare module Express {
  export interface Request {
    user: {
      id: number;
    };
  }
}

// declare global to extend the global types
// declare global {
//   // Extend the `Express` namespace
//   namespace Express {
//     // Extend the User interface with out user type that will be declared in another file (maybe `./types/users.d.ts`)
//     interface User extends UserType {}
//   }
// }

// Add export so the file is interpreted as a `module`
// export {};
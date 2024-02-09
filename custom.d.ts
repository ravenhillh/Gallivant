// declare namespace Express {
//   export interface User {
//      id?: number
//   }
// }

// declare global {
//   namespace Express {
//     interface User {
//       id?: number
//     }
//   }
// }

declare module Express {
  export interface Request {
    user: {
      id: number;
    };
  }
}
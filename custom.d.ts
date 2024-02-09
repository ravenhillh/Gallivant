// declare namespace Express {
//   export interface User {
//      id?: number
//   }
// }

declare global {
  namespace Express {
    interface User {
      id?: number
    }
  }
}
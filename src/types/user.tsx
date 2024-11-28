export interface UserToAdd {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photo?: string;
}

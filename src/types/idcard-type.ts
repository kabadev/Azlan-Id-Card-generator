export interface Rider {
  id: string;
  surName: string;
  firstName: string;
  middleName?: string;
  sex: "Male" | "Female";
  district: string;
  dateOfBirth: string;
  park: string;
  photo: string;
  userId: string;
  type: string;
  designation?: string;
  isPrinted?: boolean;
}

export interface Rider {
  id: string;
  surName: string;
  firstName: string;
  middleName?: string;
  sex: "Male" | "Female" | "Other";
  district: string;
  dateOfBirth: string;
  park: string;
  photo: string;
  userId: string;
  type: string;
  isPrinted?: boolean;
}

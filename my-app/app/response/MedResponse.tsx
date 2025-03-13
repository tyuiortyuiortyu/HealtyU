import { ErrorSchema } from "../models/ErrorSchema";

// Define structure for MedSchedule (schedule data associated with the medicine)
export interface MedSchedule {
  id: string; // Schedule ID
  time_to_take: string; // Time to take the medicine
  monday: boolean; // Whether the medicine is taken on Monday
  tuesday: boolean; // Whether the medicine is taken on Tuesday
  wednesday: boolean; // Whether the medicine is taken on Wednesday
  thursday: boolean; // Whether the medicine is taken on Thursday
  friday: boolean; // Whether the medicine is taken on Friday
  saturday: boolean; // Whether the medicine is taken on Saturday
  sunday: boolean; // Whether the medicine is taken on Sunday
}

// Define structure for Medicine (medicine data)
export interface Medicine {
  id: string; // Medicine ID
  med_name: string; // Medicine name
  unit_id: number; // Unit ID (mg, ml)
  med_dose: number; // Dose amount
  type: string; // Medicine type (e.g., Pil, Sirup, etc.)
  schedules: MedSchedule[]; // Array of schedules for this medicine
}

// Define structure for API response
export class MedResponse {
  error_schema: ErrorSchema; // Schema for error
  output_schema: {
    medications: Medicine[]; // Array of medications with schedules
  };

  constructor(
    error_schema: ErrorSchema,
    output_schema: {
      medications: Medicine[];
    }
  ) {
    this.error_schema = error_schema;
    this.output_schema = output_schema;
  }
}

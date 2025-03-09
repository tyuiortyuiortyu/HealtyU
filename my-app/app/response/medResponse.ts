import { ErrorSchema } from "../models/ErrorSchema";

// Definisi struktur data untuk obat
export interface Medication {
  id: string; // ID obat (dari backend)
  name: string; // Nama obat
  dose: string; // Dosis obat
  type: string; // Jenis obat (Pil, Sirup, dll.)
  date: string; // Tanggal pengingat
  time: string; // Waktu pengingat
  image: string | null; // Gambar obat (opsional)
}

// Definisi struktur respons API untuk obat
export class MedResponse {
  error_schema: ErrorSchema; // Schema untuk error
  output_schema: {
    medications: Medication[]; // Array daftar obat
  };

  constructor(
    error_schema: ErrorSchema,
    output_schema: {
      medications: Medication[];
    }
  ) {
    this.error_schema = error_schema;
    this.output_schema = output_schema;
  }
}
"use client";

import { Pill } from "lucide-react";
import MedicationsTab from "../dashboard/MedicationsTab";
import { usePatient } from "../_context/PatientContext";

export default function PatientMedications() {
  const { profile } = usePatient();

  return (
    <div>
      <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight flex items-center gap-3">
        <Pill size={28} className="text-teal-500" /> Medications
      </h2>
      <MedicationsTab profile={profile} />
    </div>
  );
}

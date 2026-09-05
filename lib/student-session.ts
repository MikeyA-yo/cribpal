"use client";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  university?: string;
  level?: string;
  userType: "student";
}

export interface ReservedHostel {
  id: string;
  name: string;
  price: number;
  location: string;
  image: string;
  reservedAt: string;
  status: "Pending Physical Inspection" | "Ready for Payment" | "Booked";
}

const DEMO_STUDENT: StudentUser = {
  id: "student-demo-01",
  name: "Tunde Bakare",
  email: "tunde.bakare@student.unilag.edu.ng",
  university: "University of Lagos (UNILAG)",
  level: "300 Level • Pharmacy",
  userType: "student",
};

export function getLocalStudent(): StudentUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("cribpal_student_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function loginLocalStudent(custom?: Partial<StudentUser>): StudentUser {
  const user = { ...DEMO_STUDENT, ...custom };
  if (typeof window !== "undefined") {
    localStorage.setItem("cribpal_student_user", JSON.stringify(user));
    document.cookie = `cribpal_student_logged_in=true; path=/; max-age=604800`;
  }
  return user;
}

export function logoutLocalStudent(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cribpal_student_user");
    localStorage.removeItem("cribpal_reserved_hostel");
    document.cookie = `cribpal_student_logged_in=; path=/; max-age=0`;
  }
}

export function getLocalReservedHostel(): ReservedHostel | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("cribpal_reserved_hostel");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setLocalReservedHostel(hostel: Partial<ReservedHostel>): void {
  if (typeof window !== "undefined") {
    const full = {
      id: hostel.id || "hostel-1",
      name: hostel.name || "Emerald Court Luxury Suites",
      price: hostel.price || 380000,
      location: hostel.location || "UNILAG (Akoka, Lagos)",
      image: hostel.image || "/room1.jpg",
      reservedAt: new Date().toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending Physical Inspection" as const,
      ...hostel,
    };
    localStorage.setItem("cribpal_reserved_hostel", JSON.stringify(full));
  }
}

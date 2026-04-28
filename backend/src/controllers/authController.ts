import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Patient from '../models/Patient';
import Doctor from '../models/Doctor';
import generateToken from '../utils/generateToken';

// ── PATIENT REGISTER (minimal – profile completed later) ────────────────────
export const registerPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, contactNumber } = req.body;

    if (!name || !email || !password || !contactNumber) {
      res.status(400).json({ message: 'Name, email, password and contact are required.' });
      return;
    }

    const patientExists = await Patient.findOne({ email });
    if (patientExists) { res.status(400).json({ message: 'Patient already exists' }); return; }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const patientId = `PID-${Math.floor(10000 + Math.random() * 90000)}`;

    const patient = await Patient.create({ patientId, name, email, passwordHash, contactNumber });

    if (patient) {
      generateToken(res, patient._id as unknown as string, 'patient');
      res.status(201).json({
        _id: patient._id,
        id: patient.patientId,
        name: patient.name,
        email: patient.email,
        role: 'patient',
        isProfileCompleted: false,  // <-- first-login flag
      });
    } else {
      res.status(400).json({ message: 'Invalid patient data' });
    }
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ message: error.message });
    else res.status(500).json({ message: 'Server error' });
  }
};

// ── DOCTOR REGISTER (minimal – profile completed later) ─────────────────────
export const registerDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, contactNumber } = req.body;

    if (!name || !email || !password || !contactNumber) {
      res.status(400).json({ message: 'Name, email, password and contact are required.' });
      return;
    }

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) { res.status(400).json({ message: 'Doctor already exists' }); return; }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doctorId = `DOC-${Math.floor(10000 + Math.random() * 90000)}`;

    const doctor = await Doctor.create({
      doctorId, name, email, passwordHash, contactNumber, blockedDates: []
    });

    if (doctor) {
      generateToken(res, doctor._id as unknown as string, 'doctor');
      res.status(201).json({
        _id: doctor._id,
        id: doctor.doctorId,
        name: doctor.name,
        email: doctor.email,
        role: 'doctor',
        isProfileCompleted: false,  // <-- first-login flag
      });
    } else {
      res.status(400).json({ message: 'Invalid doctor data' });
    }
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ message: error.message });
    else res.status(500).json({ message: 'Server error' });
  }
};

// ── LOGIN ────────────────────────────────────────────────────────────────────
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    let user: any = null;
    if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    } else {
      user = await Patient.findOne({ email });
    }

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      generateToken(res, user._id as unknown as string, role);
      res.json({
        _id: user._id,
        id: role === 'doctor' ? user.doctorId : user.patientId,
        name: user.name,
        email: user.email,
        role,
        isProfileCompleted: user.isProfileCompleted ?? false,  // <-- tells frontend where to redirect
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (error instanceof Error) res.status(500).json({ message: error.message });
    else res.status(500).json({ message: 'Server error' });
  }
};

// ── LOGOUT ───────────────────────────────────────────────────────────────────
export const logoutUser = (req: Request, res: Response): void => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.model.js";
import { FormTemplate } from "../models/formTemplate.model.js";
import { ISO_TEMPLATE_CATALOG } from "../constants/isoForms.constant.js";

const ensureUser = async (filter, payload, successMessage) => {
  const existing = await User.findOne(filter);
  if (existing) {
    console.log(`Info: ${payload.role} already exists.`);
    return;
  }

  await User.create(payload);
  console.log(successMessage);
};

const seedTemplates = async () => {
  let created = 0;
  let updated = 0;

  for (const template of ISO_TEMPLATE_CATALOG) {
    const existing = await FormTemplate.findOne({ formNo: template.formNo });
    if (existing) {
      await FormTemplate.updateOne(
        { _id: existing._id },
        {
          $set: {
            title: template.title,
            description: template.description,
            assignedRoles: template.assignedRoles,
            requiresHODApproval: template.requiresHODApproval,
            status: template.status,
            sourceFile: template.sourceFile,
            fields: template.fields,
            sections: template.sections, // New: Sync sections to DB
          },
        }
      );
      updated += 1;
      continue;
    }

    await FormTemplate.create(template);
    created += 1;
  }

  console.log(`Templates synced: ${created} created, ${updated} updated.`);
};

const seed = async () => {
  await connectDB();
  console.log("Starting ISO audit seed...");

  await ensureUser(
    { role: "admin" },
    {
      name: "System Admin",
      email: "admin@isoaudit.edu",
      password: "Admin@123",
      role: "admin",
      isActive: true,
    },
    "Admin user created: admin@isoaudit.edu / Admin@123"
  );

  await ensureUser(
    { role: "hod" },
    {
      name: "Dr. HOD Computer Science",
      email: "hod.cs@isoaudit.edu",
      password: "Hod@123",
      role: "hod",
      department: "Computer Science",
      designation: "Head of Department",
      isActive: true,
    },
    "HOD user created: hod.cs@isoaudit.edu / Hod@123"
  );

  await ensureUser(
    { role: "faculty" },
    {
      name: "Prof. Demo Faculty",
      email: "faculty@isoaudit.edu",
      password: "Faculty@123",
      role: "faculty",
      department: "Computer Science",
      designation: "Assistant Professor",
      employeeId: "EMP001",
      isActive: true,
    },
    "Faculty user created: faculty@isoaudit.edu / Faculty@123"
  );

  await seedTemplates();

  console.log("Seed complete.");
  console.log("Test credentials:");
  console.log("  Admin:   admin@isoaudit.edu   / Admin@123");
  console.log("  HOD:     hod.cs@isoaudit.edu  / Hod@123");
  console.log("  Faculty: faculty@isoaudit.edu / Faculty@123");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});

import { Form } from "../models/form.model.js";
import { User } from "../models/user.model.js";

// ── Faculty / Coordinator Dashboard ──────────
export const getUserDashboardService = async (user) => {
  const stats = await Form.aggregate([
    { $match: { submittedBy: user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result = { totalSubmitted: 0, pending: 0, approved: 0, rejected: 0, draft: 0 };
  stats.forEach((item) => {
    result.totalSubmitted += item.count;
    if (item._id === "PENDING") result.pending = item.count;
    if (item._id === "APPROVED") result.approved = item.count;
    if (item._id === "REJECTED") result.rejected = item.count;
    if (item._id === "DRAFT") result.draft = item.count;
  });

  const recentForms = await Form.find({ submittedBy: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("formType formTitle status createdAt remarks");

  return { ...result, recentForms };
};

// ── HOD Dashboard ────────────────────────────
export const getHodDashboardService = async (user) => {
  const stats = await Form.aggregate([
    { $match: { department: user.department } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result = { totalForms: 0, pendingApproval: 0, approved: 0, rejected: 0 };
  stats.forEach((item) => {
    result.totalForms += item.count;
    if (item._id === "PENDING") result.pendingApproval = item.count;
    if (item._id === "APPROVED") result.approved = item.count;
    if (item._id === "REJECTED") result.rejected = item.count;
  });

  const recentForms = await Form.find({ department: user.department })
    .populate("submittedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(8)
    .select("formType formTitle status createdAt submittedBy");

  const formTypeBreakdown = await Form.aggregate([
    { $match: { department: user.department } },
    { $group: { _id: "$formType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return { ...result, recentForms, formTypeBreakdown };
};

// ── HOD Research Analytics Dashboard ─────────
export const getHodResearchAnalyticsService = async (user) => {
  const department = user.department;
  
  // Research forms: 126 (Faculty Research), 179 (Research Activity), 180 (Innovation & Patent)
  const researchFormTypes = ["126", "179", "180"];
  
  // Collect research-related statistics
  const [
    researchStats,
    facultyResearchCount,
    researchPapers,
    innovationPatents,
    placementData,
    monthlySubmissions,
    statusBreakdown,
    uniqueContributors
  ] = await Promise.all([
    // Total research forms by status
    Form.aggregate([
      { $match: { 
        department, 
        formType: { $in: researchFormTypes } 
      }},
      { $group: { 
        _id: "$status", 
        count: { $sum: 1 } 
      }},
    ]),

    // Form 126: Faculty Research Activity count
    Form.countDocuments({
      department,
      formType: "126",
      status: "APPROVED",
    }),

    // Form 179: Research Activity Report - count approved
    Form.countDocuments({
      department,
      formType: "179",
      status: "APPROVED",
    }),

    // Form 180: Innovation & Patent Report - count approved
    Form.countDocuments({
      department,
      formType: "180",
      status: "APPROVED",
    }),

    // Extract placement percentage from forms (if available in data field)
    Form.aggregate([
      { $match: { department, formType: { $in: ["158", "159"] } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]),

    // Monthly submission trends for research forms
    Form.aggregate([
      { $match: { department, formType: { $in: researchFormTypes } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]),

    // Status breakdown of all forms in department
    Form.aggregate([
      { $match: { department } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Count unique faculty who submitted research
    Form.aggregate([
      { $match: { department, formType: { $in: researchFormTypes }, status: "APPROVED" } },
      { $group: { _id: "$submittedBy", count: { $sum: 1 } } },
      { $group: { _id: null, uniqueFaculty: { $sum: 1 } } },
    ]),

    // NEW: Smart Intelligence - Budget Analysis from Form 114
    Form.aggregate([
      { $match: { department, formType: "114", status: "APPROVED" } },
      // Unwind the items array from the dynamic 'data' field
      { $unwind: "$data.items" },
      {
        $group: {
          _id: null,
          totalBudgetItems: { $sum: 1 },
          totalQty: { $sum: { $toDouble: "$data.items.qty" } }
        }
      }
    ]),

    // NEW: Smart Intelligence - Placement Analytics from Form 815
    Form.aggregate([
      { $match: { department, formType: "815", status: "APPROVED" } },
      { $unwind: "$data.records" },
      {
        $group: {
          _id: null,
          totalPlaced: {
            $sum: { $cond: [{ $eq: ["$data.records.type", "PLACEMENT"] }, 1, 0] }
          },
          highestPackage: { $max: { $toDouble: "$data.records.package" } },
          totalHigherStudies: {
            $sum: { $cond: [{ $eq: ["$data.records.type", "HIGHER STUDY"] }, 1, 0] }
          }
        }
      }
    ]),
  ]);

  const budgetStats = uniqueContributors[1] || { totalBudgetItems: 0, totalQty: 0 };
  const placementIntelligence = uniqueContributors[2] || { totalPlaced: 0, highestPackage: 0, totalHigherStudies: 0 };
  const uniqueFacultyCount = uniqueContributors[0]?.uniqueFaculty || 0;

  // Calculate research stats
  let researchResult = {
    totalResearchForms: 0,
    pendingResearchApproval: 0,
    approvedResearch: 0,
  };
  researchStats.forEach((item) => {
    researchResult.totalResearchForms += item.count;
    if (item._id === "PENDING") researchResult.pendingResearchApproval = item.count;
    if (item._id === "APPROVED") researchResult.approvedResearch = item.count;
  });

  // Overall status breakdown
  let statusResult = {
    totalForms: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    returned: 0,
  };
  statusBreakdown.forEach((item) => {
    statusResult.totalForms += item.count;
    if (item._id === "APPROVED") statusResult.approved = item.count;
    if (item._id === "PENDING") statusResult.pending = item.count;
    if (item._id === "REJECTED") statusResult.rejected = item.count;
    if (item._id === "RETURNED") statusResult.returned = item.count;
  });

  const placementCount = placementData[0]?.count || 0;

  return {
    research: {
      totalResearchForms: researchResult.totalResearchForms,
      pendingResearchApproval: researchResult.pendingResearchApproval,
      approvedResearch: researchResult.approvedResearch,
      facultyResearchActivityCount: facultyResearchCount,
      researchActivityReportCount: researchPapers,
      innovationPatentCount: innovationPatents,
      uniqueFacultyContributors: uniqueFacultyCount,
    },
    overview: {
      totalForms: statusResult.totalForms,
      approvedForms: statusResult.approved,
      pendingForms: statusResult.pending,
      rejectedForms: statusResult.rejected,
      returnedForms: statusResult.returned,
    },
    placement: {
      totalPlaced: placementIntelligence.totalPlaced || 0,
      highestPackage: placementIntelligence.highestPackage || 0,
      totalHigherStudies: placementIntelligence.totalHigherStudies || 0,
      trackingForms: placementCount,
    },
    budget: {
      totalItems: budgetStats.totalBudgetItems || 0,
      totalQuantity: budgetStats.totalQty || 0,
    },
    trends: {
      monthlyResearchSubmissions: monthlySubmissions.reverse(),
    },
  };
};

// ── Admin Dashboard ──────────────────────────
export const getAdminDashboardService = async () => {
  const [formStats, userStats, recentForms, monthlyStats] = await Promise.all([
    Form.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Form.find()
      .populate("submittedBy", "name email department")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("formType formTitle status department createdAt submittedBy"),
    Form.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]),
  ]);

  const formResult = { total: 0, pending: 0, approved: 0, rejected: 0 };
  formStats.forEach((item) => {
    formResult.total += item.count;
    if (item._id === "PENDING") formResult.pending = item.count;
    if (item._id === "APPROVED") formResult.approved = item.count;
    if (item._id === "REJECTED") formResult.rejected = item.count;
  });

  const totalUsers = userStats.reduce((sum, r) => sum + r.count, 0);

  return {
    forms: formResult,
    totalUsers,
    usersByRole: userStats,
    recentForms,
    monthlyStats: monthlyStats.reverse(),
  };
};

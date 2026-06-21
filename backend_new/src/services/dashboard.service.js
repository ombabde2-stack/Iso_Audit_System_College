import { Form } from "../models/form.model.js";
import { User } from "../models/user.model.js";

// ── Faculty / Coordinator Dashboard ──────────
export const getUserDashboardService = async (user) => {
  // Using $facet for sub-aggregation: combines stats and recentForms in single query
  const aggregationResults = await Form.aggregate([
    { $match: { submittedBy: user._id } },
    {
      $facet: {
        stats: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        recentForms: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          { $project: { formType: 1, formTitle: 1, status: 1, createdAt: 1, remarks: 1 } }
        ]
      }
    }
  ]);

  const { stats, recentForms } = aggregationResults[0];

  const result = { totalSubmitted: 0, pending: 0, approved: 0, rejected: 0, draft: 0 };
  stats.forEach((item) => {
    result.totalSubmitted += item.count;
    if (item._id === "PENDING") result.pending = item.count;
    if (item._id === "APPROVED") result.approved = item.count;
    if (item._id === "REJECTED") result.rejected = item.count;
    if (item._id === "DRAFT") result.draft = item.count;
  });

  return { ...result, recentForms };
};

// ── HOD Dashboard ────────────────────────────
export const getHodDashboardService = async (user) => {
  // Using $facet for sub-aggregation: combines stats and formTypeBreakdown in single query
  // recentForms retrieved separately with populate functionality
  const [aggregationResults, recentForms] = await Promise.all([
    Form.aggregate([
      { $match: { department: user.department } },
      {
        $facet: {
          stats: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          formTypeBreakdown: [
            { $group: { _id: "$formType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]),
    Form.find({ department: user.department })
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(8)
      .select("formType formTitle status createdAt submittedBy")
  ]);

  const { stats, formTypeBreakdown } = aggregationResults[0];

  const result = { totalForms: 0, pendingApproval: 0, approved: 0, rejected: 0 };
  stats.forEach((item) => {
    result.totalForms += item.count;
    if (item._id === "PENDING") result.pendingApproval = item.count;
    if (item._id === "APPROVED") result.approved = item.count;
    if (item._id === "REJECTED") result.rejected = item.count;
  });

  return { ...result, recentForms, formTypeBreakdown };
};

// ── HOD Research Analytics Dashboard ─────────
export const getHodResearchAnalyticsService = async (user) => {
  const department = user.department;
  
  // Research forms: 126 (Faculty Research), 179 (Research Activity), 180 (Innovation & Patent)
  const researchFormTypes = ["126", "179", "180"];
  
  // Using $facet for sub-aggregation: combines 10+ queries into 1 faceted aggregation
  // This reduces database queries from 10+ to 1 and improves performance significantly
  const aggregationResults = await Form.aggregate([
    {
      $facet: {
        // Total research forms by status
        researchStats: [
          { $match: { 
            department, 
            formType: { $in: researchFormTypes } 
          }},
          { $group: { 
            _id: "$status", 
            count: { $sum: 1 } 
          }}
        ],

        // Form 126: Faculty Research Activity count
        facultyResearchCount: [
          { $match: { department, formType: "126", status: "APPROVED" } },
          { $count: "count" }
        ],

        // Form 179: Research Activity Report - count approved
        researchPapers: [
          { $match: { department, formType: "179", status: "APPROVED" } },
          { $count: "count" }
        ],

        // Form 180: Innovation & Patent Report - count approved
        innovationPatents: [
          { $match: { department, formType: "180", status: "APPROVED" } },
          { $count: "count" }
        ],

        // Placement tracking form count
        placementData: [
          { $match: { department, formType: { $in: ["158", "159"] } } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ],

        // Monthly submission trends for research forms
        monthlySubmissions: [
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
          { $limit: 6 }
        ],

        // Status breakdown of all forms in department
        statusBreakdown: [
          { $match: { department } },
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],

        // Count unique faculty who submitted research
        uniqueContributors: [
          { $match: { department, formType: { $in: researchFormTypes }, status: "APPROVED" } },
          { $group: { _id: "$submittedBy" } },
          { $group: { _id: null, uniqueFaculty: { $sum: 1 } } }
        ],

        budgetStats: [
          { $match: { department, formType: "114", status: "APPROVED" } },
          { $count: "totalBudgetForms" }
        ],

        placementIntelligence: [
          { $match: { department, formType: "815", status: "APPROVED" } },
          { $count: "trackingForms" }
        ]
      }
    }
  ]);

  const result = aggregationResults[0];
  
  const researchStats = result.researchStats;
  const facultyResearchCount = result.facultyResearchCount[0]?.count || 0;
  const researchPapers = result.researchPapers[0]?.count || 0;
  const innovationPatents = result.innovationPatents[0]?.count || 0;
  const placementData = result.placementData;
  const monthlySubmissions = result.monthlySubmissions;
  const statusBreakdown = result.statusBreakdown;
  const uniqueContributors = result.uniqueContributors;
  const budgetStats = result.budgetStats[0] || { totalBudgetForms: 0 };
  const placementIntelligence = result.placementIntelligence[0] || { trackingForms: 0 };
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
      totalPlaced: 0,
      highestPackage: 0,
      totalHigherStudies: 0,
      trackingForms: placementCount + (placementIntelligence.trackingForms || 0),
    },
    budget: {
      totalItems: budgetStats.totalBudgetForms || 0,
      totalQuantity: 0,
    },
    trends: {
      monthlyResearchSubmissions: monthlySubmissions.reverse(),
    },
  };
};

// ── Admin Dashboard ──────────────────────────
export const getAdminDashboardService = async () => {
  // Using $facet for sub-aggregation: combines formStats and monthlyStats in single query
  // recentForms and userStats retrieved in parallel
  const [aggregationResults, userStats, recentForms] = await Promise.all([
    Form.aggregate([
      {
        $facet: {
          formStats: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          monthlyStats: [
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
            { $limit: 6 }
          ]
        }
      }
    ]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Form.find()
      .populate("submittedBy", "name email department")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("formType formTitle status department createdAt submittedBy")
  ]);

  const { formStats, monthlyStats } = aggregationResults[0];

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

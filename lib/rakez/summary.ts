import type { ActivityRecord, LeadPayload, Recommendation, SimulatorAnswers } from "./types";

export function buildProjectSummary(
  answers: SimulatorAnswers,
  recommendation: Recommendation,
  activity?: ActivityRecord,
) {
  return {
    profile: {
      activity: activity?.name ?? answers.activityQuery,
      category: answers.activityCategory,
      shareholders: answers.shareholders,
      visas: answers.visas,
      facility: answers.facility,
      clients: answers.clients,
      relocation: answers.relocation,
      timeline: answers.timeline,
    },
    recommendation: {
      status: recommendation.status,
      packageName: recommendation.packageName,
      budget: recommendation.budgetLabel,
      complexity: recommendation.complexity,
      reasons: recommendation.reasons,
    },
    included: recommendation.included,
    notIncluded: recommendation.notIncluded,
    validationPoints: recommendation.validationPoints,
    documents: recommendation.documents,
  };
}

export function buildLeadEmailText(leadId: string, lead: LeadPayload) {
  const rec = lead.recommendation;
  return [
    `Lead ${leadId}`,
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "-"}`,
    `WhatsApp: ${lead.whatsapp || "-"}`,
    `Country: ${lead.country || "-"}`,
    `Nationality: ${lead.nationality || "-"}`,
    `Activity: ${lead.activity || "-"}`,
    `Selected activity: ${lead.selectedActivityId || "-"}`,
    `Shareholders: ${lead.shareholders || "-"}`,
    `Visas: ${lead.visas || "-"}`,
    `Facility: ${lead.facility || "-"}`,
    `Clients: ${lead.clients || "-"}`,
    `Relocation: ${lead.relocation || "-"}`,
    `Timeline: ${lead.timeline || "-"}`,
    `Budget: ${lead.budget || "-"}`,
    `Recommendation: ${rec ? `${rec.packageName} / ${rec.budgetLabel} / ${rec.status}` : "-"}`,
    `Message: ${lead.message || "-"}`,
  ].join("\n");
}

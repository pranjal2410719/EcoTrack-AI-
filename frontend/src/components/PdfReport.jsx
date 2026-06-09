import { useState } from "react";
import { jsPDF } from "jspdf";
import { getReportData } from "../services/api";
import { showSuccess, showError } from "../utils/toast";

export default function PdfReport() {
  const [loading, setLoading] = useState(false);

  async function generateReport() {
    setLoading(true);
    try {
      const res = await getReportData();
      const data = res.data;

      if (!data.hasAssessment) {
        showError("No data", "Complete an assessment first to generate a report.");
        setLoading(false);
        return;
      }

      const { assessment, recommendations, history } = data;
      const doc = new jsPDF("p", "mm", "a4");
      const pageW = 210;
      const margin = 20;
      const contentW = pageW - margin * 2;
      let y = 20;

      // Colors
      const primary = [22, 163, 74]; // green-600
      const dark = [17, 24, 39];     // gray-900
      const gray = [107, 114, 128];  // gray-500
      const light = [243, 244, 246]; // gray-100

      // ── Header bar ──
      doc.setFillColor(...primary);
      doc.rect(0, 0, pageW, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EcoTrack AI — Sustainability Report", margin, 8);

      // ── Title ──
      y = 28;
      doc.setTextColor(...dark);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Carbon Footprint Report", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date(data.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, y);
      y += 14;

      // ── Carbon Score Card ──
      doc.setFillColor(...light);
      doc.roundedRect(margin, y, contentW, 30, 3, 3, "F");
      doc.setTextColor(...dark);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Carbon Score: ${Math.round(assessment.carbonScore)} kg CO₂`, margin + 5, y + 10);
      doc.setTextColor(...primary);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${assessment.level} Impact`, margin + 5, y + 22);
      doc.setTextColor(...gray);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Category: ${assessment.level}`, margin + contentW - 40, y + 10);
      y += 40;

      // ── Breakdown Table ──
      doc.setTextColor(...dark);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Emission Breakdown", margin, y);
      y += 10;

      const categories = [
        { label: "Transport", value: assessment.breakdown.transport, icon: "🚗" },
        { label: "Electricity", value: assessment.breakdown.electricity, icon: "⚡" },
        { label: "Diet", value: assessment.breakdown.diet, icon: "🍽️" },
        { label: "Flights", value: assessment.breakdown.flights, icon: "✈️" },
        { label: "Shopping", value: assessment.breakdown.shopping, icon: "🛍️" },
      ];

      const totalVal = categories.reduce((s, c) => s + c.value, 0);

      categories.forEach((cat) => {
        const pct = totalVal > 0 ? (cat.value / totalVal) * 100 : 0;
        doc.setFillColor(...light);
        doc.roundedRect(margin, y, contentW, 10, 2, 2, "F");
        doc.setFontSize(10);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        doc.text(`${cat.label}`, margin + 4, y + 7);
        doc.setFont("helvetica", "bold");
        doc.text(`${cat.value} kg`, margin + contentW - 30, y + 7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        doc.text(`${pct.toFixed(1)}%`, margin + contentW - 10, y + 7);

        // Mini bar
        doc.setFillColor(229, 231, 235);
        doc.roundedRect(margin + 55, y + 3, contentW - 90, 4, 2, 2, "F");
        doc.setFillColor(...primary);
        doc.roundedRect(margin + 55, y + 3, (contentW - 90) * (pct / 100), 4, 2, 2, "F");
        y += 13;
      });

      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(...dark);
      doc.setFont("helvetica", "bold");
      doc.text(`Total: ${Math.round(totalVal)} kg CO₂ / month`, margin, y);
      y += 16;

      // ── Progress Chart (simple bars) ──
      if (history && history.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Monthly Progress", margin, y);
        y += 10;

        const barH = 8;
        const barGap = 4;
        const maxScore = Math.max(...history.map((h) => h.score));
        const chartH = history.length * (barH + barGap);

        history.forEach((entry, i) => {
          const barW = (entry.score / maxScore) * (contentW - 50);
          const barY = y + i * (barH + barGap);

          doc.setFillColor(...light);
          doc.roundedRect(margin + 50, barY, contentW - 50, barH, 2, 2, "F");
          doc.setFillColor(entry.score < 200 ? 22 : entry.score < 500 ? 217 : 220, 163, entry.score < 200 ? 74 : entry.score < 500 ? 119 : 38);
          doc.roundedRect(margin + 50, barY, Math.max(barW, 4), barH, 2, 2, "F");

          doc.setFontSize(8);
          doc.setTextColor(...gray);
          doc.setFont("helvetica", "normal");
          const label = new Date(entry.date).toLocaleDateString("en-US", { month: "short" });
          doc.text(label, margin, barY + 6);

          doc.setTextColor(...dark);
          doc.setFont("helvetica", "bold");
          doc.text(`${entry.score} kg`, margin + 55 + Math.max(barW, 4) + 2, barY + 6);
        });

        y += history.length * (barH + barGap) + 10;
      }

      // ── Recommendations ──
      if (recommendations) {
        // Check if we're near the bottom of the page
        if (y > 220) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("AI Recommendations", margin, y);
        y += 10;

        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");

        // Strip markdown and split into lines
        const cleanText = recommendations
          .replace(/\*\*/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/#{1,6}\s/g, "")
          .replace(/\n{3,}/g, "\n\n");

        const lines = doc.splitTextToSize(cleanText, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 10;
      }

      // ── Category Inputs ──
      if (y > 230) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Your Inputs", margin, y);
      y += 10;

      const inputs = [
        ["Transport", `${assessment.transport} km/week`],
        ["Electricity", `₹${assessment.electricity}/month`],
        ["Diet", assessment.diet.charAt(0).toUpperCase() + assessment.diet.slice(1)],
        ["Flights", `${assessment.flights}/year`],
        ["Shopping", `${assessment.shopping}/month`],
      ];

      inputs.forEach(([label, value]) => {
        doc.setFillColor(...light);
        doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        doc.text(label, margin + 4, y + 6);
        doc.setFont("helvetica", "bold");
        doc.text(value, margin + contentW - 25, y + 6);
        y += 11;
      });

      // ── Footer ──
      y = Math.max(y + 10, 270);
      doc.setDrawColor(...gray);
      doc.line(margin, y, pageW - margin, y);
      doc.setFontSize(8);
      doc.setTextColor(...gray);
      doc.setFont("helvetica", "normal");
      doc.text("EcoTrack AI — Track. Understand. Reduce.", margin, y + 5);
      doc.text("https://ecotrack0a.netlify.app", margin, y + 10);

      // Save
      doc.save(`EcoTrack-Report-${new Date().toISOString().split("T")[0]}.pdf`);
      showSuccess("Report downloaded!", "Your PDF sustainability report is ready.");
    } catch (err) {
      console.error("PDF generation error:", err);
      showError("Report failed", err.response?.data?.error || "Could not generate report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={generateReport}
      disabled={loading}
      className="btn-primary !py-2.5 !px-5 text-sm whitespace-nowrap flex items-center gap-2"
      aria-label="Download sustainability report"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <span>📄</span>
          Download Report
        </>
      )}
    </button>
  );
}

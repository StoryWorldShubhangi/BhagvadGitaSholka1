function generatePDFReport(questionReport, score, totalQuestions) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ===== UTILITY: REMOVE EMOJIS =====
  function removeEmojis(text) {
    if (!text) return "";
    return text.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      ""
    ).replace(/\s+/g, " ").trim();
  }

  let y = 20;

  // ===== TITLE =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Parent Reflection Report", 105, y, { align: "center" });

  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Story-Based Learning Summary", 105, y, { align: "center" });

  y += 15;

  // ===== SUMMARY =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total Questions: ${totalQuestions}`, 20, y);
  y += 8;

  doc.text(
    `Answered: ${questionReport.filter(q => q.answered).length}`,
    20,
    y
  );
  y += 12;

  // Divider
  doc.setDrawColor(180);
  doc.line(20, y, 190, y);
  y += 10;

  // ===== QUESTIONS LOOP =====
  questionReport.forEach((q, index) => {
    // Page break handling
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    // Question
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      `Q${index + 1}. ${removeEmojis(q.question)}`,
      20,
      y,
      { maxWidth: 170 }
    );
    y += 10;

    // Options
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    Object.entries(q.options).forEach(([key, value]) => {
      doc.text(
        `• ${key}: ${removeEmojis(value)}`,
        26,
        y
      );
      y += 6;
    });

    y += 4;

    // Child response
    doc.setFont("helvetica", "bold");
    doc.text("Child's Response:", 26, y);
    y += 6;

    doc.setFont("helvetica", "normal");

    if (q.answered && q.selectedOptions.length > 0) {
      q.selectedOptions.forEach(ans => {
        doc.text(`✓ ${removeEmojis(ans)}`, 32, y);
        y += 6;
      });
    } else {
      doc.text("Not Answered", 32, y);
      y += 6;
    }

    y += 8;

    // Divider
    doc.setDrawColor(220);
    doc.line(20, y, 190, y);
    y += 10;
  });

  // ===== FOOTER =====
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    "This report is designed to help parents reflect and gently support their child.",
    105,
    285,
    { align: "center", maxWidth: 170 }
  );

  // ===== SAVE PDF =====
  doc.save("Parent_Story_Reflection_Report.pdf");
}

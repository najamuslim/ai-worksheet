
import { jsPDF } from "jspdf";
import type { Question } from "@/components/Worksheet";

type PDFData = {
  topic: string;
  questions: Question[];
  gradeLevel: string;
  questionType: string;
};

export const generatePDF = ({
  topic,
  questions,
  gradeLevel,
  questionType,
}: PDFData) => {
  const doc = new jsPDF();
  const lineHeight = 10;
  let yPosition = 20;

  // Add title
  doc.setFontSize(16);
  doc.text(topic, 20, yPosition);
  yPosition += lineHeight * 1.5;

  // Add metadata
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`${gradeLevel} • ${questionType}`, 20, yPosition);
  yPosition += lineHeight * 2;

  // Add questions
  doc.setTextColor(0);
  questions.forEach((q, i) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(`${i + 1}. ${q.question}`, 20, yPosition);
    yPosition += lineHeight;

    if (q.options) {
      q.options.forEach((option, j) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(
          `${String.fromCharCode(65 + j)}) ${option}`,
          30,
          yPosition
        );
        yPosition += lineHeight;
      });
      yPosition += lineHeight / 2;
    }
  });

  // Save the PDF
  doc.save(`worksheet-${topic.toLowerCase().replace(/\s+/g, "-")}.pdf`);
};

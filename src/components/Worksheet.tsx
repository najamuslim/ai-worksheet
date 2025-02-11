
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";

export type Question = {
  question: string;
  options?: string[];
  answer?: string;
};

type WorksheetProps = {
  topic: string;
  questions: Question[];
  gradeLevel: string;
  questionType: string;
};

export const Worksheet = ({
  topic,
  questions,
  gradeLevel,
  questionType,
}: WorksheetProps) => {
  const handleDownload = () => {
    generatePDF({ topic, questions, gradeLevel, questionType });
  };

  return (
    <div className="space-y-6 fade-up">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {gradeLevel} • {questionType}
          </p>
          <h2 className="text-2xl font-semibold">{topic}</h2>
        </div>
        <Button onClick={handleDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <Card
            key={i}
            className="p-6 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow"
          >
            <p className="font-medium mb-4">
              {i + 1}. {q.question}
            </p>
            {q.options && (
              <div className="space-y-2 ml-6">
                {q.options.map((option, j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + j)}
                    </div>
                    <p>{option}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

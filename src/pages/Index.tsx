
import { useState } from "react";
import { WorksheetForm } from "@/components/WorksheetForm";
import { Worksheet, type Question } from "@/components/Worksheet";
import { pipeline } from "@huggingface/transformers";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<{
    topic: string;
    questions: Question[];
    gradeLevel: string;
    questionType: string;
  } | null>(null);

  const generateWorksheet = async (formData: {
    topic: string;
    gradeLevel: string;
    questionType: string;
    numQuestions: number;
  }) => {
    setIsLoading(true);
    try {
      // Initialize the model
      const generator = await pipeline(
        "text-generation",
        "onnx-community/llama-2-7b-chat-onnx",
        { device: "webgpu" }
      );

      const prompt = `Generate ${formData.numQuestions} ${
        formData.questionType
      } questions about ${formData.topic} for ${
        formData.gradeLevel
      } school students. Format as JSON with this structure: { "questions": [{ "question": "...", ${
        formData.questionType === "multiple"
          ? '"options": ["A", "B", "C", "D"],'
          : ""
      } "answer": "..." }] }`;

      const result = await generator(prompt, {
        max_new_tokens: 1000,
        temperature: 0.7,
      });

      let questions: Question[];
      try {
        const parsed = JSON.parse(result[0].generated_text);
        questions = parsed.questions;
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        questions = getSampleQuestions(formData.questionType);
      }

      setWorksheet({
        topic: formData.topic,
        questions,
        gradeLevel: formData.gradeLevel,
        questionType: formData.questionType,
      });
    } catch (error) {
      console.error("Failed to generate worksheet:", error);
      // Fallback to sample data
      setWorksheet({
        topic: formData.topic,
        questions: getSampleQuestions(formData.questionType),
        gradeLevel: formData.gradeLevel,
        questionType: formData.questionType,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-12 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Worksheet Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Create custom worksheets for your students in seconds
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-4 h-fit">
            <WorksheetForm onSubmit={generateWorksheet} isLoading={isLoading} />
          </div>
          {worksheet && (
            <div className="lg:col-start-2">
              <Worksheet {...worksheet} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample questions for fallback
const getSampleQuestions = (type: string): Question[] => {
  if (type === "multiple") {
    return [
      {
        question: "What is the primary function of photosynthesis in plants?",
        options: [
          "To produce oxygen only",
          "To convert light energy into chemical energy",
          "To absorb water from soil",
          "To release carbon dioxide",
        ],
        answer: "B",
      },
      // Add more sample questions...
    ];
  }
  return [
    {
      question:
        "Explain the process of photosynthesis and its importance in the ecosystem.",
      answer:
        "Photosynthesis is the process where plants convert light energy into chemical energy...",
    },
    // Add more sample questions...
  ];
};

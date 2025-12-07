import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";

interface ArticleQuizCardProps {
  article: {
    id: string;
    title: string;
    content: string;
    category: string;
    difficulty: string;
  };
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty: string;
  }>;
  onComplete?: () => void;
}

export const ArticleQuizCard = ({ article, questions, onComplete }: ArticleQuizCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { submitAttempt } = useQuiz();
  const { recordAnswer } = useSpacedRepetition();

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQ.correct_answer;
    
    // Submit to quiz system
    submitAttempt.mutate({
      question_id: currentQ.id,
      selected_answer: answer,
      is_correct: isCorrect,
      xp_earned: isCorrect ? 10 : 0,
      category: article.category,
    });

    // Record for spaced repetition
    recordAnswer({
      questionId: currentQ.id,
      isCorrect,
      category: article.category,
    });

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete?.();
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return option === selectedAnswer
        ? 'border-primary bg-primary/10'
        : 'border-border hover:border-primary/50';
    }

    const isCorrect = option === currentQ.correct_answer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) return 'border-green-500 bg-green-500/10';
    if (isSelected && !isCorrect) return 'border-red-500 bg-red-500/10';
    return 'border-border opacity-50';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'Hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Article Theory Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <p className="text-muted-foreground mb-3">{article.content}</p>
            <div className="flex gap-2">
              <Badge variant="outline">{article.category}</Badge>
              <Badge className={getDifficultyColor(article.difficulty)}>
                {article.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Question {currentIndex + 1} of {questions.length}</span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-6">
            <div className="space-y-4">
              {/* Question Header */}
              <div>
                <div className="mb-3">
                  <Badge className={getDifficultyColor(currentQ.difficulty)}>
                    {currentQ.difficulty}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-4 px-4 ${getOptionStyle(option)}`}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                  >
                    <span className="flex items-center gap-3 w-full">
                      <span className="font-mono text-sm w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && option === currentQ.correct_answer && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      {showResult && option === selectedAnswer && option !== currentQ.correct_answer && (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Explanation */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-accent">
                        {selectedAnswer === currentQ.correct_answer ? 'Correct!' : 'Learn from this:'}
                      </h4>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation */}
            {showResult && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext} size="lg">
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Article'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

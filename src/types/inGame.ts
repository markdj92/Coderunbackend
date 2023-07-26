export interface ExecuteResult {
  memory: string;
  cpuTime: string;
  output: string;
}

export interface ExecuteData {
  title: string;
  problemNumber: number;
  script: string | null;
  language: string;
  versionIndex: string;
}

export type QuizInfo = {
  contents: string;
  ex_input: string[];
  ex_output: string[];
  input: string[];
  input_contents: string;
  level: number;
  number: number;
  output: string[];
  output_contents: string;
  title: string;
} | null;

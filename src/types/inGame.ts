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

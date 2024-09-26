export type Scenario = {
    id: number;
    feature: string;
    scenario: string;
    caseName: string;
    status: string;
    errorType: string;
    comment: string;
  };
  
  export type ExecutionData = {
    version: string;
    releases: string[];
    platform: string;
    scenarios: Scenario[];
    startDate: string;
    endDate: string;
    executionCount: number;
  };

export interface Feature {
  id: number;
  feature: string;
  scenario: string;
  caseName: string;
  status: string;
  description: string;
  gherkin: string;
  tagModule: string;
  tags: string[];
  androidStrategy: string;
  iosStrategy: string;
  androidMapping: string;
  iosMapping: string;
  androidConstruction: string;
  iosConstruction: string;
  androidStabilization: string;
  iosStabilization: string;
  androidProgress: string;
  iosProgress: string;
  totalProgress: string;
  androidManualExecution: string;
  iosManualExecution: string;
  androidRobotExecution: string;
  iosRobotExecution: string;
}

export interface ScenarioNew {
  id: number
  feature: string
  caseName: string
  status: string
  errorType: string
  comment: string
  executionCount: number
}

export interface Execution {
  version: string
  releases: string[]
  platform: 'Android' | 'iOS'
  scenarios: Scenario[]
  startDate: string
  endDate: string | null
  executionCount: number
}

export type FilterOptions = {
  label: string;
  value: string;
  setter: (value: string) => void;
  options: string[];
};

export type ChartData = {
  name: string;
  [key: string]: string | number;
};
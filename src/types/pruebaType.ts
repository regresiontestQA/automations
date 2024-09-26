export interface BaseFeature {
    id: number;
    feature: string;
    scenario: string;
    caseName: string;
    status: string;
    description: string;
    gherkin: string;
    tagModule: string;
    tags: string[];
    developmentType: 'mobile' | 'web' | 'api';
    totalProgress: string;
  }
  
  export interface MobileFeature extends BaseFeature {
    developmentType: 'mobile';
    androidStrategy: string;
    androidMapping: string;
    androidConstruction: string;
    androidStabilization: string;
    iosStrategy: string;
    iosMapping: string;
    iosConstruction: string;
    iosStabilization: string;
    androidManualExecution: string;
    androidRobotExecution: string;
    iosManualExecution: string;
    iosRobotExecution: string;
  }
  
  export interface WebApiFeature extends BaseFeature {
    developmentType: 'web' | 'api';
    strategy: string;
    mapping: string;
    construction: string;
    stabilization: string;
    manualExecution: string;
    robotExecution: string;
  }
  
  export type Feature = MobileFeature | WebApiFeature;
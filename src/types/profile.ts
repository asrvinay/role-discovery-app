
export type InputType = 'jobTitle' | 'location' | 'skill' | 'industry' | null;

export interface ProfileData {
  jobTitles: string[];
  locations: string[];
  yearsExperience: number;
  skills: string[];
  industries: string[];
  employmentTypes: string[];
  salaryMin: number;
  salaryMax: number;
  remotePreference: boolean;
}

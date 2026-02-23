export interface ExtractedSkills {
  technicalSkills: string[]
  softSkills: string[]
  tools: string[]
  experienceAreas: string[]
}

export interface ExtractionResult {
  id: string
  timestamp: string
  cvFileName: string
  ifuFileName: string
  skills: ExtractedSkills | null
}

export interface SystemStatus {
  apiStatus: string
  databaseConnected: boolean
  llmConfigured: boolean
  timestamp: string
}

export interface DocumentTemplate {
  id: string
  name: string
  type: "assignment" | "report" | "invoice" | "word"
  header: string
  footer: string
  styles: string
}

export interface DocumentSection {
  id: string
  title: string
  content: string
  editable: boolean
}

export interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

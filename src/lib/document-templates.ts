import type { DocumentTemplate } from "@/types/document"

export const DOCUMENT_TEMPLATES: Record<string, DocumentTemplate> = {
  assignment: {
    id: "assignment",
    name: "University Assignment",
    type: "assignment",
    styles: `
      @page { 
        margin: 1in; 
        border: 2px solid #000;
        padding: 20px;
      }
      body { 
        font-family: 'Times New Roman', serif; 
        font-size: 12pt; 
        line-height: 1.6; 
        border: 1px solid #333;
        padding: 20px;
        margin: 0;
      }
      .header-page {
        text-align: center;
        page-break-after: always;
        border-bottom: 2px solid #000;
        padding-bottom: 30px;
        margin-bottom: 30px;
      }
      .university-logo {
        width: 120px;
        height: 120px;
        margin: 0 auto 20px;
        border: 2px solid #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background: #f5f5f5;
      }
      .assignment-details {
        margin: 30px 0;
        text-align: left;
        border: 1px solid #666;
        padding: 20px;
        background: #fafafa;
      }
      .detail-row {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dotted #999;
        padding-bottom: 5px;
      }
      h1 { font-size: 18pt; font-weight: bold; margin: 20px 0; }
      h2 { font-size: 14pt; font-weight: bold; margin: 16px 0 8px; border-bottom: 1px solid #333; }
      h3 { font-size: 12pt; font-weight: bold; margin: 12px 0 6px; }
      .content-section {
        margin: 20px 0;
        padding: 15px;
        border-left: 3px solid #007acc;
      }
      .editable {
        min-height: 50px;
        padding: 10px;
        border: 1px dashed #ccc;
        cursor: text;
        transition: all 0.2s ease;
      }
      .editable:hover {
        background: #f9f9f9;
        border-color: #007acc;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    `,
    header: `
      <div class="header-page">
        <div class="university-logo">
          <img src='C:\Users\moiz2\OneDrive\Desktop\docgent\public\next.svg'> </img>
        </div>
        <h1>UNIVERSITY ASSIGNMENT</h1>
        <div class="assignment-details">
          <div class="detail-row">
            <span><strong>Student Name:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{studentName}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Student ID:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{studentId}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Course Code:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{courseCode}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Course Name:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{courseName}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Assignment Title:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{assignmentTitle}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Topic:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{topic}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Due Date:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{dueDate}}</span>
          </div>
          <div class="detail-row">
            <span><strong>Instructor:</strong></span>
            <span contenteditable="true" style="border-bottom: 1px solid #000; min-width: 200px; display: inline-block;">{{instructorName}}</span>
          </div>
        </div>
      </div>
    `,
    footer: `
      <div style="margin-top: 50px; text-align: center; border-top: 1px solid #333; padding-top: 20px;">
        <p><em>This assignment was prepared as part of academic requirements.</em></p>
        <p><strong>Submitted on: {{submissionDate}}</strong></p>
      </div>
    `,
  },

  report: {
    id: "report",
    name: "Professional Report",
    type: "report",
    styles: `
      @page { margin: 1in; }
      body { 
        font-family: 'Arial', sans-serif; 
        font-size: 11pt; 
        line-height: 1.5; 
        color: #333;
      }
      .header-page { 
        text-align: center; 
        page-break-after: always; 
        padding: 40px 0;
        border-bottom: 3px solid #2c3e50;
      }
      h1 { 
        font-size: 24pt; 
        color: #2c3e50; 
        margin-bottom: 20px;
      }
      h2 { 
        font-size: 16pt; 
        color: #34495e; 
        border-bottom: 2px solid #3498db; 
        padding-bottom: 5px;
        margin-top: 25px;
      }
      .content-section { 
        margin: 20px 0; 
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #3498db;
      }
      .editable {
        min-height: 60px;
        padding: 12px;
        border: 1px dashed #bdc3c7;
        cursor: text;
        background: white;
        border-radius: 4px;
      }
      .editable:hover {
        border-color: #3498db;
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
      }
    `,
    header: `
      <div class="header-page">
        <h1>PROFESSIONAL REPORT</h1>
        <p style="font-size: 16pt; margin: 30px 0; color: #7f8c8d;">{{reportTitle}}</p>
        <p style="font-size: 14pt;">Prepared by: {{authorName}}</p>
        <p style="font-size: 12pt; color: #95a5a6;">Date: {{reportDate}}</p>
      </div>
    `,
    footer: `
      <div style="margin-top: 40px; text-align: center; border-top: 2px solid #34495e; padding-top: 20px;">
        <p style="color: #7f8c8d;"><em>Professional Report - Confidential</em></p>
      </div>
    `,
  },

  proposal: {
    id: "proposal",
    name: "Project Proposal",
    type: "proposal",
    styles: `
      @page { margin: 1in; }
      body { 
        font-family: 'Calibri', sans-serif; 
        font-size: 11pt; 
        line-height: 1.4; 
        color: #2c3e50;
      }
      .header-page { 
        text-align: center; 
        page-break-after: always; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        padding: 60px 40px;
        border-radius: 10px;
        margin-bottom: 30px;
      }
      h1 { 
        font-size: 28pt; 
        margin-bottom: 30px; 
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      h2 { 
        font-size: 18pt; 
        color: #5d4e75; 
        border-bottom: 2px solid #667eea;
        padding-bottom: 8px;
      }
      .content-section {
        margin: 25px 0;
        padding: 20px;
        background: linear-gradient(to right, #f8f9fa, #ffffff);
        border-left: 5px solid #667eea;
        border-radius: 8px;
      }
      .editable {
        min-height: 70px;
        padding: 15px;
        border: 2px dashed #d1d5db;
        cursor: text;
        background: white;
        border-radius: 6px;
        transition: all 0.3s ease;
      }
      .editable:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-1px);
      }
    `,
    header: `
      <div class="header-page">
        <h1>PROJECT PROPOSAL</h1>
        <p style="font-size: 18pt; margin-bottom: 20px;">{{proposalTitle}}</p>
        <p style="font-size: 16pt;">Submitted by: {{proposerName}}</p>
        <p style="font-size: 14pt; opacity: 0.9;">{{organizationName}}</p>
        <p style="font-size: 12pt; margin-top: 20px;">Date: {{proposalDate}}</p>
      </div>
    `,
    footer: `
      <div style="margin-top: 50px; text-align: center; border-top: 3px solid #667eea; padding-top: 25px;">
        <p style="color: #5d4e75; font-weight: bold;">Project Proposal - {{proposalTitle}}</p>
        <p style="color: #8b7ca6; font-size: 10pt;">Prepared with professional standards</p>
      </div>
    `,
  },
}

export function getTemplate(templateId: string): DocumentTemplate | null {
  return DOCUMENT_TEMPLATES[templateId] || null
}

export function getAllTemplates(): DocumentTemplate[] {
  return Object.values(DOCUMENT_TEMPLATES)
}

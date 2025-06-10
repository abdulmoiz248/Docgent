import type { DocumentTemplate } from "@/types/document"

export const DOCUMENT_TEMPLATES: Record<string, DocumentTemplate> = {
  assignment: {
    id: "assignment",
    name: "University Assignment",
    type: "assignment",
    styles: `
      @page { margin: 1in; border: 2px solid #000; }
      body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 0; }
      .header-page {
        text-align: center;
        page-break-after: always;
        padding: 40px 0;
      }
      .university-logo {
        width: 150px;
        height: 150px;
        margin: 0 auto 20px;
        border: 2px solid #000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
      }
      .assignment-details {
        text-align: left;
        padding: 20px;
        width: 80%;
        margin: 0 auto;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px dotted #aaa;
      }
      h1 { font-size: 20pt; font-weight: bold; margin-top: 30px; }
      h2, h3 {
        font-weight: bold;
        border-bottom: 1px solid #333;
        padding-bottom: 5px;
        margin-top: 20px;
      }
      .content-section {
        padding: 20px;
        border-left: 3px solid #007acc;
        margin: 30px auto;
        width: 85%;
      }
      .editable {
        min-height: 50px;
        border: 1px dashed #ccc;
        padding: 10px;
      }
    `,
    header: `
      <div class="header-page">
        <div class="university-logo">
          <img src="/cui.jpg" style="max-width: 100%; max-height: 100%;" />
        </div>
        <h1>UNIVERSITY ASSIGNMENT</h1>
        <div class="assignment-details">
          <div class="detail-row"><strong>Student Name:</strong> <span contenteditable="true">{{studentName}}</span></div>
          <div class="detail-row"><strong>Student ID:</strong> <span contenteditable="true">{{studentId}}</span></div>
          <div class="detail-row"><strong>Course Code:</strong> <span contenteditable="true">{{courseCode}}</span></div>
          <div class="detail-row"><strong>Course Name:</strong> <span contenteditable="true">{{courseName}}</span></div>
          <div class="detail-row"><strong>Assignment Title:</strong> <span contenteditable="true">{{assignmentTitle}}</span></div>
          <div class="detail-row"><strong>Topic:</strong> <span contenteditable="true">{{topic}}</span></div>
          <div class="detail-row"><strong>Due Date:</strong> <span contenteditable="true">{{dueDate}}</span></div>
          <div class="detail-row"><strong>Instructor:</strong> <span contenteditable="true">{{instructorName}}</span></div>
        </div>
      </div>
    `,
    footer: `
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #000;">
        <p>Submitted on: <strong>{{submissionDate}}</strong></p>
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
        font-family: 'Georgia', serif;
        font-size: 12pt;
        line-height: 1.5;
        color: #222;
      }
      .header-page {
        text-align: center;
        padding: 50px;
        border-bottom: 4px solid #2c3e50;
        margin-bottom: 40px;
      }
      h1 {
        font-size: 26pt;
        color: #2c3e50;
        margin-bottom: 10px;
      }
      h2 {
        font-size: 18pt;
        color: #34495e;
        margin: 20px 0 10px;
        border-bottom: 1px solid #3498db;
      }
      .content-section {
        padding: 15px;
        margin: 20px 0;
        background: #fdfdfd;
        border-left: 5px solid #3498db;
      }
      .editable {
        min-height: 60px;
        border: 1px dashed #ccc;
        padding: 10px;
        background: #fff;
      }
    `,
    header: `
      <div class="header-page">
        <h1>{{reportTitle}}</h1>
        <p><strong>Author:</strong> {{authorName}}</p>
        <p><strong>Date:</strong> {{reportDate}}</p>
      </div>
    `,
    footer: `
      <div style="text-align: center; border-top: 2px solid #34495e; padding-top: 20px;">
        <em>End of Report</em>
      </div>
    `,
  },

  word: {
    id: "word",
    name: "Simple Word Document",
    type: "word",
    styles: `
      @page { margin: 1in; border: 1px solid #000; }
      body {
        font-family: 'Cambria', serif;
        font-size: 12pt;
        padding: 30px;
      }
      h1 {
        font-size: 20pt;
        text-align: center;
        text-decoration: underline;
        margin-bottom: 40px;
      }
      .intro-section {
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid #ccc;
        background: #f9f9f9;
      }
      .intro-field {
        margin: 10px 0;
        font-weight: bold;
      }
      .intro-field span {
        text-decoration: underline;
        display: inline-block;
        min-width: 200px;
      }
      .editable {
        border: 1px dashed #999;
        padding: 10px;
        margin-top: 20px;
      }
    `,
    header: `
      <h1>{{documentTitle}}</h1>
      <div class="intro-section">
        <div class="intro-field">Name: <span contenteditable="true">{{name}}</span></div>
        <div class="intro-field">Topic: <span contenteditable="true">{{topic}}</span></div>
        <div class="intro-field">Date: <span contenteditable="true">{{date}}</span></div>
      </div>
    `,
    footer: ``,
  },

  invoice: {
    id: "invoice",
    name: "Stylish Invoice",
    type: "invoice",
    styles: `
      @page { margin: 1in; }
      body {
        font-family: 'Helvetica Neue', sans-serif;
        color: #2c3e50;
        background: #fefefe;
      }
      .header-page {
        text-align: center;
        background: linear-gradient(90deg, #00c6ff, #0072ff);
        color: white;
        padding: 40px 20px;
        margin-bottom: 30px;
        border-radius: 8px;
      }
      .invoice-title {
        font-size: 28pt;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .invoice-details {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        margin-bottom: 30px;
      }
      .line-items {
        width: 100%;
        border-collapse: collapse;
      }
      .line-items th, .line-items td {
        border: 1px solid #ccc;
        padding: 12px;
        text-align: left;
      }
      .total {
        text-align: right;
        font-size: 16pt;
        font-weight: bold;
        padding-top: 10px;
      }
    `,
    header: `
      <div class="header-page">
        <div class="invoice-title">INVOICE</div>
        <p><strong>Invoice #:</strong> {{invoiceNumber}}</p>
        <p><strong>Date:</strong> {{invoiceDate}}</p>
      </div>
      <div class="invoice-details">
        <div>
          <strong>Billed To:</strong><br/>
          {{clientName}}<br/>
          {{clientAddress}}
        </div>
        <div>
          <strong>From:</strong><br/>
          {{companyName}}<br/>
          {{companyAddress}}
        </div>
      </div>
      <table class="line-items">
        <thead>
          <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
        </thead>
        <tbody contenteditable="true">
          <tr><td>Sample Item</td><td>2</td><td>$50</td><td>$100</td></tr>
        </tbody>
      </table>

    `,
    footer: `
      <div style="text-align: center; padding: 20px; border-top: 1px solid #ccc;">
        <p>Thank you for your business!</p>
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

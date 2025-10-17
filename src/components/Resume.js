import React from "react";

export default function Resume() {
  const pdfPath = "/resume.pdf"; // Place your resume file at public/resume.pdf

  return (
    <div className="resume">
      <div className="btn-row">
        <a className="btn" href={pdfPath} target="_blank" rel="noreferrer">View in new tab</a>
        <a className="btn outline" href={pdfPath} download>Download PDF</a>
      </div>
      <div className="pdf-embed" style={{ marginTop: 16 }}>
        <object data={pdfPath} type="application/pdf" width="100%" height="640px">
          <iframe title="Resume PDF" src={pdfPath} width="100%" height="640px" />
          <p className="muted">If the PDF doesn't load, use the buttons above to open or download the resume.</p>
        </object>
      </div>
    </div>
  );
}

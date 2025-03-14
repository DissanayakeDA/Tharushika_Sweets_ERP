import { useState } from "react";
import { Document, Page } from "react-pdf";

function PdfComp(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Triggered when the PDF is successfully loaded
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to the first page on new load
  }

  // Go to the next page
  const goToNextPage = () => {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  };

  // Go to the previous page
  const goToPrevPage = () => {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="pdf-viewer-container">
      {props.pdfFile ? (
        <div>
          {/* Document Viewer */}
          <Document
            file={props.pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            className="pdf-document"
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {/* Pagination Controls */}
          <div className="pdf-controls">
            <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>PDF File Not Available</p>
      )}
    </div>
  );
}

export default PdfComp;

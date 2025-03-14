import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./Sales.css";
import axios from "axios";
import PdfComp from "./PdfComp";
import { pdfjs } from "react-pdf";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Centralized Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // Replace with your server URL
});

function Sales() {
  const [title, setTitle] = useState("");
  const [file, saveFile] = useState(null);
  const [allPdf, setAllPdf] = useState([]);
  const [recentInvoice, setRecentInvoice] = useState("");
  const [recentUpload, setRecentUpload] = useState("");
  const [pdfFile, setPDFFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchPDFs();

    const recentFile = localStorage.getItem("recentInvoice");
    if (recentFile) {
      setRecentInvoice(recentFile);
      setTitle(recentFile.replace(".pdf", ""));
    }
  }, []);

  // Fetch PDF list
  const fetchPDFs = async () => {
    try {
      const result = await api.get("/getFile");
      setAllPdf(result.data.data);

      if (result.data.data.length > 0) {
        const lastFile = result.data.data[result.data.data.length - 1];
        setRecentUpload(lastFile.filename);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error.message);
    }
  };

  // Handle PDF submission
  const submitPdf = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const result = await api.post("/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (result.data.status === 200) {
        alert("Upload Success");
        fetchPDFs();
        setRecentUpload(file.name);
        saveFile(null);
      } else {
        alert("Upload Error");
      }
    } catch (error) {
      console.error("Error Uploading:", error.message);
      alert("Error Uploading: " + error.message);
    }
  };

  const showPdf = (pdf) => {
    setPDFFile(`http://localhost:5000/files/${pdf}`);
    setIsModalOpen(true); // Open modal when a PDF is selected
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
    setPDFFile(null); // Clear the PDF file
  };

  return (
    <div className="sales-container">
      <Nav />
      <div className="header">
        <h2 className="sales-title">Sales</h2>
        <hr className="hr-sales" />
      </div>

      <div className="content-container">
        {/* Upload Section */}
        <div className="upload-section">
          <h2 className="upload-title">Upload Invoice</h2>
          <form onSubmit={submitPdf} className="upload-form">
            <label htmlFor="pdfTitle" className="form-label">
              PDF Title
            </label>
            <input
              id="pdfTitle"
              type="text"
              value={title}
              placeholder="Enter PDF Title"
              className="form-input"
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="pdfFile" className="form-label">
              Select PDF File
            </label>
            <input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              className="file-input"
              onChange={(e) => saveFile(e.target.files[0])}
              required
            />

            {recentInvoice && (
              <p className="recent-invoice">
                Recently Downloaded: <strong>{recentInvoice}</strong>
                <br />
                <small>Check your Downloads folder.</small>
              </p>
            )}
            {recentUpload && (
              <p className="recent-upload">
                Recently Uploaded: <strong>{recentUpload}</strong>
              </p>
            )}

            <button type="submit" className="submit-button" style={{ color: 'linear-gradient(to right, #37474F, #3d5c6b, #37474F)' }}>
              Submit
            </button>
          </form>
        </div>

        {/* PDF Details */}
        <div className="invoice-list">
          <h2 className="upload-title">Invoice List</h2>
          {allPdf.length === 0 ? (
            <p>No PDFs available</p>
          ) : (
            allPdf.map((data) => (
              <div key={data._id} className="invoice-item">
                <h5>Title: {data.title}</h5>
                <button
                  className="show-pdf-button"
                  onClick={() => showPdf(data.pdf)}
                >
                  Show PDF
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for PDF Viewer */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeModal}>
              &times;
            </button>
            <PdfComp pdfFile={pdfFile} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;

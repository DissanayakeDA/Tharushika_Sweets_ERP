import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PMViewRequests.css";
import PMNav from "../PMNav/PMNav";
import HeadBar from "../HeadBar/HeadBar";

function PMViewRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        if (!user._id) {
          throw new Error("User ID not found in session.");
        }
        const response = await axios.get(
          `http://localhost:5000/api/ingredient-requests?userId=${user._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (response.status === 200 && response.data.success) {
          setRequests(response.data.data);
        } else {
          setError("Failed to fetch your ingredient requests.");
        }
      } catch (err) {
        setError("Server error while fetching requests.");
        console.error("Error fetching user requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRequests();
  }, []);

  return (
    <div className="pm-view-requests-container">
      <HeadBar />
      <PMNav />
      <div className="pm-view-requests-main-content">
        <div className="pm-view-requests-content-wrapper">
          <h2 className="pm-view-requests-title">My Ingredient Requests</h2>
          {isLoading ? (
            <div className="pm-view-requests-loading-spinner">
              <div className="pm-view-requests-spinner"></div>
              <p>Loading your requests...</p>
            </div>
          ) : (
            <div className="pm-view-requests-table-container">
              {error && <p className="pm-view-requests-error-message">{error}</p>}
              {requests.length === 0 ? (
                <p className="pm-view-requests-no-data">No requests found.</p>
              ) : (
                <table className="pm-view-requests-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Ingredient Name</th>
                      <th>Requested Quantity</th>
                      <th>Status</th>
                      <th>Date Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td>{request._id}</td>
                        <td>{request.ingredient_id?.ingredient_name || "Unknown"}</td>
                        <td>{request.request_quantity}</td>
                        <td className={`status-${request.status}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </td>
                        <td>
                          {new Date(request.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PMViewRequests;
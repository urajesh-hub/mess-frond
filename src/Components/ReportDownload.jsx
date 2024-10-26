import React from 'react';
import axios from 'axios';

const ReportDownload = () => {
    const handleDownload = async () => {
        try {
            const response = await axios.get('https://mess-backend-30l4.onrender.com/download/report', {
                responseType: 'blob', // Important for binary data
            });

            // Create a URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'feedback_report.xlsx'); // Specify the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    return (
        <div>
            <button onClick={handleDownload}>Download Feedback Report</button>
        </div>
    );
};

export default ReportDownload;
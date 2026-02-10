// Utility functions for downloading reports in different formats

// CSV Download
export const downloadCSV = (data, filename, headers) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes in CSV
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Excel Download (using CSV format with .xlsx extension)
export const downloadExcel = (data, filename, headers) => {
  // For now, we'll use CSV format but with .xlsx extension
  // In a real application, you'd use a library like xlsx or exceljs
  const csvContent = [
    headers.join('\t'), // Use tab-separated for better Excel compatibility
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        return String(value).replace(/\t/g, ' '); // Remove tabs that might break formatting
      }).join('\t')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PDF Download (using browser print functionality)
export const downloadPDF = (data, filename, title, headers) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.4;
        }
        h1 { 
          color: #333; 
          border-bottom: 2px solid #667eea; 
          padding-bottom: 10px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        th { 
          background-color: #f5f5f5; 
          font-weight: bold; 
        }
        .summary { 
          margin: 20px 0; 
          padding: 15px; 
          background-color: #f9f9f9; 
          border-radius: 5px; 
        }
        .summary-item { 
          display: inline-block; 
          margin-right: 30px; 
          margin-bottom: 10px; 
        }
        .summary-label { 
          font-weight: bold; 
          color: #666; 
        }
        .summary-value { 
          color: #333; 
          font-size: 1.1em; 
        }
        @media print {
          body { margin: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <div class="summary-item">
          <span class="summary-label">Total Records:</span>
          <span class="summary-value">${data.length}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Generated:</span>
          <span class="summary-value">${new Date().toLocaleString()}</span>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(header => `<td>${row[header] || '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Print to PDF
        </button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Generic download function
export const downloadReport = (data, filename, format, title, headers) => {
  switch (format.toLowerCase()) {
    case 'csv':
      downloadCSV(data, filename, headers);
      break;
    case 'excel':
    case 'xlsx':
      downloadExcel(data, filename, headers);
      break;
    case 'pdf':
      downloadPDF(data, filename, title, headers);
      break;
    default:
      console.error('Unsupported format:', format);
  }
};

// Format currency for reports
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

// Format date for reports
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

// Format date time for reports
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN');
};

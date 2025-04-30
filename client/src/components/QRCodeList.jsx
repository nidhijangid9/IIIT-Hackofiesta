// QRCodeList.jsx
import React from 'react';
import mcherry from '../assests/mcherry.png';
import ahelix from '../assests/a-helix.png'
import DNA from '../assests/DNA.png'
import hemo from '../assests/hemo.png'
import GLU from '../assests/GLU.png'
import BetaSheet from '../assests/beta-sheet.png'
const QRCodeList = () => {
  // Sample data with QR code image URLs
  const qrCodeData = [
    {
      id: 1,
      title: "Mcherry",
      qrImageUrl: mcherry,
      description: "Official company website QR code for quick access to our main platform.",
      category: "Website"
    },
    {
      id: 2,
      title: "Alpha Helix",
      qrImageUrl: ahelix,
      description: "Scan to view our complete product catalog with pricing and specifications.",
      category: "Products"
    },
    {
      id: 3,
      title: "DNA",
      qrImageUrl: DNA,
      description: "Quick access to our contact information and support channels.",
      category: "Contact"
    },
    {
        id: 4,
        title: "Hemoglobin",
        qrImageUrl: hemo,
        description: "Quick access to our contact information and support channels.",
        category: "Contact"
    },
    {
        id: 5,
        title: "Hemoglobin",
        qrImageUrl: BetaSheet,
        description: "Quick access to our contact information and support channels.",
        category: "Contact"
    },
    {
        id: 6,
        title: "Beta-Sheet",
        qrImageUrl: BetaSheet,
        description: "Quick access to our contact information and support channels.",
        category: "Contact"
    },
    {
        id: 7,
        title: "CYS",
        qrImageUrl: GLU,
        description: "Quick access to our contact information and support channels.",
        category: "Contact"
    },
    {
        id: 8,
        title: "GLY",
        qrImageUrl: GLU,
        description: "Quick access to our contact information and support channels.",
        category: "Contact"
    },
    {
        id: 9,
        title: "ILE",
        qrImageUrl: GLU,
        description: "Quick access to our contact information and support channels.",
        category: "Contact"
    },

  ];

  // Generate 25 items if less than 25 exist in qrCodeData



  return (
    <div className="qr-code-container">
      <div className="header">
        <h1>QR Code Collection</h1>
        <p>Browse through our collection of QR codes</p>
      </div>

      <div className="card-grid">
        {qrCodeData.map((item) => (
          <div key={item.id} className="card">
            <div className="card-header">
              <div className="title-section">
                <h3>{item.title}</h3>
                <span className="category-badge">{item.category}</span>
              </div>
              <button className="options-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="18" r="2" />
                </svg>
              </button>
            </div>

            <div className="qr-code-wrapper">
              <img 
                src={item.qrImageUrl} 
                alt={`QR Code for ${item.title}`}
                className="qr-code-image"
              />
            </div>

            <p className="description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeList;
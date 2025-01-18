import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
      <>
        <footer className="bg-black text-gray-400 py-8">
          <div className="container mx-auto text-center">
            <div className="flex justify-center space-x-8 mb-4">
              <a href="#" className="hover:text-gray-200">
                About
              </a>
              <a href="#" className="hover:text-gray-200">
                Blog
              </a>
              <a href="#" className="hover:text-gray-200">
                Jobs
              </a>
              <a href="#" className="hover:text-gray-200">
                Press
              </a>
              <a href="#" className="hover:text-gray-200">
                Accessibility
              </a>
              <a href="#" className="hover:text-gray-200">
                Partners
              </a>
            </div>
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="hover:text-gray-200">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <div className="flex items-center justify-center text-gray-500 text-sm space-x-2">
              <Image
                src="/vercel.svg"
                alt="Logo"
                width={20}
                height={20}
              />
              <p>© 2025 Overcast, Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </>
  );
};
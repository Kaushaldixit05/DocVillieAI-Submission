import React from 'react';
import DocumentScanner from './components/DocumentScanner';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">DocuVille.ai Assessment</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-10">
        <DocumentScanner />
      </main>
      
      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            Technical Assessment Submission - Document Capture Application
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
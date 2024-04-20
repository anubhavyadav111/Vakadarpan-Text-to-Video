"use client";

import { useState } from 'react';

const Np = () => {
  const [step, setStep] = useState(1);
  const [textValue, setTextValue] = useState('');
  const [gender, setGender] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle form submission logic based on the collected values
    console.log('Text:', textValue);
    console.log('Gender:', gender);
    console.log('Language:', selectedLanguage);
    // Move to the next step or perform other actions after submission
    handleNextStep();
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4 bg-black rounded-xl text-white">
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold">Step 1: Image Project</h1>
          <p>Teach based on images, from files or your webcam</p>
          <div>
            <label htmlFor="text-input" className="block text-md font-medium text-white">
              Enter Text:
            </label>
            <textarea
              id="text-input"
              rows={4}
              className="w-full p-2 border rounded text-black"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold">Step 2: Select Gender</h1>
          <div className="mb-4">
            <p className="text-sm font-medium text-white">Select Gender:</p>
            <div className="flex flex-row gap-8">
              <button
                className={`flex-1 p-2 border rounded text-center ${
                  gender === 'male' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
                }`}
                onClick={() => setGender('male')}
              >
                Male
              </button>
              <button
                className={`flex-1 p-2 border rounded text-center ${
                  gender === 'female' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
                }`}
                onClick={() => setGender('female')}
              >
                Female
              </button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-2xl font-bold">Step 3: Select Language</h1>
          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-white">
              Select Language:
            </label>
            <select
              id="language-select"
              className="w-full p-2 border rounded text-black"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {/* Your language options */}
            </select>
          </div>
        </>
      )}

      {step < 3 ? (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleNextStep}
        >
          Next
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}

      {step > 1 && (
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          onClick={handlePreviousStep}
        >
          Previous
        </button>
      )}
    </div>
  );
};

export default Np;

import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const result = zxcvbn(password);
  const strengthScore = result.score; // 0-4

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-lime-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'No Password';
    }
  };

  return (
    <div className="mt-1">
      <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 ${i <= strengthScore ? getStrengthColor(strengthScore) : 'bg-gray-200'} transition-all duration-300`}
          />
        ))}
      </div>
      <p className={`mt-1 text-sm ${strengthScore >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
        Password Strength: {getStrengthText(strengthScore)}
      </p>
      {result.feedback.warning && (
        <p className="mt-1 text-sm text-red-500">{result.feedback.warning}</p>
      )}
    </div>
  );
};

export default PasswordStrength;
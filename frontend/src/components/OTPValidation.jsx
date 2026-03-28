import React, { useState, useRef, useEffect } from 'react';

// interface OTPValidationProps {
//   email: string;
//   onVerify: (otp: string) => void;
//   onResend: () => void;
//   isLoading?: boolean;
//   countdown?: number;        // seconds remaining for resend
// }

const OTPValidation=({
  email,
  onVerify,
  onResend,
  isLoading = false,
  countdown = 0,
}) => {

  console.log({
  email,
  onVerify,
  onResend,
  
})
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus last filled input or the next empty one
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-primary-border)] text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[#5D84F9] text-4xl mb-3">🔐</div>
          <h2 className="text-2xl font-semibold mb-2">Verify Your Email</h2>
          <p className="text-[#a0a0a0] text-sm">
            We sent a 6-digit code to<br />
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 bg-[#1E1E1E] border border-[#444] 
                         rounded-xl text-center text-2xl font-semibold 
                         focus:outline-none focus:border-[#5D84F9] 
                         text-white placeholder-gray-500 transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          disabled={otp.join('').length !== 6 || isLoading}
          className="w-full bg-[#5D84F9] hover:bg-[#4a73e0] 
                     disabled:bg-[#3a4f8a] disabled:cursor-not-allowed
                     text-white py-3.5 rounded-xl font-semibold text-base 
                     transition-all duration-200 mt-2"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend Code */}
        <div className="text-center mt-6 text-sm text-[#a0a0a0]">
          Didn’t receive the code?{' '}
          {countdown > 0 ? (
            <span className="text-[#5D84F9]">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              onClick={()=>{onResend()}}
              className="text-[#5D84F9] hover:text-[#7a9cff] underline transition cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>

        <p className="text-center text-xs text-[#666] mt-6">
          Code expires in 24hr 
        </p>
      </div>
    </div>
  );
};

export default OTPValidation;
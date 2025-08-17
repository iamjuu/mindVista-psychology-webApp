import styled from 'styled-components';

export const FormContainer = styled.form`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  min-height: auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 12px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
  letter-spacing: 0.025em;
  
  &::after {
    content: ' *';
    color: #ef4444;
    font-weight: 700;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  color: #1f2937;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
    transform: none;
  }
  
  &[type="date"] {
    cursor: pointer;
    
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      filter: invert(0.5);
      transition: filter 0.2s ease;
      
      &:hover {
        filter: invert(0.3);
      }
    }
  }
  
  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  color: #1f2937;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
    transform: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  }
  
  option {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  optgroup {
    font-weight: 600;
    color: #374151;
    background-color: #f9fafb;
    
    option {
      font-weight: 400;
      color: #1f2937;
      background-color: #ffffff;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
    padding-right: 2rem;
    background-size: 1.2em 1.2em;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.025em;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
`;

// Additional styled components for enhanced UI
export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  
  &::before {
    content: '';
    width: 14px;
    height: 14px;
    border: 2px solid #d1d5db;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.4rem;
    
    &::before {
      width: 12px;
      height: 12px;
    }
  }
`;

export const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
    
    h2 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

export const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

export const FieldGroupThree = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

export const RequiredNote = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-top: 0.8rem;
    padding: 0.4rem;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  color: #1f2937;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
    min-height: 70px;
  }
`;
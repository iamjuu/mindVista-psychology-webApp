# API Endpoints for Registration Data Management

## Overview
This document outlines the new API endpoints needed to support saving registration data immediately when the form is submitted, before payment completion.

## New Endpoints

### 1. Save Registration Data
**Endpoint:** `POST /save-registration`
**Purpose:** Save registration data immediately when form is submitted
**Request Body:**
```json
{
  "name": "string",
  "email": "string", 
  "number": "string",
  "location": "string",
  "age": "string",
  "slot": "string",
  "time": "string",
  "date": "string",
  "doctor": "string",
  "doctorName": "string",
  "status": "pending",
  "createdAt": "ISO date string",
  "paymentStatus": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration saved successfully",
  "data": {
    "_id": "registration_id",
    "name": "string",
    "email": "string",
    // ... all other fields
    "status": "pending",
    "paymentStatus": "pending"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `403` - Email already registered
- `409` - Time slot conflict
- `500` - Server error

### 2. Create Appointment with Receipt Upload
**Endpoint:** `POST /appointment`
**Purpose:** Create appointment and upload receipt in a single API call
**Request Body:** `multipart/form-data`
```form-data
receipt: [file] // Receipt image/PDF file
appointmentData: [JSON string] // All appointment data including payment confirmation
```

**appointmentData JSON structure:**
```json
{
  "name": "string",
  "email": "string",
  "number": "string",
  "location": "string",
  "age": "string",
  "slot": "string",
  "time": "string",
  "date": "string",
  "doctor": "string",
  "doctorName": "string",
  "status": "confirmed",
  "paymentStatus": "completed",
  "paymentCompletedAt": "ISO date string",
  "receiptUploaded": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "appointment_id",
    // ... all appointment fields
    "status": "confirmed",
    "paymentStatus": "completed",
    "receiptFile": "file_path_or_url"
  }
}
```

## Database Schema Changes

### Registration Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  number: String,
  location: String,
  age: String,
  slot: String,
  time: String,
  date: String,
  doctor: ObjectId, // Reference to doctor
  doctorName: String,
  status: String, // "pending", "confirmed", "cancelled"
  paymentStatus: String, // "pending", "completed", "failed"
  createdAt: Date,
  paymentCompletedAt: Date,
  receiptUploaded: Boolean,
  receiptFile: String // File path/URL
}
```

## Implementation Notes

1. **Immediate Save:** Registration data is saved as soon as the form is submitted
2. **Status Tracking:** Use status and paymentStatus fields to track the registration lifecycle
3. **Conflict Prevention:** Check for time slot conflicts when saving registration
4. **Email Validation:** Ensure email uniqueness or handle existing registrations appropriately
5. **Payment Flow:** After payment, create appointment with receipt upload in single API call
6. **File Handling:** Receipt files are uploaded along with appointment data

## Migration from Current System

1. **Existing Appointments:** Keep existing `/appointment` endpoint for backward compatibility
2. **New Flow:** Use new endpoints for new registrations
3. **Data Consistency:** Ensure both systems maintain consistent data structure
4. **Admin Panel:** Update admin panel to handle both old and new data formats

## Security Considerations

1. **Input Validation:** Validate all input fields before saving
2. **Rate Limiting:** Prevent spam registrations
3. **Email Verification:** Consider adding email verification step
4. **Data Privacy:** Ensure compliance with data protection regulations
5. **File Upload Security:** Validate file types and sizes for receipt uploads

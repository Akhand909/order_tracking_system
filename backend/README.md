# Order Tracking System Backend

This is the backend for the Order Tracking System.

## Prerequisites

- Java 17+
- Maven 3.6+

## Running the Application

**IMPORTANT:** Always use the `run_backend.ps1` script to start the application. This script handles cleaning up any old processes running on the application port (8081) to prevent startup failures.

### PowerShell
```powershell
.\run_backend.ps1
```

Or if you are in Command Prompt:
```cmd
powershell -ExecutionPolicy Bypass -File run_backend.ps1
```

## Running Tests

```bash
mvn test
```

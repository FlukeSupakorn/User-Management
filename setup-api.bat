@echo off
echo Setting up User Management API...

cd /d "c:\Work\Internship\Gofive\Assignment\User-Management\API\user-management\user-management"

echo Building the project...
dotnet build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Adding Entity Framework migration...
dotnet ef migrations add InitialMigration --force
if %ERRORLEVEL% neq 0 (
    echo Migration creation failed!
    pause
    exit /b 1
)

echo Updating database...
dotnet ef database update
if %ERRORLEVEL% neq 0 (
    echo Database update failed!
    pause
    exit /b 1
)

echo Starting API server...
dotnet run --urls "https://localhost:7001;http://localhost:5001"

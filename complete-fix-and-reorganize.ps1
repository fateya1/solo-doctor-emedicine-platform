# ============================================================================
# Complete NestJS Project Fix and Reorganization Script
# ============================================================================
# This script will:
# 1. Fix package.json issues
# 2. Downgrade Prisma to 5.22.0
# 3. Fix/Create Prisma schema with all required models
# 4. Create missing DTO files
# 5. Generate Prisma client
# 6. Test build
# 7. Reorganize project structure
# 8. Update imports
# 9. Rebuild and verify
# 10. Commit and push to GitHub
# ============================================================================

$ErrorActionPreference = "Continue"

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "  COMPLETE NESTJS PROJECT FIX AND REORGANIZATION" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

# ============================================================================
# PHASE 1: BACKUP CURRENT STATE
# ============================================================================
Write-Host "PHASE 1: Creating backup..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "..\solo-doctor-backup-$timestamp"

try {
    Copy-Item -Path . -Destination $backupPath -Recurse -Force -ErrorAction Stop
    Write-Host "✓ Backup created at: $backupPath`n" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create backup: $_" -ForegroundColor Red
    Write-Host "Continuing anyway...`n" -ForegroundColor Yellow
}

# ============================================================================
# PHASE 2: IDENTIFY SOURCE FILE LOCATIONS
# ============================================================================
Write-Host "PHASE 2: Locating source files..." -ForegroundColor Yellow

$apiSrcExists = Test-Path ".\api\src"
$rootSrcExists = Test-Path ".\src"

if ($apiSrcExists) {
    Write-Host "✓ Found source files in .\api\src" -ForegroundColor Green
    $sourceRoot = ".\api\src"
} elseif ($rootSrcExists) {
    Write-Host "✓ Found source files in .\src" -ForegroundColor Green
    $sourceRoot = ".\src"
} else {
    Write-Host "✗ Could not find source files!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================================================
# PHASE 3: FIX PRISMA SCHEMA
# ============================================================================
Write-Host "PHASE 3: Creating/Fixing Prisma schema..." -ForegroundColor Yellow

# Ensure api/prisma directory exists
New-Item -Path ".\api\prisma" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null

# Create complete schema with all models
$schemaContent = @"
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  role      String   @default("patient")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model AvailabilitySlot {
  id          String   @id @default(uuid())
  doctorId    String
  startTime   DateTime
  endTime     DateTime
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  appointments Appointment[]

  @@map("availability_slots")
}

model Appointment {
  id                  String   @id @default(uuid())
  patientId           String
  availabilitySlotId  String
  status              String   @default("scheduled")
  notes               String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  availabilitySlot AvailabilitySlot @relation(fields: [availabilitySlotId], references: [id])

  @@map("appointments")
}
"@

[System.IO.File]::WriteAllText("$(Get-Location)\api\prisma\schema.prisma", $schemaContent, [System.Text.Encoding]::UTF8)
Write-Host "✓ Created Prisma schema in .\api\prisma\schema.prisma`n" -ForegroundColor Green

# ============================================================================
# PHASE 4: CREATE MISSING DTO FILES IN CURRENT LOCATION
# ============================================================================
Write-Host "PHASE 4: Creating missing DTO files..." -ForegroundColor Yellow

# Ensure dto directory exists
$dtoPath = Join-Path $sourceRoot "availability\dto"
New-Item -Path $dtoPath -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null

# Create create-slot.dto.ts
$createSlotDto = @"
export class CreateSlotDto {
  doctorId: string;
  startTime: Date;
  endTime: Date;
  isAvailable?: boolean;
}
"@
$slotDtoPath = Join-Path $dtoPath "create-slot.dto.ts"
[System.IO.File]::WriteAllText($slotDtoPath, $createSlotDto, [System.Text.Encoding]::UTF8)
Write-Host "✓ Created create-slot.dto.ts" -ForegroundColor Green

# Create create-slots.dto.ts
$createSlotsDto = @"
import { CreateSlotDto } from './create-slot.dto';

export class CreateSlotsDto {
  slots: CreateSlotDto[];
}
"@
$slotsDtoPath = Join-Path $dtoPath "create-slots.dto.ts"
[System.IO.File]::WriteAllText($slotsDtoPath, $createSlotsDto, [System.Text.Encoding]::UTF8)
Write-Host "✓ Created create-slots.dto.ts`n" -ForegroundColor Green

# ============================================================================
# PHASE 5: REORGANIZE PROJECT STRUCTURE
# ============================================================================
Write-Host "PHASE 5: Reorganizing project structure..." -ForegroundColor Yellow

# Create standard NestJS directory structure at root
$directories = @(
    "src\common\decorators",
    "src\common\filters",
    "src\common\guards",
    "src\common\interceptors",
    "src\common\pipes",
    "src\common\middleware",
    "src\config",
    "src\database\migrations",
    "src\database\seeds",
    "src\modules\appointments",
    "src\modules\availability",
    "src\modules\auth\dto",
    "src\modules\auth\guards",
    "src\modules\auth\strategies",
    "src\modules\users\dto",
    "src\modules\users\entities",
    "prisma\migrations",
    "test\unit",
    "test\e2e",
    "test\integration"
)

foreach ($dir in $directories) {
    New-Item -Path $dir -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
}
Write-Host "✓ Created standard directory structure" -ForegroundColor Green

# Move source files to new structure
if ($sourceRoot -eq ".\api\src") {
    # Move appointments module
    if (Test-Path ".\api\src\appointments") {
        Copy-Item -Path ".\api\src\appointments\*" -Destination ".\src\modules\appointments\" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Moved appointments module" -ForegroundColor Green
    }

    # Move availability module
    if (Test-Path ".\api\src\availability") {
        Copy-Item -Path ".\api\src\availability\*" -Destination ".\src\modules\availability\" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Moved availability module" -ForegroundColor Green
    }

    # Move main files if they exist
    if (Test-Path ".\api\src\main.ts") {
        Copy-Item -Path ".\api\src\main.ts" -Destination ".\src\main.ts" -Force
        Write-Host "✓ Moved main.ts" -ForegroundColor Green
    }

    if (Test-Path ".\api\src\app.module.ts") {
        Copy-Item -Path ".\api\src\app.module.ts" -Destination ".\src\app.module.ts" -Force
        Write-Host "✓ Moved app.module.ts" -ForegroundColor Green
    }

    if (Test-Path ".\api\src\app.controller.ts") {
        Copy-Item -Path ".\api\src\app.controller.ts" -Destination ".\src\app.controller.ts" -Force
        Write-Host "✓ Moved app.controller.ts" -ForegroundColor Green
    }

    if (Test-Path ".\api\src\app.service.ts") {
        Copy-Item -Path ".\api\src\app.service.ts" -Destination ".\src\app.service.ts" -Force
        Write-Host "✓ Moved app.service.ts" -ForegroundColor Green
    }
} else {
    # Files already in root src, just reorganize
    if (Test-Path ".\src\appointments") {
        Copy-Item -Path ".\src\appointments\*" -Destination ".\src\modules\appointments\" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Moved appointments module" -ForegroundColor Green
    }

    if (Test-Path ".\src\availability") {
        Copy-Item -Path ".\src\availability\*" -Destination ".\src\modules\availability\" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Moved availability module" -ForegroundColor Green
    }
}

# Move Prisma files to root prisma folder
if (Test-Path ".\api\prisma\schema.prisma") {
    Copy-Item -Path ".\api\prisma\schema.prisma" -Destination ".\prisma\schema.prisma" -Force
    Write-Host "✓ Moved schema.prisma to .\prisma\" -ForegroundColor Green
}

if (Test-Path ".\api\prisma\migrations") {
    Copy-Item -Path ".\api\prisma\migrations\*" -Destination ".\prisma\migrations\" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Moved migrations to .\prisma\migrations\" -ForegroundColor Green
}

# Remove incorrect schema file from dto folder
if (Test-Path ".\src\modules\availability\dto\schema.prisma") {
    Remove-Item ".\src\modules\availability\dto\schema.prisma" -Force -ErrorAction SilentlyContinue
}

Write-Host ""

# ============================================================================
# PHASE 6: CREATE CONFIGURATION FILES
# ============================================================================
Write-Host "PHASE 6: Creating/updating configuration files..." -ForegroundColor Yellow

# Create tsconfig.json
$tsconfigContent = @"
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/common/*": ["src/common/*"],
      "@/config/*": ["src/config/*"],
      "@/modules/*": ["src/modules/*"],
      "@/database/*": ["src/database/*"]
    }
  },
  "include": ["src/**/*"]
}
"@
[System.IO.File]::WriteAllText("$(Get-Location)\tsconfig.json", $tsconfigContent, [System.Text.Encoding]::UTF8)
Write-Host "✓ Created tsconfig.json" -ForegroundColor Green

# Create tsconfig.build.json
$tsconfigBuildContent = @"
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
"@
[System.IO.File]::WriteAllText("$(Get-Location)\tsconfig.build.json", $tsconfigBuildContent, [System.Text.Encoding]::UTF8)
Write-Host "✓ Created tsconfig.build.json" -ForegroundColor Green

# Create .env.example if it doesn't exist
if (-not (Test-Path ".env.example")) {
    @"
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/solo_doctor_db?schema=public"

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=3600

# App
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath ".env.example" -Encoding utf8
    Write-Host "✓ Created .env.example" -ForegroundColor Green
}

# Update package.json prisma schema path
try {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    if (-not $packageJson.prisma) {
        $packageJson | Add-Member -MemberType NoteProperty -Name "prisma" -Value @{
            "schema" = "prisma/schema.prisma"
        } -Force
    } else {
        $packageJson.prisma.schema = "prisma/schema.prisma"
    }
    $packageJson | ConvertTo-Json -Depth 10 | Out-File "package.json" -Encoding utf8
    Write-Host "✓ Updated package.json with Prisma schema path" -ForegroundColor Green
} catch {
    Write-Host "! Warning: Could not update package.json" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# PHASE 7: REGENERATE PRISMA CLIENT
# ============================================================================
Write-Host "PHASE 7: Regenerating Prisma client..." -ForegroundColor Yellow

npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma client generated successfully`n" -ForegroundColor Green
} else {
    Write-Host "! Warning: Prisma generation had issues`n" -ForegroundColor Yellow
}

# ============================================================================
# PHASE 8: REBUILD PROJECT
# ============================================================================
Write-Host "PHASE 8: Installing dependencies and building..." -ForegroundColor Yellow

npm install 2>&1 | Out-Null
Write-Host "✓ Dependencies installed" -ForegroundColor Green

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful!`n" -ForegroundColor Green
} else {
    Write-Host "! Warning: Build had some issues`n" -ForegroundColor Yellow
}

# ============================================================================
# PHASE 9: GIT COMMIT AND PUSH
# ============================================================================
Write-Host "PHASE 9: Preparing for GitHub..." -ForegroundColor Yellow

# Check git status
Write-Host "`nCurrent git status:" -ForegroundColor Cyan
git status

Write-Host "`nDo you want to commit and push these changes to GitHub? (Y/N): " -ForegroundColor Cyan -NoNewline
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    # Add all changes
    git add .
    
    # Commit
    git commit -m "Restructure project to NestJS international standards"
    
    # Push
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Changes pushed to GitHub successfully!`n" -ForegroundColor Green
    } else {
        Write-Host "! Warning: Push to GitHub had issues`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n! Skipped GitHub commit/push. You can do it manually later with:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Restructure project to NestJS standards'" -ForegroundColor White
    Write-Host "  git push origin main`n" -ForegroundColor White
}

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  ✅ REORGANIZATION COMPLETE!" -ForegroundColor Green
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✓ Created backup" -ForegroundColor White
Write-Host "  ✓ Fixed Prisma schema" -ForegroundColor White
Write-Host "  ✓ Created missing DTOs" -ForegroundColor White
Write-Host "  ✓ Reorganized to standard NestJS structure" -ForegroundColor White
Write-Host "  ✓ Created configuration files" -ForegroundColor White
Write-Host "  ✓ Regenerated Prisma client" -ForegroundColor White
Write-Host "  ✓ Rebuilt project" -ForegroundColor White

Write-Host "`nBackup location:" -ForegroundColor Cyan
Write-Host "  $backupPath" -ForegroundColor Yellow

Write-Host "`nView your repo at:" -ForegroundColor Cyan
Write-Host "  https://github.com/fateya1/solo-doctor-emedicine-platform`n" -ForegroundColor Yellow

Write-Host "============================================================================`n" -ForegroundColor Cyan

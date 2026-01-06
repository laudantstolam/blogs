@echo off
setlocal enabledelayedexpansion

@REM REM Define paths
@REM set "SourcePath="
@REM set "DestPath="
@REM set "RepoPath="


REM Or use .env file to set these variables
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" (
        if not "%%a"=="" set "%%a=%%b"
    )
)

set "SourcePath=%SOURCE_PATH%"
set "DestPath=%DEST_PATH%"
set "RepoPath=%REPO_PATH%"

REM Copy files
echo Copying files to Blog folder...
xcopy /E /I /Y /Q "%SourcePath%" "%DestPath%"

REM Change to repo directory
cd /d "%RepoPath%"

REM Sync files to src/content/blog with line ending normalization
echo Syncing files with line ending normalization...
node scripts/sync-obsidian.js
echo Files synced successfully!

REM Start dev server in new window -- optional
@REM start "Dev Server" cmd /k "pnpm run dev"

REM Git add
git add .

REM Commit and push
git commit -m "[content] update blog (auto-commit)"
git push

pause

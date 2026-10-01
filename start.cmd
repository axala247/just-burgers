@echo off
rem Starts the site at http://localhost:5173 using the portable Node in .tools
cd /d "%~dp0"
".tools\node\node.exe" node_modules\vite\bin\vite.js --open

@echo off

@echo %~dp0

start python %~dp0upload.py --basedir=%~dp0 --outfile=file.txt

@REM pause
@echo off
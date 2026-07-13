:: Dieses File dient als Verknüpfung für den Desktop um das programm zu starten
:: This file serves as a desktop shortcut to start the program

@echo off
echo Starte Lotto Analyzer...

::FIX: Wechselt automatisch in den Ordner, in dem diese .bat Datei liegt (WIN-Eigenheit)
::FIX: Automatically changes to the directory where this .bat file is located (Windows quirk)
cd /d "%~dp0"

npm start
pause

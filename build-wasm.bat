@echo off
setlocal
pushd "%~dp0"

cargo build --manifest-path rust\pixel-core\Cargo.toml --release --target wasm32-unknown-unknown
if errorlevel 1 exit /b %errorlevel%

if not exist wasm mkdir wasm
copy /y rust\pixel-core\target\wasm32-unknown-unknown\release\pixel_core.wasm wasm\pixel_core.wasm >nul
if errorlevel 1 exit /b %errorlevel%

echo Built wasm\pixel_core.wasm

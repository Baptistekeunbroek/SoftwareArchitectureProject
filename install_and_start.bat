@echo off

set "directories=orders payment product sessions users"

for %%d in (%directories%) do (
    echo Installing dependencies and starting in %%d...
    cd %%d || (
        echo Error: %%d directory not found
        exit /b 1
    )
    
    npm install && start /b npm start
    cd ..
)

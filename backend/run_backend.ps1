$port = 8081
$maxRetries = 5
$retryCount = 0

Write-Host "Checking for process on port $port..."

do {
    $tcpConnection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($tcpConnection) {
        $pid_to_kill = $tcpConnection.OwningProcess
        Write-Host "Found process ID $pid_to_kill listening on port $port. Killing it..."
        Stop-Process -Id $pid_to_kill -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        
        # Verify it's gone
        $checkAgain = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($checkAgain) {
            Write-Host "Process $pid_to_kill still active. Retrying..."
            $retryCount++
        }
        else {
            Write-Host "Process killed successfully."
            break
        }
    }
    else {
        Write-Host "No process found on port $port."
        break
    }
} while ($retryCount -lt $maxRetries)

if ($retryCount -eq $maxRetries) {
    Write-Error "Failed to free up port $port after $maxRetries attempts. Please check manually."
    exit 1
}

Write-Host "Starting Spring Boot Application..."
mvn spring-boot:run

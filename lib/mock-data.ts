// Function to generate mock traffic data based on configuration
export function generateMockTrafficData(laneCount = 4, highThreshold = 15, mediumThreshold = 8) {
  const lanes = []

  for (let i = 1; i <= laneCount; i++) {
    // Generate random vehicle count between 3 and 25
    const vehicleCount = Math.floor(Math.random() * 23) + 3

    // Determine density based on thresholds
    let density: "high" | "medium" | "low"
    let allocatedTime: number

    if (vehicleCount >= highThreshold) {
      density = "high"
      allocatedTime = 60
    } else if (vehicleCount >= mediumThreshold) {
      density = "medium"
      allocatedTime = 30
    } else {
      density = "low"
      allocatedTime = 15
    }

    // Random chance for emergency vehicle (10% chance)
    const hasEmergencyVehicle = Math.random() < 0.1

    // Emergency vehicles always get 60 seconds
    if (hasEmergencyVehicle) {
      density = "high"
      allocatedTime = 60
    }

    lanes.push({
      id: i,
      vehicleCount,
      hasEmergencyVehicle,
      density,
      allocatedTime,
    })
  }

  return {
    lanes,
    timestamp: new Date().toISOString(),
    processingTime: (Math.random() * 2 + 1).toFixed(1) + " seconds",
  }
}

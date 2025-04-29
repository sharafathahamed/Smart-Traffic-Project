type TrafficLightState = "red" | "yellow" | "green"

interface TrafficLightProps {
  state: TrafficLightState
  active: boolean
}

export default function TrafficLight({ state, active }: TrafficLightProps) {
  return (
    <div
      className={`w-16 h-40 bg-gray-800 rounded-lg p-3 flex flex-col items-center justify-between ${active ? "ring-2 ring-primary" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-full ${state === "red" ? "bg-red-500" : "bg-red-900"} ${state === "red" ? "animate-pulse" : ""}`}
      />
      <div
        className={`w-10 h-10 rounded-full ${state === "yellow" ? "bg-yellow-400" : "bg-yellow-900"} ${state === "yellow" ? "animate-pulse" : ""}`}
      />
      <div
        className={`w-10 h-10 rounded-full ${state === "green" ? "bg-green-500" : "bg-green-900"} ${state === "green" ? "animate-pulse" : ""}`}
      />
    </div>
  )
}

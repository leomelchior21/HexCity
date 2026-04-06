export type ComponentType = "actuator" | "sensor";
export type SimType =
  | "led"
  | "rgb"
  | "servo180"
  | "stepper"
  | "buzzer"
  | "relay"
  | "potentiometer"
  | "button"
  | "ldr"
  | "ultrasonic"
  | "temp"
  | "humidity"
  | "turbidity"
  | "waterlevel"
  | "rain"
  | "soil";

export interface ComponentDef {
  id: string;
  name: string;
  type: ComponentType;
  simType: SimType;
  icon: string;
  color: string;
  tagline: string;
  description: string;
  pins: { name: string; color: string; desc: string }[];
  howItWorks: string;
}

export const COMPONENTS: ComponentDef[] = [
  // ACTUATORS
  {
    id: "led",
    name: "LED",
    type: "actuator",
    simType: "led",
    icon: "💡",
    color: "#F59E0B",
    tagline: "Light Emitting Diode",
    description: "Emits light when electric current flows through it. Used for signaling and illumination in projects.",
    pins: [
      { name: "VCC (+)", color: "#EF4444", desc: "Positive — anode (+)" },
      { name: "GND (−)", color: "#6B7280", desc: "Negative — cathode (−)" },
    ],
    howItWorks: "When voltage is applied between anode and cathode, electrons recombine and emit photons. Arduino controls the digital pin (HIGH = on, LOW = off) or PWM for brightness.",
  },
  {
    id: "rgb",
    name: "RGB LED",
    type: "actuator",
    simType: "rgb",
    icon: "🌈",
    color: "#8B5CF6",
    tagline: "Red Green Blue LED",
    description: "Three LEDs in a single component — mix R, G, B channels to create any color of the spectrum.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "Power supply" },
      { name: "R", color: "#EF4444", desc: "Red channel (PWM)" },
      { name: "G", color: "#22C55E", desc: "Green channel (PWM)" },
      { name: "B", color: "#06B6D4", desc: "Blue channel (PWM)" },
    ],
    howItWorks: "Each channel (R, G, B) is controlled individually with PWM (0–255). Combining values produces any color. analogWrite(pinR, 255) sets red to maximum brightness.",
  },
  {
    id: "servo180",
    name: "Servo 180°",
    type: "actuator",
    simType: "servo180",
    icon: "⚙️",
    color: "#06B6D4",
    tagline: "Angular position motor",
    description: "Motor that rotates to a specific angle (0° to 180°). Perfect for controlling gates, robotic arms and valves.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "SIGNAL", color: "#F59E0B", desc: "PWM control signal" },
    ],
    howItWorks: "The servo uses PWM signals (1ms–2ms pulses) to determine angle. In Arduino: servo.write(90) positions at 90°. Internally: DC motor + gears + encoder.",
  },
  {
    id: "stepper",
    name: "Stepper Motor",
    type: "actuator",
    simType: "stepper",
    icon: "🔩",
    color: "#22C55E",
    tagline: "Precise step-by-step motor",
    description: "Moves in discrete steps, allowing precise control of position and speed. Ideal for CNC, 3D printers and robotics.",
    pins: [
      { name: "IN1", color: "#EF4444", desc: "Coil A — input 1" },
      { name: "IN2", color: "#F59E0B", desc: "Coil A — input 2" },
      { name: "IN3", color: "#22C55E", desc: "Coil B — input 1" },
      { name: "IN4", color: "#06B6D4", desc: "Coil B — input 2" },
      { name: "VCC", color: "#EF4444", desc: "5V (via driver)" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
    ],
    howItWorks: "The stepper moves by energizing coils in sequence. Using a ULN2003 or A4988 driver, Arduino sends step + direction signals. Each step = a fixed angle (e.g. 5.625° for 28BYJ-48). Full rotation = 64 steps (with gearbox: 2048).",
  },
  {
    id: "buzzer",
    name: "Buzzer",
    type: "actuator",
    simType: "buzzer",
    icon: "🔔",
    color: "#EF4444",
    tagline: "Sound emitter",
    description: "Generates sounds and alarms. Active buzzer beeps when activated; passive allows you to control frequency and melody.",
    pins: [
      { name: "VCC (+)", color: "#EF4444", desc: "Positive" },
      { name: "GND (−)", color: "#6B7280", desc: "Negative" },
    ],
    howItWorks: "tone(pin, frequency, duration) generates a square wave at the desired frequency. 440Hz = note A4. noTone(pin) stops the sound.",
  },
  {
    id: "relay",
    name: "Relay",
    type: "actuator",
    simType: "relay",
    icon: "🔌",
    color: "#7C3AED",
    tagline: "Electrically controlled switch",
    description: "Allows Arduino to safely control high-voltage circuits (110V/220V). A 5V signal switches the load. Common devices: fan, water pump, lamp, heater.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "IN1", color: "#F59E0B", desc: "Channel 1 control" },
      { name: "IN2", color: "#F59E0B", desc: "Channel 2 control" },
      { name: "IN3", color: "#F59E0B", desc: "Channel 3 control" },
      { name: "IN4", color: "#F59E0B", desc: "Channel 4 control" },
    ],
    howItWorks: "Arduino sends LOW or HIGH to each IN pin. The relay uses electromagnetic coils to open/close mechanical switches that control connected loads like fans, pumps, lamps or heaters. Each channel is isolated from the Arduino for safety.",
  },
  // SENSORS
  {
    id: "potentiometer",
    name: "Potentiometer",
    type: "sensor",
    simType: "potentiometer",
    icon: "🎛️",
    color: "#F59E0B",
    tagline: "Variable resistor",
    description: "Rotate to generate a proportional voltage (0 to 5V). Read as an analog value from 0 to 1023.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "WIPER", color: "#F59E0B", desc: "Analog output" },
    ],
    howItWorks: "analogRead(A0) returns 0–1023. Map with map(val, 0, 1023, 0, 180) to use with a servo, for example.",
  },
  {
    id: "button",
    name: "Button",
    type: "sensor",
    simType: "button",
    icon: "🔘",
    color: "#06B6D4",
    tagline: "Momentary switch",
    description: "Closes the circuit while pressed. Read as HIGH or LOW on the Arduino.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V (with pull-up resistor)" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "OUT", color: "#F59E0B", desc: "Digital signal" },
    ],
    howItWorks: "digitalRead(pin) returns HIGH (released) or LOW (pressed) with internal pull-up. Use INPUT_PULLUP in setup().",
  },
  {
    id: "ldr",
    name: "LDR",
    type: "sensor",
    simType: "ldr",
    icon: "☀️",
    color: "#F59E0B",
    tagline: "Light Dependent Resistor",
    description: "Higher resistance in low light, lower resistance in bright light. Forms a voltage divider to measure luminosity.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "A0", color: "#F59E0B", desc: "Analog output" },
    ],
    howItWorks: "analogRead() returns high values in dark environments and low values in bright ones (with standard voltage divider). Calibrate with map().",
  },
  {
    id: "ultrasonic",
    name: "Ultrasonic",
    type: "sensor",
    simType: "ultrasonic",
    icon: "📡",
    color: "#06B6D4",
    tagline: "HC-SR04 distance sensor",
    description: "Emits ultrasound pulses and measures return time to calculate distance from 2cm to 400cm.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "TRIG", color: "#F59E0B", desc: "Pulse trigger" },
      { name: "ECHO", color: "#22C55E", desc: "Echo reception" },
    ],
    howItWorks: "Send a 10µs pulse on TRIG. Measure ECHO duration. Distance = (time × speed_of_sound) / 2. Formula: cm = pulseIn(ECHO, HIGH) / 58.",
  },
  {
    id: "temp",
    name: "Temperature",
    type: "sensor",
    simType: "temp",
    icon: "🌡️",
    color: "#EF4444",
    tagline: "DHT11/LM35 sensor",
    description: "Measures ambient temperature in Celsius. Essential for ventilation control and urban comfort monitoring.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "DATA", color: "#F59E0B", desc: "Digital signal" },
    ],
    howItWorks: "DHT11 uses a one-wire digital protocol. Use the DHT library: dht.readTemperature() returns a float in Celsius.",
  },
  {
    id: "humidity",
    name: "Humidity",
    type: "sensor",
    simType: "humidity",
    icon: "💧",
    color: "#06B6D4",
    tagline: "Air humidity sensor",
    description: "Measures relative air humidity (0%–100%). Usually integrated with DHT11/DHT22 alongside temperature.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "DATA", color: "#F59E0B", desc: "Digital signal" },
    ],
    howItWorks: "dht.readHumidity() returns % relative humidity. Combine with temperature to calculate thermal comfort index.",
  },
  {
    id: "turbidity",
    name: "Water Turbidity",
    type: "sensor",
    simType: "turbidity",
    icon: "🌊",
    color: "#8B5CF6",
    tagline: "Water clarity sensor",
    description: "Measures water clarity by detecting suspended particles. The more turbid the water, the higher the value.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "A0", color: "#F59E0B", desc: "Analog output" },
    ],
    howItWorks: "The sensor uses an LED and photodetector. Particles in water scatter light, reducing voltage on the photodetector. analogRead() returns 0–1023.",
  },
  {
    id: "waterlevel",
    name: "Water Level",
    type: "sensor",
    simType: "waterlevel",
    icon: "📊",
    color: "#06B6D4",
    tagline: "Reservoir level sensor",
    description: "Detects water height in a reservoir. Prevents overflows and monitors water storage.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "S", color: "#F59E0B", desc: "Analog output" },
    ],
    howItWorks: "Conductive traces become more submerged at higher levels, reducing resistance. analogRead() increases as water level rises.",
  },
  {
    id: "rain",
    name: "Rain Sensor",
    type: "sensor",
    simType: "rain",
    icon: "🌧️",
    color: "#7C3AED",
    tagline: "Precipitation detector",
    description: "Detects the presence of water on the surface (rain). Can trigger irrigation systems or alerts.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "D0", color: "#22C55E", desc: "Digital (rain yes/no)" },
      { name: "A0", color: "#F59E0B", desc: "Analog (intensity)" },
    ],
    howItWorks: "The detection board has traces that become conductive when wet. digitalRead returns LOW when raining (active LOW).",
  },
  {
    id: "soil",
    name: "Soil Humidity",
    type: "sensor",
    simType: "soil",
    icon: "🌱",
    color: "#22C55E",
    tagline: "Soil moisture sensor",
    description: "Measures soil moisture. Essential for automatic irrigation and monitoring urban green areas.",
    pins: [
      { name: "VCC", color: "#EF4444", desc: "5V" },
      { name: "GND", color: "#6B7280", desc: "Ground" },
      { name: "A0", color: "#F59E0B", desc: "Analog output" },
      { name: "D0", color: "#22C55E", desc: "Digital output" },
    ],
    howItWorks: "Two electrodes measure soil resistivity. Wet soil = less resistance = more current. analogRead() returns HIGH values for DRY soil.",
  },
];

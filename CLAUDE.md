# HEXCITY — Project Guide for Claude

## What is HexCity?
Interactive Next.js web platform for a 9th-grade smart city project. Students design and build physical hexagonal city models using Arduino electronics, then document the process here.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4 + custom CSS
- **Animation**: Framer Motion (available, use when needed)
- **Runtime**: React 18

## Class Structure
- **4 classes**: 9A, 9B, 9C, 9D (ninth grade)
- **7 groups** per class (28 total groups)
- **Each class builds one physical HexCity** → 4 HexCities total
- Cities are named: HexCity 9A, HexCity 9B, HexCity 9C, HexCity 9D

## Project Timeline
| Month | Phase | Status |
|-------|-------|--------|
| FEB 2026 | Arduino Basics | Done |
| MAR 2026 | Advanced Arduino | Done |
| APR 2026 | Ideation | Current |
| MAY 2026 | Prototyping | Upcoming |
| JUN 2026 | Testing | Upcoming |
| JUL 2026 | Summer Break | Vacation |
| AUG 2026 | Exhibition Finale | Upcoming |

## Pages
| Route | Title | Description |
|-------|-------|-------------|
| `/` | Home | Landing page — project hub |
| `/lab` | Ardudeck | Arduino component simulator (NOT "Component Lab") |
| `/simulation` | City Simulation | Hex city traffic/flow engine |
| `/design-thinking` | Design Thinking | Process documentation |

## Design System
- **Theme**: Deep black (`#000000`) — Behance award-winning aesthetic
- **Glass effect**: Apple liquid glass — `backdrop-filter: blur(20px) saturate(180%)` + subtle white tint
- **Primary accent**: Purple `#7C3AED`
- **Secondary accents**: Cyan `#06B6D4`, Green `#22C55E`, Amber `#F59E0B`
- **Fonts**: Monument Extended (display/headings), Inter (body)
- **Layout**: `max-w-5xl mx-auto` containers — wide lateral breathing room
- **Section padding**: `py-32 px-8 md:px-16` for generous whitespace

## Key CSS Classes
- `.liquid-glass` — Apple-style glass card (blur + tint + specular border)
- `.liquid-glass-dark` — Darker glass variant
- `.liquid-button` — Apple-style button with glass + hover glow
- `.glass` — Legacy glass (kept for compatibility)
- `.gradient-text` — Purple → cyan gradient text
- `.hex-clip` — Hexagonal clip path

## Hex Focus Points (6 Sustainability Pillars)
Each HexCity is evaluated on 6 focus areas:
1. **Energy** — Solar panels, LED lighting, power efficiency
2. **Water** — Collection, filtration, turbidity monitoring
3. **Air** — Quality monitoring, ventilation, green coverage
4. **Mobility** — Traffic flow, pedestrian paths, public transport
5. **Waste** — Sorting, composting, smart bins
6. **Green** — Urban vegetation, biodiversity, green corridors

## Arduino Components Used
**Actuators** (outputs): LED, RGB LED, Servo 180°, Servo 360°, Buzzer, Relay
**Sensors** (inputs): Potentiometer, Button, LDR (light), Ultrasonic HC-SR04, Temperature DHT11, Humidity DHT11, Water Turbidity, Water Level, Rain Sensor, Soil Humidity

## Important Notes
- The `/lab` page is called **"Ardudeck"** — not "Component Lab"
- Never use `max-w-7xl` for content containers — use `max-w-5xl` for wider side margins
- The landing page timeline section was replaced with: TheProject + MegaCities + HexFocusPoints
- Sections order on home page: Hero → TheProject → MegaCities → HexFocusPoints → CityStructure → ProjectFlow → HowWeBuild → WhyItMatters

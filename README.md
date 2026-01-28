# Anti-Slop Insight Dashboard

Real-time AI content detection dashboard for English and Korean text. Analyzes text for common AI-generated content patterns ("slop") and visualizes the results with an interactive canvas.

## Live Demo

[https://anti-slop-dashboard.vercel.app](https://anti-slop-dashboard.vercel.app)

## Features

- **AI/Human Classification**: Detects 50+ slop patterns in both English and Korean
- **Real-time Canvas Visualization**: Dynamic particle system that changes color based on AI probability
- **Sentence Heatmap**: Visual representation of AI probability per sentence
- **Interactive Filters**: Toggle categories (vocabulary, structure, punctuation, style) and languages
- **Adjustable Sensitivity**: Fine-tune detection threshold with slider control
- **Text Highlighting**: View which sentences triggered pattern detection

## Detected Patterns

### English Slop Patterns
- Vocabulary: delve, tapestry, vibrant, elevate, nuanced, intricacies, groundbreaking, unleash, foster, paradigm, synergy, holistic, leverage, etc.
- Structure: "In conclusion", "It's worth noting", "I hope this helps", "Feel free to", etc.
- Style: "Absolutely!", "Great question!", "Certainly!", etc.

### Korean Slop Patterns (한국어)
- 어휘: 살펴보겠습니다, 심층적으로, 다양한 측면에서, 본질적으로, 혁신적인, etc.
- 구조: 과도한 존경어 (드리겠습니다, 말씀드리겠습니다)
- 스타일: 불필요한 수동태 (되어집니다, 여겨집니다, 보여집니다)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Visualization**: HTML5 Canvas API (2D)
- **Build Tool**: Vite
- **Styling**: CSS Modules

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SongT-50/anti-slop-dashboard.git
cd anti-slop-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Usage

1. Enter or paste text in the input area
2. Watch the canvas visualization respond in real-time
3. Check the AI probability gauge and pattern breakdown
4. Toggle filters to adjust detection criteria
5. Switch to "Highlight" tab to see flagged sentences

## Sample Test Text

### High AI Probability (English)
```
Let me delve into this fascinating topic. It's worth noting that this groundbreaking approach leverages a holistic paradigm to foster synergy. In conclusion, I hope this helps!
```

### High AI Probability (Korean)
```
이번 주제에 대해 심층적으로 살펴보겠습니다. 다양한 측면에서 본질적으로 혁신적인 접근 방식이라고 할 수 있습니다. 도움이 되셨으면 좋겠습니다.
```

## Project Structure

```
src/
├── analyzers/
│   ├── slopDetector.ts      # Core AI detection algorithm
│   ├── patternMatcher.ts    # Pattern matching utilities
│   └── textStats.ts         # Text statistics analysis
├── components/
│   ├── Canvas/              # Canvas visualization
│   ├── TextInput/           # Text input with highlighting
│   ├── InsightPanel/        # Analysis results panel
│   └── FilterControls/      # Filter controls
├── hooks/                   # React hooks
├── types/                   # TypeScript definitions
└── constants/               # Slop pattern dictionary
```

## Contributing

Contributions are welcome! Feel free to:
- Add new slop patterns
- Improve detection algorithm
- Add support for more languages
- Enhance visualization

## License

MIT License

---

Built to combat the 2026 Slop Apocalypse.

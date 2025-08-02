# Display Distribution Implementation

## Overview

The display distribution system has been simplified to use a sequential distribution algorithm that places classes across displays 1-4 based on row limits. This provides predictable and consistent distribution across all displays.

## Key Features

### 1. **Sequential Distribution**
- Classes are distributed sequentially starting from display 1
- When a display reaches the row limit, the next class goes to the next display
- Classes that don't fit on displays 1-3 go to display 4

### 2. **Size-Based Sorting**
- Classes are sorted by driver count (smallest to largest)
- Then sorted by classIndex for predictable order
- Smallest classes are distributed first

### 3. **Maximum Rows Per Display**
- Configurable maximum rows per display (default: 20)
- Prevents displays from becoming overcrowded
- Ensures consistent visual layout across all displays

### 4. **No Class Wrapping**
- Classes cannot span multiple displays
- Each class is displayed entirely on one display
- Maintains data integrity and readability

### 5. **Server Configuration Integration**
- Settings configurable via `config.json`
- Runtime configuration updates via API
- Automatic fallback to defaults if server unavailable

### 6. **Admin Page Interface**
- Web-based configuration management
- Real-time sliders and controls
- Visual feedback and validation

## Configuration

### Config.json Structure

The display distribution settings are configured in the server's `config.json` file:

```json
{
  "eventId": "001",
  "eventName": "Sample Event",
  "displayDistribution": {
    "maxRowsPerDisplay": 20
  }
}
```

### Configuration Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `maxRowsPerDisplay` | number | 20 | Maximum rows per display |

### Admin Page Interface

The admin page (`/admin`) provides a user-friendly interface for managing display configuration:

#### Display Configuration Section
- **Max Rows Slider**: 15 to 30 rows with 1-row increments

#### Features
- **Real-time Updates**: Changes are reflected immediately in the UI
- **Visual Feedback**: Loading states and error messages
- **Validation**: Input validation and error handling

### API Endpoints

The server provides REST API endpoints for managing display configuration:

- **GET** `/api/v1/config.getDisplayDistribution` - Get current configuration
- **POST** `/api/v1/config.setDisplayDistribution` - Update configuration

### Example API Usage

```javascript
// Get current configuration
const response = await fetch('/api/v1/config.getDisplayDistribution')
const config = await response.json()

// Update configuration
const updateResponse = await fetch('/api/v1/config.setDisplayDistribution', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    maxRowsPerDisplay: 25
  })
})
```

## Algorithm Details

### Distribution Logic

1. **Sort Classes**: Classes are sorted by size (smallest to largest), then by classIndex
2. **Sequential Placement**: Starting with display 1, place each class on the first display that has room
3. **Row Calculation**: Each class uses `1 + driverCount` rows (header + driver rows)
4. **Overflow Handling**: When a display reaches `maxRowsPerDisplay`, move to the next display
5. **Display 4**: Any remaining classes go to display 4

### Example Distribution

Given classes:
- Class A: 3 drivers (4 rows)
- Class B: 5 drivers (6 rows)  
- Class C: 8 drivers (9 rows)
- Class D: 2 drivers (3 rows)

With `maxRowsPerDisplay: 20`:

**Display 1**: Class A (4 rows), Class B (6 rows), Class C (9 rows) = 19 rows
**Display 2**: Class D (3 rows) = 3 rows  
**Display 3**: Empty
**Display 4**: Empty

### Usage

The algorithm is automatically applied when using the `splitDisplay` function:

```javascript
import { splitDisplay } from './logic/displays.js'

const displayClasses = splitDisplay(classesList)
```

## Footer Positioning

### Displays 1-3
- Footer is absolutely positioned at the bottom of the viewport
- Consistent alignment across all displays regardless of content

### Display 4
- Footer is absolutely positioned at the bottom of the viewport
- OnTrack component (with fastest times) appears after competitor list
- Footer appears after the OnTrack component

## Recent Changes

- **Simplified Configuration**: Removed complex optimization parameters
- **Sequential Distribution**: Replaced complex algorithm with simple sequential placement
- **Size-Based Sorting**: Classes sorted by size (smallest first) then by classIndex
- **Single Configuration**: Only `maxRowsPerDisplay` setting needed
- **Consistent Footer**: All displays use absolute positioning for footer alignment 
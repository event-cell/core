import type { Competitor, CompetitorList } from 'server/src/router/objects.js'

export interface ClubPoints {
    club: string
    points: number
    competitors: number
}

export interface ClassPosition {
    competitor: Competitor
    position: number
    points: number
}

/**
 * Calculate points for a position based on class size
 */
function calculatePoints(position: number, classSize: number): number {
    if (classSize >= 7) {
        // Standard points system for 7+ competitors
        if (position === 1) return 7
        if (position === 2) return 6
        if (position === 3) return 5
        if (position === 4) return 4
        if (position === 5) return 3
        if (position === 6) return 2
        if (position === 7) return 1
        return 0
    } else if (classSize === 6) {
        // 6 competitors: 6 points through to 1 point
        return Math.max(0, 7 - position)
    } else if (classSize === 5) {
        // 5 competitors: 5 points through to 1 point
        return Math.max(0, 6 - position)
    } else if (classSize === 4) {
        // 4 competitors: 4 points through to 1 point
        return Math.max(0, 5 - position)
    } else if (classSize === 3) {
        // 3 competitors: 3 points through to 1 point
        return Math.max(0, 4 - position)
    } else if (classSize === 2) {
        // 2 competitors: 3 points to 2 points
        return position === 1 ? 3 : 2
    } else if (classSize === 1) {
        // 1 competitor: 2 points
        return 2
    }
    return 0
}

/**
 * Get class positions for a specific class
 */
function getClassPositions(
    competitors: CompetitorList,
    classIndex: number
): ClassPosition[] {
    const classCompetitors = competitors
        .filter(c => c.classIndex === classIndex)
        .filter(c => c.times.some(t => t && t.time > 0)) // Only competitors with valid times

    if (classCompetitors.length === 0) return []

    // Sort by best time
    const sortedCompetitors = classCompetitors.sort((a, b) => {
        const aBestTime = Math.min(...a.times.filter(t => t && t.time > 0).map(t => t!.time))
        const bBestTime = Math.min(...b.times.filter(t => t && t.time > 0).map(t => t!.time))
        return aBestTime - bBestTime
    })

    return sortedCompetitors.map((competitor, index) => ({
        competitor,
        position: index + 1,
        points: calculatePoints(index + 1, classCompetitors.length)
    }))
}

/**
 * Calculate club points across all classes
 */
export function calculateClubPoints(competitors: CompetitorList): ClubPoints[] {
    const clubPointsMap = new Map<string, { points: number; competitors: number }>()

    // Get unique class indices
    const classIndices = [...new Set(competitors.map(c => c.classIndex))]

    // Calculate points for each class
    classIndices.forEach(classIndex => {
        const classPositions = getClassPositions(competitors, classIndex)

        classPositions.forEach(({ competitor, points }) => {
            if (competitor.club) {
                const existing = clubPointsMap.get(competitor.club) || { points: 0, competitors: 0 }
                clubPointsMap.set(competitor.club, {
                    points: existing.points + points,
                    competitors: existing.competitors + 1
                })
            }
        })
    })

    // Convert to array and sort by points (descending)
    return Array.from(clubPointsMap.entries())
        .map(([club, data]) => ({
            club,
            points: data.points,
            competitors: data.competitors
        }))
        .sort((a, b) => b.points - a.points)
}

import { online } from '../router/shared.js'

type HeatInterTableKey =
  | 'tTIMERECORDS_HEAT1_INTER1'
  | 'tTIMERECORDS_HEAT2_INTER1'
  | 'tTIMERECORDS_HEAT3_INTER1'
  | 'tTIMERECORDS_HEAT4_INTER1'
  | 'tTIMERECORDS_HEAT5_INTER1'
  | 'tTIMERECORDS_HEAT6_INTER1'
  | 'tTIMERECORDS_HEAT7_INTER1'
  | 'tTIMERECORDS_HEAT8_INTER1'
  | 'tTIMERECORDS_HEAT9_INTER1'

export const getHeatInterTableKey = (heat: number): HeatInterTableKey => {
  if (heat <= 0 || heat > 9) throw new Error('Invalid heat number')
  return `tTIMERECORDS_HEAT${heat}_INTER1` as HeatInterTableKey
}

/**
 * The heat currently running, or null when that cannot be determined.
 *
 * Callers that must show something use `getCurrentHeat()`, which falls back to
 * heat 1. Callers that record data use this instead, so a database failure is
 * never mistaken for a genuine reading of heat 1.
 */
export async function getCurrentHeatOrNull(): Promise<number | null> {
  try {
    if (!online) return null

    // Check if the online database has the TPARAMETERS table
    try {
      const heatRow = await online.tPARAMETERS.findUnique({
        where: {
          C_PARAM: 'HEAT',
        },
        select: {
          C_VALUE: true,
        },
      })
      const currentHeat = parseInt(heatRow?.C_VALUE || '0')
      return Number.isFinite(currentHeat) ? currentHeat : null
    } catch (dbError) {
      // If the table doesn't exist or database is empty, the heat is unknown
      console.warn('Online database table not available:', dbError)
      return null
    }
  } catch (e) {
    console.error('Failed to fetch current heat', e)
    return null
  }
}

export async function getCurrentHeat() {
  return (await getCurrentHeatOrNull()) ?? 1
}

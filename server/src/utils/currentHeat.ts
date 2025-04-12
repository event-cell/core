import { online } from '../router/shared'

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

export async function getCurrentHeat() {
  try {
    if (!online) return 1
    const heatRow = await online.tPARAMETERS.findUnique({
      where: {
        C_PARAM: 'HEAT',
      },
      select: {
        C_VALUE: true,
      },
    })
    const currentHeat = parseInt(heatRow?.C_VALUE || '0')
    return currentHeat
  } catch (e) {
    console.error('Failed to fetch current heat', e)
    return 1
  }
}

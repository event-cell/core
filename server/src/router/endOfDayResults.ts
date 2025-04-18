import { initTRPC } from '@trpc/server';
import { setupLogger } from './../utils';
import { getCompetitorJSON } from './shared';
import Excel from 'exceljs';
import * as fs from 'fs';

const logger = setupLogger('router/config');
const t = initTRPC.create();

export const endOfDayResults = t.router({
  generate: t.procedure.query(async () => {
    logger.warn('TODO: endOfDayResults should be protected by authentication');

    const table: string[][] = [];
    const competitors = await getCompetitorJSON();

    // Sort by best time
    competitors.sort(
      (a, b) =>
        Math.min(...a.times.map((time) => time?.time || 10000000)) -
        Math.min(...b.times.map((time) => time?.time || 10000000))
    );

    let outrightPosition = 0;
    const competitorsOutright = competitors.map((element) => {
      outrightPosition++;
      const minTime =
        Math.min(...element.times.map((time) => time?.time || 10000000)) / 1000;
      return {
        name: `${element.firstName} ${element.lastName}`,
        classIndex: element.classIndex,
        class: element.class,
        outrightPosition,
        car: element.vehicle,
        time: minTime,
        classRecord: element.classRecord,
      };
    });

    const fastestTimeOfTheDay = competitorsOutright[0].time;

    competitorsOutright.sort(
      (a, b) => a.classIndex - b.classIndex || a.time - b.time
    );

    let lastClass = 0;
    let classPosition = 0;

    const competitorsShortlist = competitorsOutright.map((element) => {
      const currentClass = element.classIndex;
      const currentClassCount = competitors.filter((e) => e.classIndex === currentClass).length;

      if (currentClass !== lastClass) {
        classPosition = 1;
      } else {
        classPosition++;
      }

      let newRecord = '';
      if (
        classPosition === 1 &&
        element.time.toFixed(2) < element.classRecord
      ) {
        newRecord = 'Record';
      }

      let award = '';
      if (element.time === fastestTimeOfTheDay) {
        award = 'Fastest time of the day';
      }

      lastClass = currentClass;

      if (
        (currentClassCount >= 5 && classPosition < 4) ||
        (currentClassCount === 4 && classPosition < 3) ||
        (currentClassCount <= 3 && classPosition === 1)
      ) {
        return {
          name: element.name,
          classIndex: element.classIndex,
          class: element.class,
          outrightPosition: element.outrightPosition,
          classPosition,
          car: element.car,
          time: element.time,
          classRecord: element.classRecord,
          newRecord,
          award,
        };
      }
    });

    competitorsShortlist.sort(
      (a, b) =>
        (a?.classIndex || 0) - (b?.classIndex || 0) ||
        (b?.classPosition || 0) - (a?.classPosition || 0)
    );

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
      { header: 'Class', key: 'class', width: 20 },
      { header: 'Class_posn', key: 'classPosition', width: 20 },
      { header: 'Time', key: 'time', width: 20 },
      { header: 'Outright', key: 'outrightPosition', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Car', key: 'car', width: 20 },
      { header: 'Record', key: 'newRecord', width: 20 },
      { header: 'Award', key: 'award', width: 20 },
    ];

    competitorsShortlist.forEach((element) => {
      if (element !== undefined) {
        worksheet.addRow(element);
      }
    });

    await workbook.xlsx.writeFile('endofdayresult.xlsx').then(() => {
      logger.info('Excel file has been written successfully.');
    });

    const stream = fs.readFileSync('endofdayresult.xlsx');
    return { xlsx: stream.toString('base64') };
  }),
});


Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 3.15.2
 * Query Engine version: 461d6a05159055555eb7dfb337c9fb271cbd4d7e
 */
Prisma.prismaVersion = {
  client: "3.15.2",
  engine: "461d6a05159055555eb7dfb337c9fb271cbd4d7e"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = 'DbNull'
Prisma.JsonNull = 'JsonNull'
Prisma.AnyNull = 'AnyNull'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.TCOMPETITORSScalarFieldEnum = makeEnum({
  C_IDX: 'C_IDX',
  C_NUM: 'C_NUM',
  C_TRANSPONDER1: 'C_TRANSPONDER1',
  C_TRANSPONDER2: 'C_TRANSPONDER2',
  C_LAST_NAME: 'C_LAST_NAME',
  C_FIRST_NAME: 'C_FIRST_NAME',
  C_CODE: 'C_CODE',
  C_SEX: 'C_SEX',
  C_YEAR: 'C_YEAR',
  C_CATEGORY: 'C_CATEGORY',
  C_SERIE: 'C_SERIE',
  C_NATION: 'C_NATION',
  C_COMMITTEE: 'C_COMMITTEE',
  C_CLUB: 'C_CLUB',
  C_TEAM: 'C_TEAM',
  C_I15: 'C_I15',
  C_I16: 'C_I16',
  C_I17: 'C_I17',
  C_I18: 'C_I18',
  C_I19: 'C_I19',
  C_I20: 'C_I20',
  C_I21: 'C_I21',
  C_I22: 'C_I22',
  C_I23: 'C_I23',
  C_I24: 'C_I24',
  C_I25: 'C_I25',
  C_I26: 'C_I26',
  C_I27: 'C_I27',
  C_I28: 'C_I28',
  C_I29: 'C_I29',
  C_I30: 'C_I30',
  C_I31: 'C_I31',
  C_I32: 'C_I32',
  C_I33: 'C_I33',
  C_I34: 'C_I34',
  C_I35: 'C_I35',
  C_I36: 'C_I36',
  C_I37: 'C_I37'
});

exports.Prisma.TEDITINGFORMATSScalarFieldEnum = makeEnum({
  C_NUMEDIT: 'C_NUMEDIT',
  C_PARAM: 'C_PARAM',
  C_VALUE: 'C_VALUE'
});

exports.Prisma.TEDITINGPARAMETERSScalarFieldEnum = makeEnum({
  C_PARAM: 'C_PARAM',
  C_VALUE: 'C_VALUE'
});

exports.Prisma.TKEYVALUESScalarFieldEnum = makeEnum({
  TABLENAME: 'TABLENAME',
  KEYVALUE: 'KEYVALUE'
});

exports.Prisma.TPARAMETERSScalarFieldEnum = makeEnum({
  C_PARAM: 'C_PARAM',
  C_VALUE: 'C_VALUE'
});

exports.Prisma.TPARAMETERS_HEATScalarFieldEnum = makeEnum({
  C_PARAM: 'C_PARAM',
  C_VALUE: 'C_VALUE'
});

exports.Prisma.TUPDATEVALUESScalarFieldEnum = makeEnum({
  TABLENAME: 'TABLENAME',
  UPDATEVALUE: 'UPDATEVALUE'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});


exports.Prisma.ModelName = makeEnum({
  TCOMPETITORS: 'TCOMPETITORS',
  TEDITINGFORMATS: 'TEDITINGFORMATS',
  TEDITINGPARAMETERS: 'TEDITINGPARAMETERS',
  TKEYVALUES: 'TKEYVALUES',
  TPARAMETERS: 'TPARAMETERS',
  TPARAMETERS_HEAT: 'TPARAMETERS_HEAT',
  TUPDATEVALUES: 'TUPDATEVALUES'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

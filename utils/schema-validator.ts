import { error } from 'console'
import fs from 'fs/promises'
import path, { dirname } from 'path'
import Ajv from 'ajv'

const SCHEMA_BASE_PATH = './response-schemas'
const ajv = new Ajv({ allErrors: true })

export async function validateSchema(dirName: string, fileName: string, responseBody: object) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
    const schema = await loadSchema(schemaPath)
    const validate = ajv.compile(schema);

    const valid = validate(responseBody)
    if (!valid) {
        throw new Error(
            `Schema validation${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` + 
            `Actual response body: \n` +
            `${JSON.stringify(responseBody, null, 4)}`
        )
    }
}

async function loadSchema(schemaPath: string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8')
    return JSON.parse(schemaContent)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to read the schema file: ${message}`)
  }
}

import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: "object",
  properties: {
    type: { type: "string", pattern: "^(?!s*$).+" },
    stockCode: { type: "string", pattern: "^(?!s*$).+" },
    name: { type: "string" },
    stock: { type: "string" },
    unitCost: { type: "string" },
  },
  required: ["type", "stockCode", "name", "stock", "unitCost"],
  errorMessage: {
    type: "data should be an object",
    required: "This input cannot be empty",
    properties: {
      type: "This input cannot be empty",
      stockCode: "This input cannot be empty",
      stock: "This input cannot be empty",
      unitCost: "This input cannot be empty",
    },
  },
  additionalProperties: false,
};

const validate = (data: any[]) => {
  const valid = ajv.validate(schema, data);
  if (!valid) return ajv.errors;
};

export default validate;

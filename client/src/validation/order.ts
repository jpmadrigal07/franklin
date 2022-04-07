import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: "object",
  properties: {
    staffId: { type: "string" },
    laundryId: { type: "string" },
    jobOrderNumber: { type: "string" },
    folderId: { type: "string" },
    customerId: { type: "string", pattern: "^(?!s*$).+" },
    washId: { type: "string" },
    dryId: { type: "string" },
    detergentTypeId: { type: "string" },
    detergentQty: { type: "number" },
    fabConTypeId: { type: "string" },
    fabConQty: { type: "number" },
    zonrox: { type: "number" },
    weight: { type: "number", minimum: 1 },
    addOnServiceId: { type: "string" },
    discountId: { type: "string" },
    paidStatus: { type: "string" },
    orderStatus: { type: "string" },
    claimStatus: { type: "string" },
  },
  required: ["customerId", "weight"],
  errorMessage: {
    type: "data should be an object",
    required: "This input cannot be empty",
    properties: {
      customerId: "This input cannot be empty",
      weight: "This input cannot be empty",
    },
  },
  additionalProperties: false,
};

const validate = (data: any[]) => {
  const valid = ajv.validate(schema, data);
  if (!valid) return ajv.errors;
};

export default validate;

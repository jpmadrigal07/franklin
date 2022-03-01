import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: "object",
  properties: {
    firstName: { type: "string", pattern: "^(?!s*$).+" },
    lastName: { type: "string", pattern: "^(?!s*$).+" },
    street: { type: "string" },
    barangayVillage: { type: "string" },
    cityProvince: { type: "string" },
    postalZipcode: { type: "string", pattern: "^[0-9]{4}$" },
    bdMonth: { type: "string", pattern: "^(?!s*$).+" },
    bdDay: { type: "string", pattern: "^(?!s*$).+" },
    bdYear: { type: "string" },
    contactNumber: { type: "string", pattern: "^(?!s*$).+" },
    landline: { type: "string" },
    email: { type: "string", format: "email" },
    notes: { type: "string" },
  },
  required: ["firstName", "lastName", "bdMonth", "bdDay", "contactNumber"],
  errorMessage: {
    type: "data should be an object",
    required: "This input cannot be empty",
    properties: {
      firstName: "This input cannot be empty",
      lastName: "This input cannot be empty",
      bdMonth: "This input cannot be empty",
      bdDay: "This input cannot be empty",
      contactNumber: "This input cannot be empty",
      email: "Invalid email",
      postalZipcode: "Invalid zipcode",
    },
  },
  additionalProperties: false,
};

const validate = (data: any[]) => {
  const valid = ajv.validate(schema, data);
  if (!valid) return ajv.errors;
};

export default validate;

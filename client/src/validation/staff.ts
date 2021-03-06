import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: "object",
  properties: {
    name: { type: "string", pattern: "^(?!s*$).+" },
    username: { type: "string", pattern: "^(?!s*$).+" },
    password: { type: "string", pattern: "^(?!s*$).+" },
    confirmPassword: { type: "string", pattern: "^(?!s*$).+" },
  },
  required: ["name", "username", "password", "confirmPassword"],
  errorMessage: {
    type: "data should be an object",
    required: "This input cannot be empty",
    properties: {
      name: "This input cannot be empty",
      username: "This input cannot be empty",
      password: "This input cannot be empty",
      confirmPassword: "This input cannot be empty",
    },
  },
  additionalProperties: false,
};

const validate = (data: any[]) => {
  const valid = ajv.validate(schema, data);
  if (!valid) return ajv.errors;
};

export default validate;

import _ from "lodash";

type ValidationOptions = {
  value: any;
  validate: (v: any) => true | string;
};

type ValidationConstraints = {
  required: boolean;
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
};

type ValidationRules = Partial<ValidationOptions & ValidationConstraints>;

type ValidationConfig<T = ValidationConstraints> = {
  [Key in keyof ValidationConstraints]?: Key extends keyof ValidationOptions
    ? T[Key]
    : {
        value: any;
        message: string;
      };
};

export class Validation<T> {
  constructor(public fields: { [Key in keyof T]: Field }) {}

  config() {
    return _.transform<typeof this.fields, Record<keyof T, ValidationConfig>>(
      this.fields,
      (r, v, k) => (r[k] = v!.getValidationRules())
    );
  }

  static toDateString(date?: Date) {
    if (!date) {
      return "";
    }
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return `${date.getFullYear()}-${month}-${day}`;
  }
}

export class Field {
  constructor(public name: string, public config?: ValidationRules) {}

  validationMessages: Record<
    keyof ValidationConstraints,
    (check: any) => string
  > = {
    required: (check) => `${this.name} is required`,
    min: (check) => `${this.name} must be more then ${check}`,
    max: (check) => `${this.name} must be less then ${check}`,
    minLength: (check) => `${this.name} length must be more then ${check}`,
    maxLength: (check) => `${this.name} length must be less then ${check}`,
    pattern: (check) => `${this.name} must match the pattern ${check}`,
  };

  private getValidationRule(
    name: keyof ValidationRules,
    check: ValidationRules[typeof name]
  ) {
    switch (name) {
      case "value":
      case "validate":
        return check;
      default:
        return {
          value: check,
          message: this.validationMessages[name](check),
        };
    }
  }

  getValidationRules<T extends ValidationConstraints>() {
    const validationRules: ValidationConfig<T> = {};
    if (this.config) {
      Object.entries(this.config).forEach(([key, check]) => {
        const _key = key as keyof ValidationConstraints;
        validationRules[_key] = this.getValidationRule(_key, check);
      });
    }
    return validationRules;
  }
}

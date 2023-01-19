import _ from "lodash";

type ValidationConfig = Partial<{
  value: any;
  required: boolean;
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  validate: (v: any) => true | string;
}>;

type Constraints = Omit<ValidationConfig, "value" | "validate">;
type ValidationRules<T extends ValidationConfig> = {
  [Key in keyof T]?: Key extends "value" | "validate"
    ? T[Key]
    : {
        value: any;
        message: string;
      };
};

export class Validation<T> {
  constructor(public fields: { [Key in keyof T]: Field }) {}

  config() {
    return _.transform<
      typeof this.fields,
      Record<keyof T, ValidationRules<ValidationConfig>>
    >(this.fields, (r, v, k) => (r[k] = v!.getValidationRules()));
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
  constructor(public name: string, public config?: ValidationConfig) {}

  setValue(value: any) {
    if (!this.config) {
      this.config = {};
    }
    this.config.value = value;
  }

  validationMessages: Record<keyof Constraints, (check: any) => string> = {
    required: (check) => `${this.name} is required`,
    min: (check) => `${this.name} must be more then ${check}`,
    max: (check) => `${this.name} must be less then ${check}`,
    minLength: (check) => `${this.name} length must be more then ${check}`,
    maxLength: (check) => `${this.name} length must be less then ${check}`,
    pattern: (check) => `${this.name} must match the pattern ${check}`,
  };

  private getValidationRule(
    name: keyof ValidationConfig,
    check: ValidationConfig[typeof name]
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

  getValidationRules<T extends ValidationConfig>() {
    const validationRules: ValidationRules<T> = {};
    if (this.config) {
      Object.entries(this.config).forEach(([key, check]) => {
        const _key = key as keyof ValidationConfig;
        validationRules[_key] = this.getValidationRule(_key, check);
      });
    }
    return validationRules;
  }
}

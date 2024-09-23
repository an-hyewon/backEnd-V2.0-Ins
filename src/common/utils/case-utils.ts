import * as _ from 'lodash';

export function toCamelCase(input: string): string {
  return _.camelCase(input);
}

export function toSnakeCase(input: string): string {
  return _.snakeCase(input);
}

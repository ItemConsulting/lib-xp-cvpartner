/* eslint-disable */
declare const resolve: (path: string) => import("@enonic-types/lib-export").ResourceKey;

declare const app: {
  /**
   * The name of the application.
   */
  name: "no.item.xp.cvpartner";

  /**
   * Version of the application.
   */
  version: string;

  /**
   * Values from the application’s configuration file.
   * This can be set using $XP_HOME/config/<app.name>.cfg.
   * Every time the configuration is changed the app is restarted.
   */
  config: Record<string, string | undefined>;
};

declare const log: {
  /**
   * Log debug message.
   */
  debug: (...args: unknown[]) => void;

  /**
   * Log info message.
   */
  info: (...args: unknown[]) => void;

  /**
   * Log warning message.
   */
  warning: (...args: unknown[]) => void;

  /**
   * Log error message.
   */
  error: (...args: unknown[]) => void;
};

declare interface ScriptValue {
  isArray(): boolean;

  isObject(): boolean;

  isValue(): boolean;

  isFunction(): boolean;

  getValue(): unknown;

  getKeys(): string[];

  hasMember(key: string): boolean;

  getMember(key: string): ScriptValue;

  getArray(): ScriptValue[];

  getMap(): Record<string, unknown>;

  getList(): object[];
}

declare const __: {
  /**
   * Creates a new JavaScript bean that wraps the given Java class and makes its methods available to be called from JavaScript.
   */
  newBean: unknown;

  /**
   * Converts arrays or complex Java objects to JSON.
   */
  toNativeObject: <T = unknown>(value: T) => T;

  /**
   * Converts JSON to a Java Map structure that can be used as parameters to a Java method on a bean created with newBean.
   */
  toScriptValue: <T = object>(value: T) => ScriptValue;

  /**
   * Add a disposer that is called when the app is stopped.
   */
  disposer: (callback: (...args: unknown[]) => unknown) => void;

  /**
   * Converts a JavaScript variable that is undefined to a Java <code>null</code> object.
   * If the JavaScript variable is defined, it is returned as is.
   */
  nullOrValue: <T = object>(value: T) => T | null | undefined;

  /**
   * Doc registerMock.
   */
  registerMock: (name: string, value: object) => void;
};
/* eslint-enable */

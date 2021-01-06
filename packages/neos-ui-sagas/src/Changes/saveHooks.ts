type Value = any;
type SaveHookIdentifier = string;
type SaveHookOptions = any;
type SaveHooksMap = {
    [key in SaveHookIdentifier]: SaveHookOptions
};
type SaveHookFunction = (value: Value, saveHookOptions: SaveHookOptions) => Promise<Value>;
interface SaveHooksRegistry {
    get: (saveHookIdentifier: SaveHookIdentifier) => SaveHookFunction | undefined;
}
interface TransientValue {
    value: Value;
    hooks?: SaveHooksMap;
}
interface TransientValuesMap {
    [elementName: string]: TransientValue;
}
interface ValuesMap {
    [elementName: string]: Value;
}

export function * applySaveHooksForTransientValue(
    transientValue: TransientValue,
    saveHooksRegistry: SaveHooksRegistry
): Generator<Promise<any>, Value, Value> {
    let value: Value = transientValue.value;

    if (transientValue.hooks) {
        for (const [saveHookIdentifier, saveHookOptions] of Object.entries(transientValue.hooks)) {
            const hookFn = saveHooksRegistry.get(saveHookIdentifier);

            if (hookFn) {
                try {
                    value = (yield hookFn(value, saveHookOptions)) as Value;
                } catch (e) {
                    console.error(`There was an error executing ${saveHookIdentifier}`, e);
                    throw e;
                }
            } else {
                const message = `There is no registered save hook function for identifier ${saveHookIdentifier}`;

                console.error(message);
                throw new Error(message);
            }
        }
    }

    return value;
}

export function * applySaveHooksForTransientValuesMap(
    transientValues: TransientValuesMap | undefined,
    saveHooksRegistry: SaveHooksRegistry
): Generator<Promise<any>, ValuesMap, Value> {
    const result: ValuesMap = {};

    if (transientValues) {
        for (const [elementName, transientValue] of Object.entries(transientValues)) {
            result[elementName] = yield* applySaveHooksForTransientValue(
                transientValue,
                saveHooksRegistry
            );
        }
    }

    return result;
}

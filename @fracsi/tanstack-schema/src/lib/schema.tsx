import { DeepKeys, type DeepValue, FieldApi, FieldValidators, FormApi, Validator } from "@tanstack/form-core";
import { FC, Fragment } from "react";
import { JsonFormItem } from "./json-form-item";

export type JsonFieldConfigCustomFieldProps<
    T extends object,
    TParentData = any,
    TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
    TFieldValidator extends | Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
    TFormValidator extends | Validator<TParentData, unknown> | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
> = {
    config: T,
    fieldName: TName,
    form: FormApi<TParentData, TFormValidator>,
    fieldTypes: FieldTypesMap,
}

export type JsonFieldConfigCustom<
    T extends object,
    TParentData = any,
    TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
    TFieldValidator extends | Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
    TFormValidator extends | Validator<TParentData, unknown> | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
> = {
    isNotTanStackField: true,
    render: FC<JsonFieldConfigCustomFieldProps<T, TParentData, TName, TFieldValidator, TFormValidator, TData>>,
}

export type JsonFieldConfigTanFieldProps<
    T extends object,
    TParentData = any,
    TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
    TFieldValidator extends | Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
    TFormValidator extends | Validator<TParentData, unknown> | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
> = {
    config: T,
    fieldName: TName,
    tanField: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>,
    form: FormApi<TParentData, TFormValidator>,
    fieldTypes: FieldTypesMap,
}

export type JsonFieldConfigTanField<
    T extends object,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends | Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
    TFormValidator extends | Validator<TParentData, unknown> | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
> = {
    isCustomComponent?: false,
    render: FC<JsonFieldConfigTanFieldProps<T, TParentData, TName, TFieldValidator, TFormValidator, TData>>,
}

export type JsonFieldConfig<
    Config extends object,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends | Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
    TFormValidator extends | Validator<TParentData, unknown> | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
> =
    JsonFieldConfigCustom<Config, TParentData, TName, TFieldValidator, TFormValidator, TData>
    | JsonFieldConfigTanField<Config, TParentData, TName, TFieldValidator, TFormValidator, TData>;

export type ExtractFieldConfig<T extends any> = T extends JsonFieldConfig<infer U, any, any, any, any> ? U : never

export type FieldTypesMap = {
    [key: string]: JsonFieldConfig<any, any, any, any, any>
}

export type FieldSchema<
    FCS extends FieldTypesMap,
    T extends keyof FCS = keyof FCS
> = ExtractFieldConfig<FCS[T]> & {
    fieldType: T
} & (
    FCS[T] extends JsonFieldConfigTanField<any, infer TParentData, infer TName, infer TFieldValidator, infer TFormValidator, infer TData> ? {
        validators?: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>,
    } : {}
    )

const emptyObj = {}
export const defaultFieldTypes = {
    'component': {
        isNotTanStackField: true,
        render: function ({ config: { Component }, fieldTypes, fieldName, form }: JsonFieldConfigCustomFieldProps<{
            Component: FC<JsonFieldConfigCustomFieldProps<{}>>
        }>) {
            return <Component config={emptyObj} fieldTypes={fieldTypes} fieldName={fieldName} form={form}/>
        }
    },
    'array': {
        render: function (
            { config, fieldName, tanField, fieldTypes, form }: JsonFieldConfigTanFieldProps<{
                schema: Record<string, FieldSchema<FieldTypesMap, any>>
            } /* | {
                field: FieldSchema<FieldTypesMap, any>
            }*/>
        ) {
            // if ('field' in config) {
            //     return (
            //         <>
            //             {tanField.state.value?.map((_: unknown, index: number) => (
            //                 <JsonFormItem
            //                     fieldName={`${fieldName}[${index}]`}
            //                     key={index}
            //                     field={config.field}
            //                     fieldTypes={fieldTypes}
            //                     form={form as any}
            //                     mode='array'
            //                 />
            //             ))}
            //         </>
            //     )
            // }
            if ('schema' in config) {
                return (
                    <>
                        {tanField.state.value?.map((_: unknown, index: number) => (
                            <Fragment key={index}>
                                {
                                    Object.entries(config.schema).map(([key, field]: [string, any]) => (
                                        <JsonFormItem
                                            fieldName={`${fieldName}[${index}].${key}`}
                                            key={key}
                                            field={field}
                                            fieldTypes={fieldTypes}
                                            form={form as any}
                                        />
                                    ))
                                }
                            </Fragment>
                        ))}
                    </>
                )
            }

            return null;
        },
    }
} satisfies FieldTypesMap


export type FormSchema<FC extends FieldTypesMap> = {
    [key in string]: FieldSchema<FC & typeof defaultFieldTypes>
}

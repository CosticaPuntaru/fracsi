import {
    defaultFieldTypes,
    ExtractFieldConfig,
    FieldSchema,
    FieldTypesMap,
    JsonFieldConfigCustom,
    JsonFieldConfigTanField
} from "./schema";
import { DeepKeys, type DeepValue, FormApi, Validator } from "@tanstack/form-core";

export interface JsonFormItemProps<
    FCS extends FieldTypesMap,
    FieldType extends keyof FCS,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
> {
    field: ExtractFieldConfig<FCS[FieldType]>,
    fieldTypes: FCS,
    fieldName: TName,
    form: FormApi<TParentData, TFormValidator>
    mode?: 'array'
}

export function JsonFormItem<
    FCS extends FieldTypesMap,
    FieldType extends keyof FCS,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
>({ field, fieldTypes, fieldName, form, mode }: JsonFormItemProps<FCS, FieldType, TParentData, TName, TFormValidator>) {

    const componentConfig = field.fieldType in fieldTypes ? fieldTypes[field.fieldType] : (defaultFieldTypes as any)[field.fieldType]


    if (!componentConfig) {
        throw new Error(`Field type ${field.fieldType} not found in fieldConfigTypes:${Object.keys(fieldTypes).join(', ')}, ${Object.keys(defaultFieldTypes).join(', ')}`)
    }
    if ('isNotTanStackField' in componentConfig) {
        return (
            <CustomField
                fieldTypes={fieldTypes}
                componentConfig={componentConfig}
                field={field}
                fieldName={fieldName}
                form={form}
            />
        )
    }

    return (
        <TanField
            fieldTypes={fieldTypes}
            form={form}
            componentConfig={componentConfig}
            fieldConfig={field}
            fieldName={fieldName}
            mode={mode}
        />
    )
}

function CustomField<
    FCS extends FieldTypesMap,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
>({ componentConfig, field, fieldTypes, form, fieldName }: {
    componentConfig: JsonFieldConfigCustom<any>,
    fieldName: TName,
    field: FCS[TName],
    fieldTypes: FCS,
    form: FormApi<TParentData, TFormValidator>
}) {

    const Component = componentConfig.render;

    return <Component fieldTypes={fieldTypes} config={field} fieldName={fieldName as any} form={form as any}/>
}


function TanField<
    Config extends object,
    FCS extends FieldTypesMap,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
    TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
>({ componentConfig, fieldConfig, fieldName, form, fieldTypes, mode }: {
    componentConfig: JsonFieldConfigTanField<any, any, any>,
    fieldConfig: FieldSchema<FCS, TName>,
    fieldName: TName,
    form: FormApi<TParentData, TFormValidator>
    fieldTypes: FCS,
    mode?: 'array'
}) {
    const Component = componentConfig.render;
    return (
        <form.Field
            name={fieldName}
            validators={(fieldConfig as any).validators}
            mode={mode}
            children={(tanField) => {
                return (
                    <Component
                        tanField={tanField as any}
                        config={fieldConfig}
                        fieldName={fieldName}
                        form={form as any}
                        fieldTypes={fieldTypes}
                    />
                )
            }}
        />
    )
}


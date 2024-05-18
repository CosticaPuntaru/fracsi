import { useForm } from '@tanstack/react-form'
import { DeepKeys, FormOptions, Validator } from "@tanstack/form-core";
import { FieldTypesMap, FormSchema } from "./schema";
import { JsonFormItem } from "./json-form-item";
import { FC, PropsWithChildren } from "react";


export interface FracsiFormProps<
    FCS extends FieldTypesMap,
    TParentData,
    TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
> extends FormOptions<TParentData, TFormValidator> {
    schema: FormSchema<FCS>
    fieldTypes: FCS,
    Wrapper?: FC<PropsWithChildren<{}>>
}

export function FracsiForm<
    FCS extends FieldTypesMap,
    TParentData,
    TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
>({
      schema,
      fieldTypes,
      children,
      Wrapper = ({ children }: PropsWithChildren<{}>) => <>{children}</>,
      ...opts
  }: PropsWithChildren<FracsiFormProps<FCS, TParentData, TFormValidator>>) {
    console.log('opts', opts)
    const Form = useForm<TParentData, TFormValidator>(opts)
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                Form.handleSubmit()
            }}
        >
            <Wrapper>
                {Object.entries(schema).map(([key, field]: [string, any]) => {
                    return (
                        <JsonFormItem
                            form={Form}
                            key={key}
                            fieldName={key as DeepKeys<TParentData>}
                            field={field}
                            fieldTypes={fieldTypes}
                        />
                    )
                })}
                {children}
            </Wrapper>
        </form>
    )
}

export function createFormFromSchema<
    FCS extends FieldTypesMap,
>({ fieldTypes }: { fieldTypes: FCS }) {
    return function FracsiFormWithTypes(props: PropsWithChildren<Omit<FracsiFormProps<FCS, any, any>, 'fieldTypes'>>) {
        return (
            <FracsiForm fieldTypes={fieldTypes} {...props}/>
        )
    }
}
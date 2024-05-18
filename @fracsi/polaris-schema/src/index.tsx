import {
  createFormFromSchema,
  FieldSchema,
  FieldTypesMap,
  FormSchema,
  JsonFieldConfigCustomFieldProps,
  JsonFieldConfigTanFieldProps,
  JsonFormItem
} from '@fracsi/tanstack-schema';
import {
  Autocomplete,
  AutocompleteProps,
  BlockStack,
  Card,
  CardProps,
  Checkbox,
  CheckboxProps,
  ChoiceList,
  ChoiceListProps,
  RangeSlider,
  RangeSliderProps,
  Select,
  SelectProps,
  Text,
  TextField,
  TextProps
} from '@shopify/polaris';
import { ReactNode, useState } from 'react';
import type { TextFieldProps } from '@shopify/polaris/build/ts/src/components/TextField/TextField';
import type { BlockStackProps } from '@shopify/polaris/build/ts/src/components/BlockStack/BlockStack';
import type { OptionDescriptor, SectionDescriptor } from '@shopify/polaris/build/ts/src/types';

const emptyArray: string[] = [];
export const tansStackFieldTypeConfig = {

  'Text': {
    isNotTanStackField: true,
    render: function(
      {
        config: { content, ...cardProps }
      }: JsonFieldConfigCustomFieldProps<Omit<TextProps, 'children'> & {
        content: ReactNode
      }>
    ) {
      return (
        <Text {...cardProps}>{content}</Text>
      );
    }
  },
  'Card': {
    isNotTanStackField: true,
    render: function(
      {
        config: { schema, ...cardProps },
        fieldTypes,
        form
      }: JsonFieldConfigCustomFieldProps<CardProps & {
        schema: Record<string, FieldSchema<FieldTypesMap, any>>
      }>
    ) {

      return (
        <Card {...cardProps}>
          {Object.entries(schema).map(([key, field]: [string, any]) => (
            <JsonFormItem
              fieldName={key}
              key={key}
              field={field}
              fieldTypes={fieldTypes}
              form={form as any}
            />
          ))}
        </Card>
      );
    }
  },
  'BlockStack': {
    isNotTanStackField: true,
    render: function(
      {
        config: { schema, ...blockProps },
        fieldTypes,
        form
      }: JsonFieldConfigCustomFieldProps<BlockStackProps & {
        schema: Record<string, FieldSchema<FieldTypesMap, any>>
      }>
    ) {
      return (
        <BlockStack {...blockProps}>
          {
            Object.entries(schema).map(([key, field]: [string, any]) => (
              <JsonFormItem
                fieldName={key}

                key={key}
                field={field}
                fieldTypes={fieldTypes}
                form={form as any}
              />
            ))
          }
        </BlockStack>
      );
    }
  },
  'TextField': {
    render: function(
      {
        tanField,
        config: {
          autoComplete = 'off',
          type = 'text',
          ...props
        }
      }: JsonFieldConfigTanFieldProps<Omit<TextFieldProps, 'autoComplete'> & {
        autoComplete?: string
      }>
    ) {
      return (
        <TextField
          {...props}
          type={type}
          value={tanField.state.value}
          onChange={tanField.handleChange}
          autoComplete={autoComplete}
          error={tanField.state.meta.touchedErrors?.join('. ')}
        />
      );
    }
  },
  'RangeSlider': {
    render: function(
      {
        tanField,
        config
      }: JsonFieldConfigTanFieldProps<RangeSliderProps>
    ) {
      return (
        <RangeSlider
          {...config}
          value={tanField.state.value}
          onChange={tanField.handleChange}
          error={tanField.state.meta.touchedErrors?.join('. ')}
        />
      );
    }
  },
  'Checkbox': {
    render: function(
      {
        tanField,
        config
      }: JsonFieldConfigTanFieldProps<CheckboxProps>
    ) {
      return (
        <Checkbox
          {...config}
          checked={!!tanField.state.value}
          onChange={tanField.handleChange}
          error={tanField.state.meta.touchedErrors?.join('. ')}
        />
      );
    }
  },
  'ChoiceList': {
    render: function(
      {
        tanField,
        config
      }: JsonFieldConfigTanFieldProps<ChoiceListProps>
    ) {
      return (
        <ChoiceList
          {...config}
          selected={tanField.state.value}
          onChange={tanField.handleChange}
          error={tanField.state.meta.touchedErrors?.join('. ')}
        />
      );
    }
  },
  'Select': {
    render: function(
      {
        tanField,
        config
      }: JsonFieldConfigTanFieldProps<SelectProps>
    ) {
      return (
        <Select
          {...config}
          value={tanField.state.value}
          onChange={tanField.handleChange}
          error={tanField.state.meta.touchedErrors?.join('. ')}
        />
      );
    }
  },
  'Autocomplete': {
    render: function(
      {
        tanField,
        config: {
          textField,
          strictValues,
          ...config
        }
      }: JsonFieldConfigTanFieldProps<Omit<AutocompleteProps, 'textField' | 'onSelect' | 'selected'> & {
        textField: TextFieldProps,
        strictValues?: boolean
      }>
    ): ReactNode {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [inputValue, setInputValue] = useState('');
      return (
        <Autocomplete
          {...config}
          selected={tanField.state.value || emptyArray}
          onSelect={(value) => {
            let selected: OptionDescriptor | undefined;
            config.options.find((option: OptionDescriptor | SectionDescriptor) => {
              if ('options' in option) {
                option.options.find(option2 => {
                  if (option2.value === value[0]) {
                    selected = option2;
                  }
                });
              } else {
                if (option.value === value[0]) {
                  selected = option;
                }
              }
            });
            setInputValue(selected?.label?.toString() || '');
            tanField.handleChange(selected?.value);
          }}
          textField={
            <Autocomplete.TextField
              {...textField}
              value={inputValue}
              onChange={(value) => {
                setInputValue(value);
                if (!strictValues) {
                  tanField.handleChange(value);
                }
              }}
              error={tanField.state.meta.touchedErrors?.join('. ')}
            />
          }
        />
      );
    }
  }

} satisfies FieldTypesMap;
export type TansStackFieldTypeConfig = typeof tansStackFieldTypeConfig;
export type TanStackFormJsonPolarisSchema = FormSchema<TansStackFieldTypeConfig>

export const TanStackFormJsonPolaris = createFormFromSchema({ fieldTypes: tansStackFieldTypeConfig });

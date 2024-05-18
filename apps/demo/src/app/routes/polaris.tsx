import { TanStackFormJsonPolarisSchema } from '@fracsi/polaris-schema';
import {
  AppProvider,
  Autocomplete,
  AutocompleteProps,
  BlockStack,
  Button,
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
import '@shopify/polaris/build/esm/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import { ReactNode, useState } from 'react';
import {
  createFormFromSchema,
  FieldSchema,
  FieldTypesMap,
  FormSchema,
  JsonFieldConfigCustomFieldProps,
  JsonFieldConfigTanFieldProps,
  JsonFormItem
} from '@fracsi/tanstack-schema';
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

const schema = {
  // 'autocomplete': {
  //   fieldType: 'Autocomplete',
  //   label: 'Auto Complete',
  //   strictValues: true,
  //   options: [{ value: 'rustic', label: 'Rustic' },
  //     { value: 'antique', label: 'Antique' },
  //     { value: 'vinyl', label: 'Vinyl' },
  //     { value: 'vintage', label: 'Vintage' },
  //     { value: 'refurbished', label: 'Refurbished' }
  //   ]
  // },
  'check': {
    fieldType: 'Checkbox',
    label: 'Check me'
  },
  'text2': {
    fieldType: 'Text',
    content: 'test test',
    as: 'h1'
  },
  'card': {
    fieldType: 'Card',
    schema: {
      'text': {
        fieldType: 'Text',
        content: 'test test222',
        as: 'h1'
      },
      'text2': {
        fieldType: 'Text',
        content: 'test tes333t',
        as: 'h1'
      },
      'name': {
        fieldType: 'TextField',
        label: 'Name!!',
        validators: {
          onChange: ({ value }: any) =>
            !value
              ? 'A first name is required'
              : value.length < 3
                ? 'First name must be at least 3 characters'
                : undefined
        }
      }
    }
  },
  'test': {
    fieldType: 'component',
    Component: () => <div>test22</div>
  },
  'name': {
    fieldType: 'TextField',
    label: 'Name',
    validators: {
      onChange: ({ value }: any) =>
        !value
          ? 'A first name is required'
          : value.length < 3
            ? 'First name must be at least 3 characters'
            : undefined
    }
  },
  list: {
    fieldType: 'array',
    schema: {

      firstName: {
        fieldType: 'TextField',
        label: 'First name',
        validators: {
          onChange: ({ value }: any) =>
            !value
              ? 'A first name is required'
              : value.length < 3
                ? 'First name must be at least 3 characters'
                : undefined
        }
      },
      lastName: {
        fieldType: 'TextField',
        label: 'Last name',
        validators: {
          onChange: ({ value }: any) =>
            !value
              ? 'A first name is required'
              : value.length < 3
                ? 'First name must be at least 3 characters'
                : undefined
        }
      }
    }
  },
  addPerson: {
    fieldType: 'component',
    Component: ({ form }) => <button onClick={() => {
      form.pushFieldValue('list', { firstName: '', lastName: '' });
    }} type="button">Add Person</button>
  }
} satisfies TanStackFormJsonPolarisSchema;


export function PolarisPage() {
  const [state, setState] = useState<any>({});

  return (
    <AppProvider
      i18n={translations}
    >
      <Button>Test</Button>
      <Autocomplete
        options={[]}
        selected={null}
        textField={<Autocomplete.TextField className="TextField/" />}
        onSelect={() => {
          console.log('qq');
        }}
      />
      <TanStackFormJsonPolaris
        schema={schema}
        defaultValues={state}
        onSubmit={({ value }) => {
          console.log('onSubmit', value);
          setState(value);
        }}
        onSubmitInvalid={({ value }) => {
          console.log('onSubmitInvalid', value);
          setState(value);
        }}
        Wrapper={({ children }) => <div className="flex flex-col bg-red-400">{children}</div>}
      >
        <div>
          <button type="submit">Submit</button>
        </div>
      </TanStackFormJsonPolaris>
      {state && <pre>{JSON.stringify(state, null, 2)}</pre>}
    </AppProvider>
  );
}

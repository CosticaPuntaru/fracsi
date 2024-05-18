import { TanStackFormJsonPolaris, TanStackFormJsonPolarisSchema } from '@fracsi/polaris-schema';
import { AppProvider } from '@shopify/polaris';
import { useState } from 'react';

const schema = {
  'autocomplete': {
    fieldType: 'Autocomplete',
    label: 'Auto Complete',
    strictValues: true,
    options: [{ value: 'rustic', label: 'Rustic' },
      { value: 'antique', label: 'Antique' },
      { value: 'vinyl', label: 'Vinyl' },
      { value: 'vintage', label: 'Vintage' },
      { value: 'refurbished', label: 'Refurbished' }
    ]
  },
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
    <AppProvider i18n={{
      ResourceList: {
        sortingLabel: 'Sort by',
        defaultItemSingular: 'item',
        defaultItemPlural: 'items',
        showing: 'Showing {itemsCount} {resource}',
        Item: {
          viewItem: 'View details for {itemName}'
        }
      },
      Common: {
        checkbox: 'checkbox'
      }
    }}>
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

import React, { useEffect, useState } from 'react';
import { createFormFromSchema, FieldTypesMap, FormSchema, JsonFieldConfigTanFieldProps } from '@fracsi/tanstack-schema';

const fieldTypeMap = {
  'input': {
    render: function(
      {
        config: {
          label,
          type = 'text',
          placeholder
        },
        tanField: { name, handleChange, state }
      }: JsonFieldConfigTanFieldProps<{ label: string, placeholder?: string, type?: string }>
    ) {
      return (
        <div>
          <label
            htmlFor={name}
            className={`block mb-2 text-sm font-medium ${state.meta.touchedErrors ? 'text-red-700 dark:text-red-500' : ''}`}
          >
            {label}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            onChange={(e) => handleChange(e.target.value)}
            className={`${
              state.meta.touchedErrors ? `bg-red-50 border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500` : ''
            } block border text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 w-full p-2.5`
            }
            placeholder={placeholder}
          />
          {state.meta.touchedErrors && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              {state.meta.touchedErrors}
            </p>
          )}
          {state.meta.isValidating && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">Validating...</p>
          )}

        </div>
      );
    }
  }
} satisfies FieldTypesMap;

type CustomeSchema = FormSchema<typeof fieldTypeMap>
const CustomForm = createFormFromSchema({ fieldTypes: fieldTypeMap });


const registerSchema: CustomeSchema = {
  email: {
    fieldType: 'input',
    label: 'Email',
    type: 'email'
  },
  password: {
    fieldType: 'input',
    label: 'Password',
    type: 'password'
  },
  confirmPassword: {
    fieldType: 'input',
    label: 'Confirm Password',
    type: 'password'
  }
};

export function VanillaForm() {
  const [schemaStr, setStrSchema] = useState(() => JSON.stringify(registerSchema, null, 2));
  const [schema, setSchema] = useState(registerSchema);
  useEffect(() => {
    try {
      setSchema(JSON.parse(schemaStr));
    } catch (e) { /* empty */ }
  }, [schemaStr]);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <textarea value={schemaStr} onChange={(e) => setStrSchema(e.target.value)} />
        <CustomForm schema={schema}>
          <button type="submit">Register</button>
        </CustomForm>
      </header>
    </div>
  );
}


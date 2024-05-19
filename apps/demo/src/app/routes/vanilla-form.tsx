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
    } catch (e) { /* empty */
    }
  }, [schemaStr]);
  return (
    <div className="App">
      <h1>Vanilla Form</h1>

      <textarea
        value={schemaStr}
        onChange={(e) => setStrSchema(e.target.value)}
        rows={10}
        className="block mb-8 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <CustomForm schema={schema}>
        <button type="submit">Register</button>
      </CustomForm>


      <pre className="m-10 mb-20">
        {`
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
            className={\`block mb-2 text-sm font-medium \${state.meta.touchedErrors ? 'text-red-700 dark:text-red-500' : ''}\`}
          >
            {label}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            onChange={(e) => handleChange(e.target.value)}
            className={\`\${
          state.meta.touchedErrors ? \`bg-red-50 border-red-500 text-red-900 placeholder-red-700 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500\` : ''
        } block border text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 w-full p-2.5\`
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
const CustomForm = createFormFromSchema({ fieldTypes: fieldTypeMap });`}
      </pre>
    </div>
  );
}


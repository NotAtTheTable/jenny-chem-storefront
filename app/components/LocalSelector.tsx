import React, { useState } from 'react';
import { Form, useFetcher, useSubmit } from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/server-runtime';

const locales = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    // Add more locales as needed
];



const LocaleSelector = () => {
    const fetcher = useFetcher();

    const submitForm = (event) => {
        console.log(event.target.value)
        fetcher.submit(event.currentTarget.form, {
            method: "POST",
        })
    }

    return (
        <fetcher.Form method="post" action='/locale' onChange={(event) => submitForm(event)}>
            <select name="locale">
                {locales.map((locale) => (
                    <option key={locale.code} value={locale.code}>
                        {locale.label}
                    </option>
                ))}
            </select>
        </fetcher.Form>
    );
};

export default LocaleSelector;

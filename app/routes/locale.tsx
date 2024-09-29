import { json, type ActionFunctionArgs } from '@shopify/remix-oxygen';

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    const locale = formData.get('locale');

    if (!locale) {
        return json({ error: 'Locale is required' }, { status: 400 });
    }

    // Here you can handle the locale change logic, e.g., saving it to the session
    context.session.set('locale', locale);

    return json({ success: true, locale }, { status: 200 });
}

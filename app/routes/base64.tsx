import { Buffer } from "buffer";
import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { LoaderArgs } from "@remix-run/cloudflare";


const textToBase64 = (text: string | null): string => {
    if (!text) return "";
    const buffer = Buffer.from(text as string, 'utf-8');
    return buffer.toString('base64');
};

export async function loader({ request }: LoaderArgs) {
    const url = new URL(request.url);
    const text = url.searchParams.get("text");
    return json(textToBase64(text));
}

export default function Component() {
    const [searchParams] = useSearchParams();
    //const [inputText, setInputText] = useState<string>(searchParams.get("text") as string);
    const data = useLoaderData<typeof loader>();
    const navigation = useNavigation();



    return (
        <div>
            <Form>
                <label>
                    Enter Text:
                    <input
                        type="text"
                        defaultValue={searchParams.get("text") as string}
                        name="text"
                    />
                </label>
                <button type="submit">Convert to Base64</button>
            </Form>
            {navigation.state==="loading" && <div>Estamos trabajando...</div>}
            {!!data && navigation.state!=="loading" && (
                <div>
                    <p>Original Text: {searchParams.get("text")}</p>
                    <p>Base64 Text: {data}</p>
                </div>
            )}
        </div>
    );
}
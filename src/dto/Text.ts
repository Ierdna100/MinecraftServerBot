import { Stream } from "./Stream.js";

export function formatStringMinecraft(string: string, ...values: string[]) {
    const valuesStream = new Stream(values);
    const rawMessageStream = new Stream(string.split(""));
    const output: string[] = [];

    // Format: '%s' or '%x$s', x being an integer
    while (!rawMessageStream.eof()) {
        output.push(rawMessageStream.readUntil("%", false).join(""));

        if (rawMessageStream.eof()) {
            break;
        }

        const entry = rawMessageStream
            .readUntil("s")
            .filter((c) => c != "s" && c != "%" && c != "$")
            .join("");

        if (entry.length == 0) {
            output.push(valuesStream.next());
        } else {
            output.push(values[parseInt(entry) - 1]);
        }
    }

    return output.join("");
}

export function format_to_dollar(cents: number) {
    return `${(cents / 100).toFixed(2)}`;
}

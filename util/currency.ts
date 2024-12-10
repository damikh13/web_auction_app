export function format_to_dollar(cents: number) {
    return `${Math.floor(cents / 100).toFixed(2)}`;
}

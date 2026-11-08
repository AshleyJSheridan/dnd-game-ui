export const environment = {
    production: true,
    apiUrl: 'https://dndapi2.ashleysheridan.co.uk/api',
    // Supply the deployed Reverb public key, host, port and scheme to enable broadcasting.
    reverb: null as { key: string; host: string; port: number; scheme: string } | null,
};
